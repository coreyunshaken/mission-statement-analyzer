import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define the structure for our analysis
interface MissionAnalysis {
  scores: {
    clarity: number
    specificity: number
    impact: number
    authenticity: number
    memorability: number
    overall: number
  }
  analysis: {
    clarity: {
      score: number
      reasoning: string
      strengths: string[]
      improvements: string[]
    }
    specificity: {
      score: number
      reasoning: string
      strengths: string[]
      improvements: string[]
    }
    impact: {
      score: number
      reasoning: string
      strengths: string[]
      improvements: string[]
    }
    authenticity: {
      score: number
      reasoning: string
      strengths: string[]
      improvements: string[]
    }
    memorability: {
      score: number
      reasoning: string
      strengths: string[]
      improvements: string[]
    }
  }
  weaknesses: {
    primary: string
    secondary: string
    tertiary: string
  }
  recommendations: {
    category: string
    issue: string
    suggestion: string
  }[]
  alternativeRewrites: {
    actionFocused: {
      text: string
      rationale: string
      improvesOn: string[]
    }
    problemSolution: {
      text: string
      rationale: string
      improvesOn: string[]
    }
    visionDriven: {
      text: string
      rationale: string
      improvesOn: string[]
    }
  }
}

const getIndustryContext = (industry: string): string => {
  const contexts: Record<string, string> = {
    technology: "Innovation focus, disruption potential, scalability, technical advancement",
    healthcare: "Patient outcomes, research impact, accessibility, life improvement",
    finance: "Trust, security, accessibility, economic empowerment",
    retail: "Customer experience, value proposition, convenience, lifestyle enhancement",
    nonprofit: "Social impact, community benefit, humanitarian goals, sustainability",
    manufacturing: "Quality, efficiency, innovation, environmental responsibility",
    education: "Learning outcomes, accessibility, knowledge advancement, student success",
    hospitality: "Guest experience, service excellence, memorable moments, comfort",
    energy: "Sustainability, innovation, reliability, environmental stewardship",
    transportation: "Mobility, safety, efficiency, connectivity",
    media: "Content quality, audience engagement, information access, entertainment value",
    agriculture: "Food security, sustainability, innovation, farmer support",
    realestate: "Community building, lifestyle enhancement, investment value, quality spaces"
  }
  return contexts[industry] || "Industry excellence, customer value, sustainable growth"
}

const getAnalysisPrompt = (mission: string, industry: string) => `You are an expert brand strategist analyzing mission statements using Fortune 500 standards. 

Analyze the following mission statement for a ${industry} company:

Mission Statement: "${mission}"
Industry: ${industry}

Consider industry-specific factors:
- ${getIndustryContext(industry)}

Provide a comprehensive analysis with scores (0-100) for each metric:

1. CLARITY (0-100): How clear, simple, and understandable is the statement?
   - Consider: Word count (8-35 optimal), jargon/buzzwords, readability
   - Industry context: Is it clear for ${industry} stakeholders?

2. SPECIFICITY (0-100): How specific is it about what the company does?
   - Consider: Action verbs, industry terms, unique value proposition
   - Industry focus: Does it clearly relate to ${industry} operations?

3. IMPACT (0-100): Does it convey meaningful change or benefit?
   - Consider: Scope of influence, transformation potential
   - Industry impact: How does it address ${industry} challenges?

4. AUTHENTICITY (0-100): Does it feel genuine vs corporate speak?
   - Consider: Industry-appropriate language, genuine commitment
   - ${industry} authenticity: Does it resonate with industry values?

5. MEMORABILITY (0-100): Is it easy to remember and repeat?
   - Consider: Length, structure, emotional resonance
   - Industry relevance: Will ${industry} professionals remember it?

For each metric, provide:
- A score (0-100)
- Brief reasoning
- 2-3 specific strengths
- 2-3 specific improvements

After analyzing all metrics, identify:
- The 3 biggest weaknesses in order of importance (primary, secondary, tertiary)
- Consider which low scores have the most impact on overall effectiveness

Then provide:
- 3-5 specific recommendations for improvement
- 3 alternative rewrites specifically designed to address the identified weaknesses:
  
  1. Action-focused version: Emphasize strong verbs and concrete outcomes
     - Must directly address the primary weakness
     - Include clear action verbs relevant to ${industry}
     - Show what the company DOES, not just aspires to
  
  2. Problem-solution version: Highlight the problem you solve
     - Frame around the specific ${industry} challenge you address
     - Make the customer's pain point clear
     - Show your unique solution
  
  3. Vision-driven version: Paint a picture of the future you're creating
     - Address the impact weakness if present
     - Be aspirational but specific to ${industry}
     - Show the transformed world you're building

For each alternative, provide:
- "text": The rewritten mission statement
- "rationale": Why this version works better (2-3 sentences)
- "improvesOn": Array of specific weaknesses it addresses ["clarity", "impact", etc.]

Ensure each alternative:
- Is between 10-25 words
- Sounds natural and authentic
- Is memorable and unique
- Directly improves on identified weaknesses
- Fits ${industry} context and language

Return the complete analysis in valid JSON format.`

export async function POST(request: NextRequest) {
  try {
    const { mission, industry = 'technology' } = await request.json()

    if (!mission || typeof mission !== 'string') {
      return NextResponse.json(
        { error: 'Mission statement is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      // Return fallback analysis using original logic
      return NextResponse.json({
        fallback: true,
        message: 'AI analysis not available. Using standard analysis.'
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert brand strategist. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: getAnalysisPrompt(mission, industry)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const aiResponse = completion.choices[0].message.content
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    const analysis: MissionAnalysis = JSON.parse(aiResponse)

    // Calculate overall score with weighted average
    const overallScore = Math.round(
      analysis.scores.clarity * 0.25 +
      analysis.scores.specificity * 0.25 +
      analysis.scores.impact * 0.25 +
      analysis.scores.authenticity * 0.15 +
      analysis.scores.memorability * 0.1
    )

    analysis.scores.overall = overallScore

    // Optionally save the analysis if user is logged in
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getUserFromToken(token) : null
    
    if (user) {
      try {
        const savedAnalysis = await prisma.analysis.create({
          data: {
            userId: user.id,
            missionText: mission,
            industry,
            wordCount: mission.trim().split(/\s+/).length,
            overallScore,
            clarityScore: analysis.scores.clarity,
            specificityScore: analysis.scores.specificity,
            impactScore: analysis.scores.impact,
            authenticityScore: analysis.scores.authenticity,
            memorabilityScore: analysis.scores.memorability,
            fullAnalysis: analysis.analysis,
            weaknesses: analysis.weaknesses,
            recommendations: analysis.recommendations,
            alternatives: analysis.alternativeRewrites,
            isAiAnalysis: true
          }
        })
        
        return NextResponse.json({
          ...analysis,
          saved: true,
          analysisId: savedAnalysis.id
        })
      } catch (error) {
        console.error('Error saving analysis:', error)
        // Continue without saving
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing mission statement:', error)
    
    // Return error with fallback flag
    return NextResponse.json(
      { 
        error: 'Failed to analyze mission statement',
        fallback: true,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
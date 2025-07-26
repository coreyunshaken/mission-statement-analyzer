import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET /api/analyses - Get user's analyses
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getUserFromToken(token) : null

    // For authenticated users, get their analyses
    if (user) {
      const analyses = await prisma.analysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return NextResponse.json({ analyses })
    }

    // For anonymous users, return empty array
    return NextResponse.json({ analyses: [] })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}

// POST /api/analyses - Save a new analysis
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getUserFromToken(token) : null
    
    const data = await request.json()
    const {
      missionText,
      industry,
      scores,
      analysis,
      weaknesses,
      recommendations,
      alternativeRewrites
    } = data

    // Calculate word count
    const wordCount = missionText.trim().split(/\s+/).length

    // Save analysis (with or without user)
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: user?.id,
        missionText,
        industry,
        wordCount,
        overallScore: scores.overall,
        clarityScore: scores.clarity,
        specificityScore: scores.specificity,
        impactScore: scores.impact,
        authenticityScore: scores.authenticity,
        memorabilityScore: scores.memorability,
        fullAnalysis: analysis,
        weaknesses: weaknesses,
        recommendations: recommendations,
        alternatives: alternativeRewrites,
        isAiAnalysis: true
      }
    })

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id
    })
  } catch (error) {
    console.error('Error saving analysis:', error)
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    )
  }
}
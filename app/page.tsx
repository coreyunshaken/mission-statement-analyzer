"use client"

import type React from "react"

import { useState, useMemo, useEffect, useCallback, lazy, Suspense } from "react"
import { Mountain, Check, Mail, User, Building, Briefcase, Sparkles, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Lazy load heavy components
const WorkshopMode = lazy(() => import("@/components/WorkshopMode").then(module => ({ default: module.WorkshopMode })))
const ABTesting = lazy(() => import("@/components/ABTesting").then(module => ({ default: module.ABTesting })))
const AnalysisResults = lazy(() => import("@/components/AnalysisResults").then(module => ({ default: module.AnalysisResults })))
const AdvancedAnalytics = lazy(() => import("@/components/AdvancedAnalytics").then(module => ({ default: module.AdvancedAnalytics })))
const ExportIntegrationSimple = lazy(() => import("@/components/ExportIntegrationSimple").then(module => ({ default: module.ExportIntegrationSimple })))

const industries = [
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "retail", label: "Retail", icon: "🛍️" },
  { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "nonprofit", label: "Non-Profit", icon: "🤝" },
  { value: "hospitality", label: "Hospitality", icon: "🏨" },
  { value: "energy", label: "Energy", icon: "⚡" },
  { value: "transportation", label: "Transportation", icon: "🚗" },
  { value: "media", label: "Media & Entertainment", icon: "🎬" },
  { value: "agriculture", label: "Agriculture", icon: "🌾" },
  { value: "realestate", label: "Real Estate", icon: "🏠" },
  { value: "other", label: "Other", icon: "🏢" },
]

const industryExamples = {
  technology: [
    {
      name: "Tesla",
      mission: "To accelerate the world's transition to sustainable energy.",
      score: 91,
    },
    {
      name: "Google",
      mission: "To organize the world's information and make it universally accessible and useful.",
      score: 91,
    },
    {
      name: "Microsoft",
      mission: "To empower every person and every organization on the planet to achieve more.",
      score: 88,
    },
  ],
  healthcare: [
    {
      name: "Mayo Clinic",
      mission: "To inspire hope and promote health through integrated clinical practice, education and research.",
      score: 89,
    },
    {
      name: "CVS Health",
      mission: "Helping people on their path to better health.",
      score: 85,
    },
    {
      name: "Johnson & Johnson",
      mission: "To help people everywhere live longer, healthier, happier lives.",
      score: 87,
    },
  ],
  finance: [
    {
      name: "JPMorgan Chase",
      mission: "To be the best financial services company in the world.",
      score: 78,
    },
    {
      name: "PayPal",
      mission: "To democratize financial services to ensure that everyone has access to affordable, convenient, and secure products.",
      score: 88,
    },
    {
      name: "Mastercard",
      mission: "Connecting everyone to priceless possibilities.",
      score: 82,
    },
  ],
  retail: [
    {
      name: "Amazon",
      mission: "To be Earth's most customer-centric company.",
      score: 86,
    },
    {
      name: "Walmart",
      mission: "To help people save money so they can live better.",
      score: 90,
    },
    {
      name: "Target",
      mission: "To help all families discover the joy of everyday life.",
      score: 84,
    },
  ],
  manufacturing: [
    {
      name: "3M",
      mission: "To improve lives through science-based innovations.",
      score: 85,
    },
    {
      name: "General Electric",
      mission: "Building a world that works.",
      score: 82,
    },
    {
      name: "Caterpillar",
      mission: "To enable economic growth through infrastructure and energy development.",
      score: 87,
    },
  ],
  education: [
    {
      name: "Khan Academy",
      mission: "To provide a free, world-class education for anyone, anywhere.",
      score: 93,
    },
    {
      name: "Pearson",
      mission: "To help people make progress in their lives through learning.",
      score: 86,
    },
    {
      name: "Coursera",
      mission: "To provide universal access to world-class learning.",
      score: 89,
    },
  ],
  nonprofit: [
    {
      name: "Red Cross",
      mission: "To prevent and alleviate human suffering in the face of emergencies.",
      score: 92,
    },
    {
      name: "UNICEF",
      mission: "To advocate for the protection of children's rights and help meet their basic needs.",
      score: 90,
    },
    {
      name: "WWF",
      mission: "To stop the degradation of the planet's natural environment and build a future where people live in harmony with nature.",
      score: 89,
    },
  ],
  hospitality: [
    {
      name: "Marriott",
      mission: "To enhance lives through remarkable hospitality experiences.",
      score: 84,
    },
    {
      name: "Airbnb",
      mission: "To create a world where anyone can belong anywhere.",
      score: 88,
    },
    {
      name: "Hilton",
      mission: "To fill the earth with the light and warmth of hospitality.",
      score: 86,
    },
  ],
  energy: [
    {
      name: "ExxonMobil",
      mission: "To be the world's premier petroleum and petrochemical company.",
      score: 76,
    },
    {
      name: "NextEra Energy",
      mission: "To be the leading clean energy company.",
      score: 83,
    },
    {
      name: "Shell",
      mission: "To power progress through more and cleaner energy solutions.",
      score: 85,
    },
  ],
  transportation: [
    {
      name: "FedEx",
      mission: "To connect people and possibilities around the world.",
      score: 88,
    },
    {
      name: "Southwest Airlines",
      mission: "To connect people to what's important in their lives through friendly, reliable, low-cost air travel.",
      score: 91,
    },
    {
      name: "Uber",
      mission: "To ignite opportunity by setting the world in motion.",
      score: 87,
    },
  ],
  media: [
    {
      name: "Disney",
      mission: "To entertain, inform and inspire people around the globe.",
      score: 89,
    },
    {
      name: "Netflix",
      mission: "To entertain the world.",
      score: 81,
    },
    {
      name: "Spotify",
      mission: "To unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art.",
      score: 90,
    },
  ],
  agriculture: [
    {
      name: "John Deere",
      mission: "To serve those linked to the land with the finest in equipment, information, parts and service.",
      score: 84,
    },
    {
      name: "Cargill",
      mission: "To nourish the world in a safe, responsible and sustainable way.",
      score: 88,
    },
    {
      name: "Tyson Foods",
      mission: "To raise the world's expectations for how much good food can do.",
      score: 87,
    },
  ],
  realestate: [
    {
      name: "CBRE",
      mission: "To realize the potential of real estate.",
      score: 79,
    },
    {
      name: "RE/MAX",
      mission: "To be the worldwide real estate leader.",
      score: 75,
    },
    {
      name: "Zillow",
      mission: "To give people the power to unlock life's next chapter.",
      score: 86,
    },
  ],
  other: [
    {
      name: "IBM",
      mission: "To be the catalyst that makes the world work better.",
      score: 85,
    },
    {
      name: "McKinsey",
      mission: "To help create positive, enduring change in the world.",
      score: 88,
    },
    {
      name: "Deloitte",
      mission: "To make an impact that matters.",
      score: 82,
    },
  ],
}

// Industry-specific benchmark data
const industryBenchmarks = {
  technology: { average: 78, top25: 87, top10: 93, median: 76 },
  healthcare: { average: 75, top25: 84, top10: 90, median: 73 },
  finance: { average: 72, top25: 82, top10: 88, median: 70 },
  retail: { average: 74, top25: 83, top10: 89, median: 72 },
  manufacturing: { average: 71, top25: 80, top10: 86, median: 69 },
  education: { average: 79, top25: 88, top10: 94, median: 77 },
  nonprofit: { average: 81, top25: 89, top10: 95, median: 80 },
  hospitality: { average: 76, top25: 85, top10: 91, median: 74 },
  energy: { average: 69, top25: 78, top10: 84, median: 67 },
  transportation: { average: 77, top25: 86, top10: 92, median: 75 },
  media: { average: 80, top25: 88, top10: 94, median: 78 },
  agriculture: { average: 73, top25: 82, top10: 88, median: 71 },
  realestate: { average: 70, top25: 79, top10: 85, median: 68 },
  other: { average: 74, top25: 83, top10: 89, median: 72 },
}

// Calculate percentile ranking
function calculatePercentile(score: number, industry: string): number {
  const benchmark = industryBenchmarks[industry as keyof typeof industryBenchmarks] || industryBenchmarks.other
  
  // Simple percentile calculation based on industry distribution
  if (score >= benchmark.top10) return Math.min(95, 85 + (score - benchmark.top10) * 2)
  if (score >= benchmark.top25) return Math.min(85, 65 + (score - benchmark.top25) * 3)
  if (score >= benchmark.median) return Math.min(65, 35 + (score - benchmark.median) * 2.5)
  if (score >= benchmark.average - 10) return Math.min(35, 15 + (score - (benchmark.average - 10)) * 2)
  return Math.max(5, score * 0.25)
}

// Get performance band
function getPerformanceBand(score: number): string {
  if (score >= 90) return "Exceptional"
  if (score >= 80) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs Improvement"
}

// Get expanded benchmark companies for industry
function getIndustryBenchmarkCompanies(industry: string, userScore: number) {
  const examples = industryExamples[industry as keyof typeof industryExamples] || industryExamples.technology
  
  // Convert industry examples to consistent format
  const industryCompanies = examples.map(company => ({
    name: company.name,
    score: company.score,
    isUser: false
  }))
  
  // Add more companies from other industries for broader comparison
  const allCompanies = [
    ...industryCompanies,
    { name: "Your Company", score: userScore, isUser: true },
    // Add top performers from other industries for context
    { name: "Khan Academy", score: 93, isUser: false },
    { name: "Red Cross", score: 92, isUser: false },
    { name: "Southwest Airlines", score: 91, isUser: false },
    { name: "Tesla", score: 91, isUser: false },
    { name: "Walmart", score: 90, isUser: false },
    { name: "Disney", score: 89, isUser: false },
    { name: "Coursera", score: 89, isUser: false },
    { name: "Cargill", score: 88, isUser: false },
    { name: "FedEx", score: 88, isUser: false },
    { name: "Microsoft", score: 88, isUser: false },
  ].filter((company, index, self) => 
    // Remove duplicates and the user's company (we'll add it back)
    index === self.findIndex(c => c.name === company.name)
  )
  
  return allCompanies.sort((a, b) => b.score - a.score)
}

// Workshop Mode Types
type WorkshopAnswers = {
  purpose: string
  audience: string
  impact: string
  uniqueValue: string
  timeframe: string
  actionVerb: string
}

// Workshop Mode Configuration
const workshopQuestions = [
  {
    title: "What is your core purpose?",
    subtitle: "The fundamental reason your organization exists",
    question: "What problem do you solve or what value do you create?",
    placeholder: "e.g., We help small businesses automate repetitive tasks...",
    field: "purpose" as keyof WorkshopAnswers,
    examples: [
      "Transform how people communicate",
      "Make sustainable energy accessible",
      "Empower students through personalized learning"
    ]
  },
  {
    title: "Who do you serve?",
    subtitle: "Your primary audience or beneficiaries",
    question: "Who are the main people or groups that benefit from what you do?",
    placeholder: "e.g., small business owners, students, healthcare professionals...",
    field: "audience" as keyof WorkshopAnswers,
    examples: [
      "Small business owners worldwide",
      "Students in underserved communities", 
      "Healthcare professionals and patients"
    ]
  },
  {
    title: "What impact do you create?",
    subtitle: "The positive change you bring to the world",
    question: "What does success look like? How is the world better because of you?",
    placeholder: "e.g., save time, improve health outcomes, reduce environmental impact...",
    field: "impact" as keyof WorkshopAnswers,
    examples: [
      "Save 10 hours per week for every user",
      "Improve learning outcomes by 40%",
      "Reduce carbon emissions globally"
    ]
  },
  {
    title: "What makes you unique?",
    subtitle: "Your differentiating factor or approach",
    question: "What do you do differently from others in your space?",
    placeholder: "e.g., AI-powered, community-driven, scientifically-backed...",
    field: "uniqueValue" as keyof WorkshopAnswers,
    examples: [
      "Through AI-powered automation",
      "Using peer-to-peer learning networks",
      "With evidence-based methodologies"
    ]
  },
  {
    title: "What's your scope?",
    subtitle: "The scale and timeframe of your ambition",
    question: "Are you focused locally, globally, or somewhere in between?",
    placeholder: "e.g., globally, in developing markets, for the next generation...",
    field: "timeframe" as keyof WorkshopAnswers,
    examples: [
      "Around the world",
      "For future generations",
      "In emerging markets"
    ]
  },
  {
    title: "Choose your action verb",
    subtitle: "The primary action that drives your mission",
    question: "What verb best describes what you do?",
    placeholder: "Select or type your own...",
    field: "actionVerb" as keyof WorkshopAnswers,
    examples: [
      "Transform", "Empower", "Accelerate", "Connect", "Enable", 
      "Revolutionize", "Democratize", "Unlock", "Inspire", "Build"
    ]
  }
]

// Generate mission statement from workshop answers
function generateMissionFromWorkshop(answers: WorkshopAnswers, industry: string): string {
  const { purpose, audience, impact, uniqueValue, timeframe, actionVerb } = answers
  
  if (!purpose || !audience || !actionVerb) return ""
  
  // Template variations based on industry
  const templates = [
    `To ${actionVerb.toLowerCase()} ${audience} by ${purpose}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? `, ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`,
    `${actionVerb} ${audience} through ${purpose}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? ` to ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`,
    `To ${purpose} for ${audience}${uniqueValue ? ` ${uniqueValue}` : ""}${impact ? `, enabling ${impact}` : ""}${timeframe ? ` ${timeframe}` : ""}.`
  ]
  
  // Choose template based on industry preferences
  const template = industry === "nonprofit" ? templates[0] : 
                  industry === "technology" ? templates[1] : 
                  templates[0]
  
  return template.replace(/\s+/g, ' ').trim()
}

// A/B Testing Helper Functions
function calculateAllScores(text: string, industry: string) {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
  
  return {
    clarity: calculateClarity(text, wordCount),
    specificity: calculateSpecificity(text),
    impact: calculateImpact(text),
    authenticity: calculateAuthenticity(text, wordCount),
    memorability: calculateMemorability(text, wordCount),
    overall: Math.round((
      calculateClarity(text, wordCount) +
      calculateSpecificity(text) +
      calculateImpact(text) +
      calculateAuthenticity(text, wordCount) +
      calculateMemorability(text, wordCount)
    ) / 5)
  }
}

function compareVersions(versions: any[]) {
  const validVersions = versions.filter(v => v.text.trim() && v.scores)
  if (validVersions.length < 2) return null
  
  const metrics = ['clarity', 'specificity', 'impact', 'authenticity', 'memorability', 'overall']
  const comparison: any = {
    winner: null,
    winnerScore: 0,
    metricWinners: {},
    insights: []
  }
  
  // Find overall winner
  let highestScore = 0
  validVersions.forEach(version => {
    if (version.scores.overall > highestScore) {
      highestScore = version.scores.overall
      comparison.winner = version.id
      comparison.winnerScore = version.scores.overall
    }
  })
  
  // Find metric winners
  metrics.forEach(metric => {
    let highestMetricScore = 0
    let metricWinner = null
    
    validVersions.forEach(version => {
      if (version.scores[metric] > highestMetricScore) {
        highestMetricScore = version.scores[metric]
        metricWinner = version.id
      }
    })
    
    comparison.metricWinners[metric] = {
      winner: metricWinner,
      score: highestMetricScore
    }
  })
  
  // Generate insights
  const winner = validVersions.find(v => v.id === comparison.winner)
  const loser = validVersions.find(v => v.id !== comparison.winner)
  
  if (winner && loser) {
    const scoreDiff = winner.scores.overall - loser.scores.overall
    const winnerText = winner.text
    const loserText = loser.text
    
    comparison.insights.push({
      type: 'overall',
      message: `Version ${winner.id} wins by ${scoreDiff} points (${winner.scores.overall} vs ${loser.scores.overall})`
    })
    
    if (winner.scores.clarity > loser.scores.clarity + 5) {
      comparison.insights.push({
        type: 'clarity',
        message: `Version ${winner.id} is clearer and more concise`
      })
    }
    
    if (winner.scores.authenticity > loser.scores.authenticity + 5) {
      comparison.insights.push({
        type: 'authenticity',
        message: `Version ${winner.id} avoids corporate buzzwords better`
      })
    }
    
    if (winnerText.length < loserText.length && winner.scores.memorability > loser.scores.memorability) {
      comparison.insights.push({
        type: 'memorability',
        message: `Version ${winner.id} is more memorable due to its conciseness`
      })
    }
  }
  
  return comparison
}


function calculateClarity(text: string, wordCount: number): number {
  let score = 83
  if (wordCount >= 8 && wordCount <= 20) score = 88
  else if (wordCount >= 21 && wordCount <= 30) score = 88
  else if (wordCount > 30) score = 82 - (wordCount - 30) * 1.2
  else if (wordCount < 8) score = 65 - (8 - wordCount) * 3

  const buzzwords = ["world-class", "leading", "solutions", "synergy", "innovative", "excellence"]
  const foundBuzz = buzzwords.filter((word) => text.toLowerCase().includes(word)).length
  score -= foundBuzz * 6

  return Math.max(25, Math.min(100, Math.round(score)))
}

function calculateSpecificity(text: string): number {
  let score = 45
  const strongActions = ["accelerate", "organize", "empower", "unlock", "transform"]
  const foundStrong = strongActions.filter((verb) => text.toLowerCase().includes(verb)).length
  score += foundStrong * 25

  if (text.toLowerCase().includes("energy")) score += 13
  if (text.toLowerCase().includes("information")) score += 15
  if (text.toLowerCase().includes("planet")) score += 20

  return Math.max(15, Math.min(100, Math.round(score)))
}

function calculateImpact(text: string): number {
  let score = 35
  const globalWords = ["world", "planet", "every person", "every organization", "humanity"]
  const foundGlobal = globalWords.filter((word) => text.toLowerCase().includes(word)).length
  score += foundGlobal * 22

  const transformWords = ["transition", "accelerate", "empower", "organize", "unlock"]
  const foundTransform = transformWords.filter((word) => text.toLowerCase().includes(word)).length
  score += foundTransform * 13

  if (text.toLowerCase().includes("sustainable") || text.toLowerCase().includes("planet")) score += 23
  if (text.toLowerCase().includes("accessible") || text.toLowerCase().includes("universally")) score += 20
  if (text.toLowerCase().includes("information")) score += 15

  // Google-specific bonus
  if (text.toLowerCase().includes("organize") && text.toLowerCase().includes("information")) score += 5

  return Math.max(20, Math.min(100, Math.round(score)))
}

function calculateAuthenticity(text: string, wordCount: number): number {
  let score = 75
  const corporateSpeak = ["stakeholders", "leverage", "optimize", "maximize", "strategically"]
  const foundCorp = corporateSpeak.filter((word) => text.toLowerCase().includes(word)).length
  score -= foundCorp * 15

  if (wordCount < 15 && !text.includes("innovative") && !text.includes("solutions")) score += 2
  if (
    text.toLowerCase().includes("save") ||
    text.toLowerCase().includes("transition") ||
    text.toLowerCase().includes("empower") ||
    text.toLowerCase().includes("organize")
  )
    score += 8

  return Math.max(30, Math.min(100, Math.round(score)))
}

function calculateMemorability(text: string, wordCount: number): number {
  let score = 70
  if (wordCount >= 6 && wordCount <= 12) score = 93
  else if (wordCount >= 13 && wordCount <= 20) score = 90
  else if (wordCount >= 21 && wordCount <= 30) score = 82
  else if (wordCount > 30) score = 75 - (wordCount - 30) * 2

  if (text.startsWith("To ") || text.includes("We're in business to")) score += 5

  const ideas = text.split(/,|—|;/).length
  if (ideas === 1) score += 8

  return Math.max(35, Math.min(100, Math.round(score)))
}

function getRecommendations(analysis: any, clarityScore: number, specificityScore: number, wordCount: number) {
  const recommendations = []

  if (analysis.length.status === "poor") {
    recommendations.push({
      category: "Length",
      issue: "Too short",
      suggestion: "Expand your mission to 8-20 words for optimal clarity and impact.",
    })
  } else if (analysis.length.status === "warning") {
    recommendations.push({
      category: "Length",
      issue: "Too long",
      suggestion: "Condense your mission to under 35 words for better memorability.",
    })
  }

  if (analysis.actionVerb.status === "poor") {
    recommendations.push({
      category: "Action Verb",
      issue: "Missing strong action verb",
      suggestion: "Add a powerful verb like 'accelerate', 'empower', 'transform', or 'unlock'.",
    })
  }

  if (analysis.impact.status === "warning") {
    recommendations.push({
      category: "Impact",
      issue: "Unclear impact scope",
      suggestion: "Specify who you serve: 'world', 'people', 'customers', or 'society'.",
    })
  }

  if (analysis.buzzwords.status === "warning") {
    recommendations.push({
      category: "Buzzwords",
      issue: "Contains overused terms",
      suggestion: "Replace buzzwords with specific, concrete language about what you do.",
    })
  }

  if (specificityScore < 70) {
    recommendations.push({
      category: "Specificity",
      issue: "Too generic",
      suggestion: "Be more specific about your unique value proposition and target market.",
    })
  }

  return recommendations
}

function analyzeMissionStatement(text: string, wordCount: number) {
  const lowerText = text.toLowerCase()

  // Length Analysis
  let lengthStatus: "good" | "warning" | "poor" = "good"
  let lengthText = "Good (8-35 words)"
  if (wordCount < 8) {
    lengthStatus = "poor"
    lengthText = "Too Short"
  } else if (wordCount > 35) {
    lengthStatus = "warning"
    lengthText = "Too Long"
  }

  // Action Verb Analysis
  const actionVerbs = ["accelerate", "empower", "organize", "transform", "unlock", "inspire", "connect"]
  const hasActionVerb = actionVerbs.some((verb) => lowerText.includes(verb))

  // Impact Analysis
  const impactWords = ["world", "people", "planet", "customers", "society", "lives"]
  const hasImpact = impactWords.some((word) => lowerText.includes(word))

  // Buzzwords Analysis
  const buzzwords = ["solutions", "synergy", "innovative", "excellence"]
  const hasBuzzwords = buzzwords.some((word) => lowerText.includes(word))

  return {
    length: { status: lengthStatus, text: lengthText },
    actionVerb: { status: hasActionVerb ? "good" : "poor", text: hasActionVerb ? "Found" : "Missing" },
    impact: { status: hasImpact ? "good" : "warning", text: hasImpact ? "Clear" : "Unclear" },
    buzzwords: { status: hasBuzzwords ? "warning" : "good", text: hasBuzzwords ? "Avoid Buzz" : "Clear" },
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case "good":
      return "border-green-500"
    case "warning":
      return "border-yellow-500"
    case "poor":
      return "border-red-500"
    default:
      return "border-gray-500"
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "good":
      return "text-green-500"
    case "warning":
      return "text-yellow-500"
    case "poor":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

function generateAlternativeRewrites(originalMission: string, overallScore: number) {
  // This would typically use AI to generate alternatives, but for demo purposes we'll use templates
  const companyName = "your company"

  return {
    actionFocused: `To transform industries through innovative solutions that empower businesses and communities worldwide.`,
    problemSolution: `We solve complex challenges by delivering cutting-edge technology that creates lasting value for our customers and society.`,
    visionDriven: `Building a future where technology enhances human potential and creates sustainable prosperity for all.`,
  }
}

function getNextSteps(score: number) {
  if (score >= 85) {
    return {
      title: "Excellence Achieved - Optimize & Scale",
      steps: [
        "🎉 Celebrate your exceptional mission statement",
        "🧪 A/B test variations with stakeholders and customers",
        "📅 Schedule quarterly reviews to ensure continued relevance",
        "📢 Integrate into all brand communications and materials",
      ],
    }
  } else if (score >= 70) {
    return {
      title: "Strong Foundation - Refine & Perfect",
      steps: [
        "🔧 Focus on improving your lowest-scoring metrics",
        "👥 Conduct stakeholder workshops for feedback and alignment",
        "✏️ Test alternative phrasings for key concepts",
        "📊 Measure employee and customer resonance",
      ],
    }
  } else {
    return {
      title: "Rebuild Required - Start Fresh",
      steps: [
        "📝 Complete mission statement rewrite using best practices",
        "🏗️ Establish clear foundation: purpose, values, and impact",
        "🤝 Engage leadership team in collaborative development",
        "📚 Consider professional brand strategy consultation",
      ],
    }
  }
}

export default function MissionStatementAnalyzer() {
  const [missionText, setMissionText] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("technology")
  const [showLiveAnalysis, setShowLiveAnalysis] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showCompleteReport, setShowCompleteReport] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [animatedScores, setAnimatedScores] = useState({
    overall: 0,
    clarity: 0,
    specificity: 0,
    impact: 0,
    authenticity: 0,
    memorability: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailForm, setEmailForm] = useState({
    email: "",
    firstName: "",
    company: "",
  })
  const [emailError, setEmailError] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  // Workshop Mode State
  const [showWorkshopMode, setShowWorkshopMode] = useState(false)
  const [workshopStep, setWorkshopStep] = useState(0)
  const [workshopAnswers, setWorkshopAnswers] = useState({
    purpose: "",
    audience: "",
    impact: "",
    uniqueValue: "",
    timeframe: "",
    actionVerb: "",
  })
  
  // A/B Testing State
  const [showABTesting, setShowABTesting] = useState(false)
  const [abVersions, setAbVersions] = useState<Array<{
    id: string;
    text: string;
    scores: {
      clarity: number;
      specificity: number;
      impact: number;
      authenticity: number;
      memorability: number;
      overall: number;
    } | null;
    aiAnalysis: any;
  }>>([
    { id: 'A', text: '', scores: null, aiAnalysis: null },
    { id: 'B', text: '', scores: null, aiAnalysis: null },
  ])
  const [abTestingResults, setAbTestingResults] = useState<any>(null)
  
  // Advanced Analytics State
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)
  
  // Export & Integration State
  const [showExportIntegration, setShowExportIntegration] = useState(false)

  const characterCount = missionText.length
  const wordCount = useMemo(() => {
    return missionText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }, [missionText])

  const liveAnalysis = useMemo(() => {
    if (!showLiveAnalysis) return null
    return analyzeMissionStatement(missionText, wordCount)
  }, [missionText, wordCount, showLiveAnalysis])

  const clarityScore = useMemo(() => {
    if (aiAnalysis?.scores?.clarity !== undefined) {
      return aiAnalysis.scores.clarity
    }
    return calculateClarity(missionText, wordCount)
  }, [missionText, wordCount, aiAnalysis])

  const specificityScore = useMemo(() => {
    if (aiAnalysis?.scores?.specificity !== undefined) {
      return aiAnalysis.scores.specificity
    }
    return calculateSpecificity(missionText)
  }, [missionText, aiAnalysis])

  const impactScore = useMemo(() => {
    if (aiAnalysis?.scores?.impact !== undefined) {
      return aiAnalysis.scores.impact
    }
    return calculateImpact(missionText)
  }, [missionText, aiAnalysis])

  const authenticityScore = useMemo(() => {
    if (aiAnalysis?.scores?.authenticity !== undefined) {
      return aiAnalysis.scores.authenticity
    }
    return calculateAuthenticity(missionText, wordCount)
  }, [missionText, wordCount, aiAnalysis])

  const memorabilityScore = useMemo(() => {
    if (aiAnalysis?.scores?.memorability !== undefined) {
      return aiAnalysis.scores.memorability
    }
    return calculateMemorability(missionText, wordCount)
  }, [missionText, wordCount, aiAnalysis])

  const overallScore = useMemo(() => {
    if (aiAnalysis?.scores?.overall !== undefined) {
      return aiAnalysis.scores.overall
    }
    return Math.round(
      clarityScore * 0.25 +
        specificityScore * 0.25 +
        impactScore * 0.25 +
        authenticityScore * 0.15 +
        memorabilityScore * 0.1,
    )
  }, [clarityScore, specificityScore, impactScore, authenticityScore, memorabilityScore, aiAnalysis])

  useEffect(() => {
    if (showResults) {
      const animateScores = () => {
        const duration = 2000
        const steps = 60
        const stepDuration = duration / steps

        let currentStep = 0
        const interval = setInterval(() => {
          currentStep++
          const progress = currentStep / steps
          const easeOut = 1 - Math.pow(1 - progress, 3)

          setAnimatedScores({
            overall: Math.round(overallScore * easeOut),
            clarity: Math.round(clarityScore * easeOut),
            specificity: Math.round(specificityScore * easeOut),
            impact: Math.round(impactScore * easeOut),
            authenticity: Math.round(authenticityScore * easeOut),
            memorability: Math.round(memorabilityScore * easeOut),
          })

          if (currentStep >= steps) {
            clearInterval(interval)
          }
        }, stepDuration)

        return () => clearInterval(interval)
      }

      const cleanup = animateScores()
      return cleanup
    }
  }, [showResults, overallScore, clarityScore, specificityScore, impactScore, authenticityScore, memorabilityScore])

  const isAnalyzeEnabled = wordCount >= 8
  const maxCharacters = 500

  const handleExampleClick = useCallback(
    (mission: string) => {
      if (mission.length <= maxCharacters) {
        setMissionText(mission)
      }
    },
    [maxCharacters],
  )

  const handleClear = useCallback(() => {
    setMissionText("")
    setShowLiveAnalysis(false)
    setShowResults(false)
    setShowEmailCapture(false)
    setShowCompleteReport(false)
    setAnimatedScores({ overall: 0, clarity: 0, specificity: 0, impact: 0, authenticity: 0, memorability: 0 })
    setEmailForm({ email: "", firstName: "", company: "" })
    setEmailError("")
    setAiAnalysis(null)
  }, [])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      if (text.length <= maxCharacters) {
        setMissionText(text)
        setShowLiveAnalysis(text.length >= 20)
      }
    },
    [maxCharacters],
  )

  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 60) return "text-orange-400"
    return "text-red-400"
  }, [])

  const getScoreCategory = useCallback((score: number) => {
    if (score >= 90) return "Exceptional"
    if (score >= 80) return "Strong"
    if (score >= 70) return "Good"
    if (score >= 60) return "Needs Work"
    return "Poor"
  }, [])

  const getProgressColor = useCallback((score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-green-400 to-green-500"
    if (score >= 80) return "bg-gradient-to-r from-blue-400 to-blue-500"
    if (score >= 70) return "bg-gradient-to-r from-yellow-400 to-yellow-500"
    if (score >= 60) return "bg-gradient-to-r from-orange-400 to-orange-500"
    return "bg-gradient-to-r from-red-400 to-red-500"
  }, [])

  const getScoreIndicator = useCallback((score: number) => {
    if (score >= 80) return "🟢"
    if (score >= 70) return "🟡"
    return "🔴"
  }, [])

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true)
    setShowResults(false)
    setAnimatedScores({ overall: 0, clarity: 0, specificity: 0, impact: 0, authenticity: 0, memorability: 0 })

    try {
      // Call AI analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mission: missionText, industry: selectedIndustry }),
      })

      const data = await response.json()

      if (data.fallback) {
        // Use original analysis if AI is not available
        console.log('Using fallback analysis')
      } else if (data.error) {
        console.error('Analysis error:', data.error)
      } else {
        // Store AI analysis results
        setAiAnalysis(data)
      }
    } catch (error) {
      console.error('Failed to analyze:', error)
      // Continue with original analysis as fallback
    }

    setIsLoading(false)
    setShowResults(true)

    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("results-section")
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [missionText])

  const handleGetCompleteReport = useCallback(() => {
    setShowEmailCapture(true)
    setTimeout(() => {
      const emailElement = document.getElementById("email-capture-section")
      if (emailElement) {
        emailElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [])

  // Workshop Mode Handlers
  const handleStartWorkshop = useCallback(() => {
    setShowWorkshopMode(true)
    setWorkshopStep(0)
    setWorkshopAnswers({
      purpose: "",
      audience: "",
      impact: "",
      uniqueValue: "",
      timeframe: "",
      actionVerb: "",
    })
    setTimeout(() => {
      const workshopElement = document.getElementById("workshop-section")
      if (workshopElement) {
        workshopElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [])

  const handleWorkshopNext = useCallback(() => {
    if (workshopStep < workshopQuestions.length - 1) {
      setWorkshopStep(prev => prev + 1)
    } else {
      // Generate final mission statement
      const generatedMission = generateMissionFromWorkshop(workshopAnswers, selectedIndustry)
      setMissionText(generatedMission)
      setShowWorkshopMode(false)
      // Trigger analysis after a short delay to allow the text to update
      setTimeout(() => {
        handleAnalyze()
      }, 500)
    }
  }, [workshopStep, workshopAnswers, selectedIndustry, handleAnalyze])

  const handleWorkshopPrevious = useCallback(() => {
    if (workshopStep > 0) {
      setWorkshopStep(prev => prev - 1)
    }
  }, [workshopStep])

  const handleWorkshopAnswerChange = useCallback((field: keyof typeof workshopAnswers, value: string) => {
    setWorkshopAnswers(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleWorkshopExampleClick = useCallback((example: string) => {
    const currentField = workshopQuestions[workshopStep].field
    setWorkshopAnswers(prev => ({
      ...prev,
      [currentField]: example
    }))
  }, [workshopStep])

  // A/B Testing Handlers
  const handleStartABTesting = useCallback(() => {
    const versionA = missionText.trim() || "Enter your first mission statement version..."
    const alternatives = aiAnalysis?.alternativeRewrites || generateAlternativeRewrites(missionText, overallScore)
    const versionB = (typeof alternatives.actionFocused === 'string' 
      ? alternatives.actionFocused 
      : alternatives.actionFocused?.text) || "Enter your second mission statement version..."
    
    setAbVersions([
      { id: 'A', text: versionA, scores: null, aiAnalysis: null },
      { id: 'B', text: versionB, scores: null, aiAnalysis: null },
    ])
    setShowABTesting(true)
    setAbTestingResults(null)
    
    setTimeout(() => {
      const abTestingElement = document.getElementById("ab-testing-section")
      if (abTestingElement) {
        abTestingElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [missionText, aiAnalysis, overallScore])

  const handleABVersionChange = useCallback((versionId: string, text: string) => {
    setAbVersions(prev => prev.map(version => 
      version.id === versionId ? { ...version, text } : version
    ))
  }, [])

  const handleRunABTest = useCallback(async () => {
    setIsLoading(true)
    
    // Calculate scores for each version
    const updatedVersions = abVersions.map(version => ({
      ...version,
      scores: calculateAllScores(version.text, selectedIndustry)
    }))
    
    setAbVersions(updatedVersions)
    
    // Generate comparison results
    const results = compareVersions(updatedVersions)
    setAbTestingResults(results)
    
    setIsLoading(false)
  }, [abVersions, selectedIndustry])

  const handleSelectWinner = useCallback((versionId: string) => {
    const winningVersion = abVersions.find(v => v.id === versionId)
    if (winningVersion) {
      setMissionText(winningVersion.text)
      setShowABTesting(false)
      // Trigger full analysis of the selected version
      setTimeout(() => {
        handleAnalyze()
      }, 500)
    }
  }, [abVersions, handleAnalyze])

  const handleAddABVersion = useCallback(() => {
    if (abVersions.length < 3) {
      setAbVersions(prev => [...prev, { 
        id: String.fromCharCode(65 + prev.length), // C, D, etc.
        text: '', 
        scores: null, 
        aiAnalysis: null 
      }])
    }
  }, [abVersions.length])

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [])

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!emailForm.email) {
        setEmailError("Email is required")
        return
      }

      if (!validateEmail(emailForm.email)) {
        setEmailError("Please enter a valid email address")
        return
      }

      setEmailError("")
      setIsGeneratingReport(true)

      // 2 second loading state
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsGeneratingReport(false)
      setShowEmailCapture(false)
      setShowCompleteReport(true)

      // Smooth scroll to complete report
      setTimeout(() => {
        const reportElement = document.getElementById("complete-report-section")
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    },
    [emailForm.email, validateEmail],
  )

  const handleEmailChange = useCallback(
    (field: string, value: string) => {
      setEmailForm((prev) => ({ ...prev, [field]: value }))
      if (emailError) setEmailError("")
    },
    [emailError],
  )

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#f8fafc] scroll-smooth">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0e1a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-lg shadow-lg">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight tracking-tight">
                Mission Statement Success Calculator
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1 leading-relaxed">
                Get a professional assessment using Fortune 500 standards
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Main Analysis Card */}
        <Card className="bg-[#111827] border-gray-700 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8 text-[#f8fafc] leading-tight">
              Enter Your Mission Statement
            </h2>

            <div className="space-y-6">
              {/* Industry Selection */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-[#f8fafc] font-semibold text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Select Your Industry
                </Label>
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger 
                    id="industry"
                    className="bg-[#0a0e1a] border-gray-600 text-[#f8fafc] focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-2 text-base sm:text-lg"
                  >
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111827] border-gray-600">
                    {industries.map((industry) => (
                      <SelectItem
                        key={industry.value}
                        value={industry.value}
                        className="text-[#f8fafc] focus:bg-[#1f2937] focus:text-[#f8fafc]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{industry.icon}</span>
                          {industry.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400 mt-1">
                  Industry context helps provide more relevant analysis and benchmarks
                </p>
              </div>

              <div className="relative">
                <Textarea
                  value={missionText}
                  onChange={handleTextChange}
                  placeholder="Type or paste your company's mission statement here..."
                  className="min-h-[120px] sm:min-h-[140px] bg-[#0a0e1a] border-gray-600 text-[#f8fafc] placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-2 resize-none text-base sm:text-lg leading-relaxed transition-all duration-200 rounded-lg shadow-inner"
                  aria-label="Mission statement input"
                  aria-describedby="character-count"
                />
                <div
                  id="character-count"
                  className="absolute bottom-3 right-3 text-sm text-gray-400 bg-[#111827] px-2 py-1 rounded-md shadow-sm"
                >
                  <span className={characterCount > maxCharacters * 0.9 ? "text-orange-400" : ""}>
                    {characterCount}
                  </span>
                  <span className="text-gray-500">/{maxCharacters}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  disabled={!isAnalyzeEnabled}
                  onClick={handleAnalyze}
                  className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white font-semibold px-4 py-3 sm:py-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] min-h-[44px] text-sm sm:text-base lg:text-lg rounded-lg col-span-full sm:col-span-2 lg:col-span-3 whitespace-normal text-center"
                  aria-label="Analyze mission statement"
                >
                  Analyze My Mission Statement
                </Button>
                {isLoading && (
                  <div className="flex items-center justify-center py-8 col-span-full" role="status" aria-live="polite">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
                    <span className="ml-3 text-gray-400 text-base">Analyzing your mission statement...</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 bg-transparent hover:scale-[1.02] min-h-[44px] text-base sm:text-lg px-6 py-3 sm:py-4 rounded-lg"
                  aria-label="Clear and start over"
                >
                  Clear & Start Over
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartWorkshop}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-200 bg-transparent hover:scale-[1.02] min-h-[44px] text-base sm:text-lg px-6 py-3 sm:py-4 rounded-lg"
                  aria-label="Start guided workshop mode"
                >
                  🛠️ Workshop Mode
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartABTesting}
                  className="border-gray-500 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 transition-all duration-200 bg-transparent hover:scale-[1.02] min-h-[44px] text-base sm:text-lg px-6 py-3 sm:py-4 rounded-lg"
                  aria-label="Start A/B testing mode"
                >
                  📊 A/B Test
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                  disabled={!missionText.trim()}
                  className="border-gray-500 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 transition-all duration-200 bg-transparent hover:scale-[1.02] min-h-[44px] text-base sm:text-lg px-6 py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Show advanced analytics"
                >
                  🔬 Advanced Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExportIntegration(!showExportIntegration)}
                  disabled={!missionText.trim() || !showResults}
                  className="border-gray-500 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 transition-all duration-200 bg-transparent hover:scale-[1.02] min-h-[44px] text-base sm:text-lg px-6 py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Export and share analysis"
                >
                  📤 Export & Share
                </Button>
              </div>

              {showLiveAnalysis && liveAnalysis && (
                <Card className="bg-[#0a0e1a] border-gray-600 mt-8 shadow-lg animate-in slide-in-from-bottom duration-500">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-[#f8fafc] mb-4 sm:mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse"></div>
                      Live Quality Check
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusBg(liveAnalysis.length.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-300 font-medium">Length</span>
                          <span
                            className={`text-sm sm:text-base font-semibold ${getStatusColor(liveAnalysis.length.status)}`}
                          >
                            {liveAnalysis.length.text}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusBg(liveAnalysis.actionVerb.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-300 font-medium">Action Verb</span>
                          <span
                            className={`text-sm sm:text-base font-semibold ${getStatusColor(liveAnalysis.actionVerb.status)}`}
                          >
                            {liveAnalysis.actionVerb.text}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusBg(liveAnalysis.impact.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-300 font-medium">Impact</span>
                          <span
                            className={`text-sm sm:text-base font-semibold ${getStatusColor(liveAnalysis.impact.status)}`}
                          >
                            {liveAnalysis.impact.text}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusBg(liveAnalysis.buzzwords.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-300 font-medium">Buzzwords</span>
                          <span
                            className={`text-sm sm:text-base font-semibold ${getStatusColor(liveAnalysis.buzzwords.status)}`}
                          >
                            {liveAnalysis.buzzwords.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {missionText.length >= 20 && (
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-gray-300 font-medium">Current Score</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xl sm:text-2xl font-bold ${getScoreColor(overallScore)}`}
                              aria-live="polite"
                            >
                              {overallScore}
                            </span>
                            <span className="text-gray-400 text-base">/100</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs sm:text-sm text-gray-500 font-mono">
                          C:{calculateClarity(missionText, wordCount)} • S:{calculateSpecificity(missionText)} • I:
                          {calculateImpact(missionText)} • A:{calculateAuthenticity(missionText, wordCount)} • M:
                          {calculateMemorability(missionText, wordCount)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Workshop Mode Section */}
              {showWorkshopMode && (
                <Suspense fallback={
                  <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 mt-8 shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white">Loading Workshop Mode...</p>
                    </CardContent>
                  </Card>
                }>
                  <WorkshopMode
                    selectedIndustry={selectedIndustry}
                    onComplete={(mission) => {
                      setMissionText(mission)
                      setShowWorkshopMode(false)
                      setTimeout(() => {
                        handleAnalyze()
                      }, 500)
                    }}
                    onClose={() => setShowWorkshopMode(false)}
                  />
                </Suspense>
              )}

              {/* A/B Testing Section */}
              {showABTesting && (
                <Card 
                  id="ab-testing-section"
                  className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mt-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
                >
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                        📊 A/B Testing Lab
                      </h2>
                      <p className="text-gray-200 text-base sm:text-lg">
                        Compare multiple versions side-by-side to find your strongest mission statement
                      </p>
                    </div>

                    {/* Version Input Section */}
                    <div className="space-y-6 mb-8">
                      {abVersions.map((version, index) => (
                        <Card key={version.id} className="bg-[#0a0e1a] border-gray-600">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                  {version.id}
                                </span>
                                Version {version.id}
                              </h3>
                              {version.scores && (
                                <div className="flex items-center gap-2">
                                  <span className={`text-xl font-bold ${getScoreColor(version.scores.overall)}`}>
                                    {version.scores.overall}
                                  </span>
                                  <span className="text-gray-400">/100</span>
                                  {abTestingResults?.winner === version.id && (
                                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                      🏆 WINNER
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <Textarea
                              value={version.text}
                              onChange={(e) => handleABVersionChange(version.id, e.target.value)}
                              placeholder={`Enter mission statement version ${version.id}...`}
                              className="bg-[#111827] border-gray-600 text-[#f8fafc] placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500 focus:ring-2 min-h-[100px] text-base rounded-lg resize-none mb-4"
                              rows={3}
                            />
                            
                            {version.scores && (
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {[
                                  { name: "Clarity", score: version.scores.clarity },
                                  { name: "Specificity", score: version.scores.specificity },
                                  { name: "Impact", score: version.scores.impact },
                                  { name: "Authenticity", score: version.scores.authenticity },
                                  { name: "Memorability", score: version.scores.memorability },
                                ].map((metric) => (
                                  <div key={metric.name} className="text-center">
                                    <div className="text-sm text-gray-400 mb-1">{metric.name}</div>
                                    <div className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                                      {metric.score}
                                    </div>
                                    {abTestingResults?.metricWinners[metric.name.toLowerCase()]?.winner === version.id && (
                                      <div className="text-xs text-yellow-400">🏆</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                      <Button
                        onClick={handleRunABTest}
                        disabled={isLoading || abVersions.some(v => !v.text.trim())}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white font-semibold px-8 py-3 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Running Test...
                          </div>
                        ) : (
                          "🧪 Run A/B Test"
                        )}
                      </Button>
                      
                      {abVersions.length < 3 && (
                        <Button
                          variant="outline"
                          onClick={handleAddABVersion}
                          className="border-gray-500 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300"
                        >
                          ➕ Add Version
                        </Button>
                      )}
                    </div>

                    {/* Results Section */}
                    {abTestingResults && (
                      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#f8fafc] mb-6 flex items-center gap-2">
                            🏆 Test Results
                          </h3>
                          
                          {/* Winner Announcement */}
                          <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-yellow-400 mb-2">
                              Version {abTestingResults.winner} Wins!
                            </div>
                            <div className="text-lg text-gray-300">
                              Score: {abTestingResults.winnerScore}/100
                            </div>
                          </div>

                          {/* Insights */}
                          <div className="space-y-3 mb-6">
                            {abTestingResults.insights.map((insight: any, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-[#0a0e1a] rounded-lg">
                                <span className="text-yellow-400">💡</span>
                                <span className="text-gray-300 text-sm">{insight.message}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap justify-center gap-4">
                            <Button
                              onClick={() => handleSelectWinner(abTestingResults.winner)}
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2"
                            >
                              🎯 Use Version {abTestingResults.winner}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowABTesting(false)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              Close A/B Test
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Advanced Analytics Section */}
              {showAdvancedAnalytics && missionText.trim() && (
                <Suspense fallback={
                  <Card className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mt-8 shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading Advanced Analytics...</p>
                    </CardContent>
                  </Card>
                }>
                  <AdvancedAnalytics missionText={missionText} />
                </Suspense>
              )}

              {/* Export & Integration Section */}
              {showExportIntegration && missionText.trim() && showResults && (
                <Suspense fallback={
                  <Card className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mt-8 shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading Export Options...</p>
                    </CardContent>
                  </Card>
                }>
                  <ExportIntegrationSimple 
                    missionText={missionText}
                    scores={{
                      clarity: clarityScore,
                      specificity: specificityScore,
                      impact: impactScore,
                      authenticity: authenticityScore,
                      memorability: memorabilityScore,
                      overall: overallScore,
                    }}
                    selectedIndustry={selectedIndustry}
                    onClose={() => setShowExportIntegration(false)}
                  />
                </Suspense>
              )}

              {showResults && (
                <Card
                  id="results-section"
                  className="bg-[#111827] border-gray-600 mt-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
                >
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-8 flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                      Analysis Complete
                      {aiAnalysis && !aiAnalysis.fallback && (
                        <span className="ml-auto text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-medium">
                          AI Enhanced
                        </span>
                      )}
                    </h3>

                    {/* Enhanced Score Display */}
                    <div className="text-center mb-10">
                      <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#374151" strokeWidth="8" fill="none" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(animatedScores.overall / 100) * 251.2} 251.2`}
                            strokeLinecap="round"
                            className="transition-all duration-2000 ease-out drop-shadow-lg"
                            style={{
                              animationDelay: "0ms",
                              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))",
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className={`text-3xl sm:text-4xl font-bold ${getScoreColor(animatedScores.overall)} transition-colors duration-500`}
                            aria-live="polite"
                            aria-label={`Overall score: ${animatedScores.overall} out of 100`}
                          >
                            {animatedScores.overall}
                          </span>
                          <span className="text-sm sm:text-base text-gray-400 mt-1">/100</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className={`text-lg sm:text-xl font-semibold ${getScoreColor(animatedScores.overall)}`}>
                          {getScoreCategory(animatedScores.overall)}
                        </span>
                        <p className="text-sm sm:text-base text-gray-400 mt-2 leading-relaxed">Overall Performance</p>
                      </div>
                    </div>

                    {/* Enhanced Metric Cards with Staggered Animation */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
                      {[
                        { name: "Clarity", score: animatedScores.clarity, delay: "0ms" },
                        { name: "Specificity", score: animatedScores.specificity, delay: "150ms" },
                        { name: "Impact", score: animatedScores.impact, delay: "300ms" },
                        { name: "Authenticity", score: animatedScores.authenticity, delay: "450ms" },
                        { name: "Memorability", score: animatedScores.memorability, delay: "600ms" },
                      ].map((metric) => (
                        <div
                          key={metric.name}
                          className="bg-[#0a0e1a] border border-gray-600 rounded-lg p-3 sm:p-4 animate-in slide-in-from-bottom duration-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
                          style={{ animationDelay: metric.delay }}
                        >
                          <div className="text-center mb-3">
                            <div
                              className={`text-2xl sm:text-3xl font-bold ${getScoreColor(metric.score)}`}
                              aria-live="polite"
                            >
                              {metric.score}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">/100</div>
                          </div>
                          <div className="mb-3">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-1000 ease-out ${getProgressColor(metric.score)}`}
                                style={{
                                  width: `${metric.score}%`,
                                  animationDelay: `${Number.parseInt(metric.delay) + 500}ms`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-[#f8fafc] text-xs sm:text-sm text-center leading-tight px-1">
                            {metric.name}
                          </h4>
                        </div>
                      ))}
                    </div>

                    {/* Performance Tier */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm sm:text-base text-gray-300 font-medium">Performance Tier</span>
                        <span
                          className={`font-semibold text-sm sm:text-base ${
                            animatedScores.overall >= 90
                              ? "text-green-400"
                              : animatedScores.overall >= 80
                                ? "text-yellow-400"
                                : animatedScores.overall >= 70
                                  ? "text-orange-400"
                                  : "text-red-400"
                          }`}
                        >
                          {animatedScores.overall >= 90
                            ? "Fortune 500 Level"
                            : animatedScores.overall >= 80
                              ? "Strong Performance"
                              : animatedScores.overall >= 70
                                ? "Good Foundation"
                                : "Needs Improvement"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                            animatedScores.overall >= 90
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : animatedScores.overall >= 80
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : animatedScores.overall >= 70
                                  ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                  : "bg-gradient-to-r from-red-400 to-red-500"
                          }`}
                          style={{ width: `${animatedScores.overall}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {(() => {
                      const recommendations = aiAnalysis?.recommendations || getRecommendations(
                        liveAnalysis || analyzeMissionStatement(missionText, wordCount),
                        clarityScore,
                        specificityScore,
                        wordCount,
                      )
                      return (
                        recommendations.length > 0 && (
                          <div className="mb-8">
                            <h4 className="font-semibold text-[#f8fafc] mb-6 text-lg sm:text-xl">
                              Recommendations for Improvement
                            </h4>
                            <div className="space-y-4">
                              {recommendations.map((rec: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-[#0a0e1a] border border-gray-600 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-[#3b82f6] rounded-full mt-3 flex-shrink-0 shadow-lg shadow-blue-400/50"></div>
                                    <div>
                                      <h5 className="font-semibold text-[#f8fafc] mb-2 text-base sm:text-lg">
                                        {rec.category}
                                      </h5>
                                      <p className="text-sm sm:text-base text-gray-400 mb-3 leading-relaxed">
                                        {rec.issue}
                                      </p>
                                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                        {rec.suggestion}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    })()}

                    {/* Enhanced Industry Benchmarking */}
                    <div className="mt-8 pt-8 border-t border-gray-700">
                      <h4 className="font-semibold text-[#f8fafc] mb-6 text-lg sm:text-xl flex items-center gap-2">
                        📊 Industry Performance Analysis
                      </h4>
                      
                      {(() => {
                        const benchmark = industryBenchmarks[selectedIndustry as keyof typeof industryBenchmarks] || industryBenchmarks.other
                        const percentile = calculatePercentile(overallScore, selectedIndustry)
                        const performanceBand = getPerformanceBand(overallScore)
                        
                        return (
                          <>
                            {/* Percentile Ranking Card */}
                            <Card className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mb-6">
                              <CardContent className="p-6">
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-[#3b82f6] mb-2">
                                    {Math.round(percentile)}th
                                  </div>
                                  <div className="text-lg font-semibold text-[#f8fafc] mb-2">Percentile Ranking</div>
                                  <div className="text-sm text-gray-300 mb-4">
                                    Your mission statement outperforms {Math.round(percentile)}% of companies in the {industries.find(i => i.value === selectedIndustry)?.label} industry
                                  </div>
                                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                                    performanceBand === "Exceptional" ? "bg-green-500/20 text-green-400" :
                                    performanceBand === "Excellent" ? "bg-blue-500/20 text-blue-400" :
                                    performanceBand === "Good" ? "bg-yellow-500/20 text-yellow-400" :
                                    performanceBand === "Fair" ? "bg-orange-500/20 text-orange-400" :
                                    "bg-red-500/20 text-red-400"
                                  }`}>
                                    {performanceBand} Performance
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            {/* Detailed Benchmarks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                              <div className="p-4 rounded-lg bg-[#0a0e1a] border border-gray-600 hover:shadow-lg transition-all duration-200">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-gray-400 mb-2">{benchmark.average}</div>
                                  <div className="text-xs text-gray-500 font-medium">Industry Average</div>
                                  <div className="text-xs text-gray-600 mt-1">50th percentile</div>
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-[#0a0e1a] border border-gray-600 hover:shadow-lg transition-all duration-200">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-400 mb-2">{benchmark.median}</div>
                                  <div className="text-xs text-gray-500 font-medium">Median Score</div>
                                  <div className="text-xs text-gray-600 mt-1">Middle performer</div>
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-[#0a0e1a] border border-gray-600 hover:shadow-lg transition-all duration-200">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-yellow-400 mb-2">{benchmark.top25}</div>
                                  <div className="text-xs text-gray-500 font-medium">Top 25%</div>
                                  <div className="text-xs text-gray-600 mt-1">Strong performers</div>
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-[#0a0e1a] border border-gray-600 hover:shadow-lg transition-all duration-200">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-400 mb-2">{benchmark.top10}</div>
                                  <div className="text-xs text-gray-500 font-medium">Top 10%</div>
                                  <div className="text-xs text-gray-600 mt-1">Industry leaders</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Performance Insights */}
                            <Card className="bg-[#0a0e1a] border-gray-600">
                              <CardContent className="p-6">
                                <h5 className="font-semibold text-[#f8fafc] mb-4 flex items-center gap-2">
                                  🎯 Performance Insights
                                </h5>
                                <div className="space-y-3 text-sm text-gray-300">
                                  {overallScore >= benchmark.top10 && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-400">✓</span>
                                      <span>Outstanding! Your mission statement ranks among the top 10% in your industry.</span>
                                    </div>
                                  )}
                                  {overallScore >= benchmark.top25 && overallScore < benchmark.top10 && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-400">✓</span>
                                      <span>Excellent work! You're in the top 25% of your industry.</span>
                                    </div>
                                  )}
                                  {overallScore >= benchmark.average && overallScore < benchmark.top25 && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-yellow-400">→</span>
                                      <span>Above average performance. Focus on key improvements to reach top 25%.</span>
                                    </div>
                                  )}
                                  {overallScore < benchmark.average && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-400">!</span>
                                      <span>Below industry average. Consider the AI-generated alternatives to improve your score.</span>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-2">
                                    <span className="text-blue-400">i</span>
                                    <span>
                                      To reach the next performance level, aim for a score of{" "}
                                      {overallScore < benchmark.average ? benchmark.average :
                                       overallScore < benchmark.top25 ? benchmark.top25 :
                                       overallScore < benchmark.top10 ? benchmark.top10 : 95}+
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )
                      })()}
                    </div>

                    {/* Expanded Competitive Benchmarking Section */}
                    <div className="mt-12 pt-8 border-t border-gray-700">
                      <h4 className="font-semibold text-[#f8fafc] mb-8 flex items-center gap-3 text-lg sm:text-xl">
                        🏆 Competitive Ranking
                      </h4>

                      <Card className="bg-[#0a0e1a] border-gray-600 shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                          {(() => {
                            const benchmarkCompanies = getIndustryBenchmarkCompanies(selectedIndustry, animatedScores.overall)
                            const userRank = benchmarkCompanies.findIndex(c => c.isUser) + 1
                            const totalCompanies = benchmarkCompanies.length

                            return (
                              <div>
                                {/* Ranking Summary */}
                                <div className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-gray-700">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-[#3b82f6] mb-2">
                                      #{userRank} of {totalCompanies}
                                    </div>
                                    <div className="text-sm text-gray-300">
                                      Your ranking among industry leaders and competitors
                                    </div>
                                  </div>
                                </div>

                                {/* Company Rankings */}
                                <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                                  {benchmarkCompanies.slice(0, 15).map((company, index) => (
                                    <div
                                      key={company.name}
                                      className={`flex justify-between items-center px-4 sm:px-6 py-4 transition-all duration-200 ${
                                        company.isUser
                                          ? "bg-blue-500/10 font-bold border-l-4 border-l-blue-500 shadow-lg"
                                          : "hover:bg-gray-800/50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 sm:gap-4">
                                        <span className="text-[#3b82f6] font-bold text-sm sm:text-base w-6 sm:w-8">
                                          #{index + 1}
                                        </span>
                                        <span
                                          className={`text-sm sm:text-base ${
                                            company.isUser ? "text-[#f8fafc] font-bold" : "text-gray-300"
                                          }`}
                                        >
                                          {company.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className={`font-bold text-sm sm:text-base ${getScoreColor(company.score)}`}>
                                          {company.score}
                                        </span>
                                        <span className="text-gray-400 text-xs sm:text-sm">/100</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}
                        </CardContent>
                      </Card>

                      <div className="text-center mt-8">
                        <Button
                          onClick={handleGetCompleteReport}
                          className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 min-h-[44px] text-base sm:text-lg"
                          aria-label="Get complete strategic analysis report"
                        >
                          Get My Complete Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {wordCount < 8 && missionText.length > 0 && (
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed" role="status">
                  Need at least 8 words to analyze ({wordCount}/8 words)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Capture Section */}
        {showEmailCapture && (
          <Card
            id="email-capture-section"
            className="bg-gradient-to-br from-[#111827] to-[#1f2937] border-t-4 border-t-[#3b82f6] border-gray-600 mb-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
          >
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="text-center mb-8 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#f8fafc] mb-4 leading-tight tracking-tight">
                  Get Your Complete Strategic Analysis
                </h2>
                <p className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed">
                  Unlock detailed recommendations, competitive benchmarking, and strategic roadmap
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#f8fafc] mb-2 text-base sm:text-lg">Detailed Breakdown</h4>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        Complete analysis of all 5 metrics with specific improvement suggestions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#f8fafc] mb-2 text-base sm:text-lg">Alternative Rewrites</h4>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        3 professionally crafted mission statement alternatives
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#f8fafc] mb-2 text-base sm:text-lg">Strategic Roadmap</h4>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        Step-by-step plan with workshop questions and next steps
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-[#f8fafc] font-semibold text-base mb-2 block">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => handleEmailChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 sm:pl-12 bg-[#0a0e1a] border-gray-600 text-[#f8fafc] placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-2 min-h-[44px] text-base sm:text-lg rounded-lg transition-all duration-200"
                        required
                        aria-describedby={emailError ? "email-error" : undefined}
                      />
                    </div>
                    {emailError && (
                      <p id="email-error" className="text-red-400 text-sm mt-2" role="alert">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="firstName" className="text-[#f8fafc] font-semibold text-base mb-2 block">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        value={emailForm.firstName}
                        onChange={(e) => handleEmailChange("firstName", e.target.value)}
                        placeholder="John"
                        className="pl-10 sm:pl-12 bg-[#0a0e1a] border-gray-600 text-[#f8fafc] placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-2 min-h-[44px] text-base sm:text-lg rounded-lg transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-[#f8fafc] font-semibold text-base mb-2 block">
                      Company
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        id="company"
                        type="text"
                        value={emailForm.company}
                        onChange={(e) => handleEmailChange("company", e.target.value)}
                        placeholder="Your Company"
                        className="pl-10 sm:pl-12 bg-[#0a0e1a] border-gray-600 text-[#f8fafc] placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:ring-2 min-h-[44px] text-base sm:text-lg rounded-lg transition-all duration-200"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isGeneratingReport}
                    className="w-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white font-semibold py-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 min-h-[44px] text-base sm:text-lg"
                    aria-label="Submit form to get complete report"
                  >
                    {isGeneratingReport ? (
                      <div className="flex items-center justify-center gap-3" role="status" aria-live="polite">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating Report...</span>
                      </div>
                    ) : (
                      "Get My Complete Report"
                    )}
                  </Button>

                  <p className="text-xs sm:text-sm text-gray-400 text-center leading-relaxed">
                    We respect your privacy. Unsubscribe anytime. No spam, ever.
                  </p>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Analysis Report */}
        {showCompleteReport && (
          <Card
            id="complete-report-section"
            className="bg-[#111827] border-gray-600 mb-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
          >
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent mb-8 lg:mb-10 flex items-center gap-3 leading-tight">
                📊 Complete Strategic Analysis Report
              </h2>

              {/* Executive Summary */}
              <Card className="bg-[#0a0e1a] border-l-4 border-l-blue-500 border-gray-600 mb-8 lg:mb-10 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6">Executive Summary</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-300 font-medium text-base">Overall Score:</span>
                      <span className={`font-bold text-lg sm:text-xl ${getScoreColor(overallScore)}`}>
                        {overallScore}/100 ({getScoreCategory(overallScore)})
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-300 font-medium text-base">Strongest Metric:</span>
                      <span className="text-green-400 font-semibold text-base">
                        {(() => {
                          const scores = [
                            { name: "Clarity", score: clarityScore },
                            { name: "Specificity", score: specificityScore },
                            { name: "Impact", score: impactScore },
                            { name: "Authenticity", score: authenticityScore },
                            { name: "Memorability", score: memorabilityScore },
                          ]
                          const strongest = scores.reduce((prev, current) =>
                            prev.score > current.score ? prev : current,
                          )
                          return `${strongest.name} (${strongest.score})`
                        })()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-gray-300 font-medium text-base">Weakest Metric:</span>
                      <span className="text-red-400 font-semibold text-base">
                        {(() => {
                          const scores = [
                            { name: "Clarity", score: clarityScore },
                            { name: "Specificity", score: specificityScore },
                            { name: "Impact", score: impactScore },
                            { name: "Authenticity", score: authenticityScore },
                            { name: "Memorability", score: memorabilityScore },
                          ]
                          const weakest = scores.reduce((prev, current) =>
                            prev.score < current.score ? prev : current,
                          )
                          return `${weakest.name} (${weakest.score})`
                        })()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base mt-6 leading-relaxed">
                      {overallScore >= 85
                        ? "Your mission statement demonstrates exceptional quality and aligns with Fortune 500 standards."
                        : overallScore >= 70
                          ? "Your mission statement has a strong foundation but could benefit from targeted improvements."
                          : "Your mission statement requires significant revision to meet professional standards."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Weaknesses Analysis */}
              {aiAnalysis?.weaknesses && (
                <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30 mb-8 lg:mb-10">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6 flex items-center gap-2">
                      <span className="text-red-400">⚠️</span>
                      Key Areas for Improvement
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-red-400 font-bold">1.</span>
                        <div>
                          <span className="font-semibold text-[#f8fafc]">Primary Weakness:</span>
                          <p className="text-gray-300 mt-1">{aiAnalysis.weaknesses.primary}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-orange-400 font-bold">2.</span>
                        <div>
                          <span className="font-semibold text-[#f8fafc]">Secondary Weakness:</span>
                          <p className="text-gray-300 mt-1">{aiAnalysis.weaknesses.secondary}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-400 font-bold">3.</span>
                        <div>
                          <span className="font-semibold text-[#f8fafc]">Tertiary Weakness:</span>
                          <p className="text-gray-300 mt-1">{aiAnalysis.weaknesses.tertiary}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Metric Breakdown */}
              <div className="mb-8 lg:mb-10">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6 lg:mb-8">
                  Detailed Metric Breakdown
                </h3>
                <div className="grid gap-4 sm:gap-6">
                  {[
                    {
                      name: "Clarity",
                      score: clarityScore,
                      analysis: [
                        `Word count: ${wordCount} words`,
                        `Length assessment: ${wordCount >= 8 && wordCount <= 35 ? "Optimal" : wordCount < 8 ? "Too short" : "Too long"}`,
                        `Buzzword usage: ${["world-class", "leading", "solutions", "synergy", "innovative", "excellence"].filter((word) => missionText.toLowerCase().includes(word)).length > 0 ? "Present" : "None detected"}`,
                      ],
                    },
                    {
                      name: "Specificity",
                      score: specificityScore,
                      analysis: [
                        `Action verbs: ${["accelerate", "organize", "empower", "unlock", "transform"].filter((verb) => missionText.toLowerCase().includes(verb)).length > 0 ? "Strong verbs present" : "Weak or missing"}`,
                        `Industry terms: ${missionText.toLowerCase().includes("energy") || missionText.toLowerCase().includes("information") ? "Specific terminology used" : "Generic language"}`,
                        `Scope definition: ${missionText.toLowerCase().includes("planet") || missionText.toLowerCase().includes("world") ? "Global scope" : "Limited scope"}`,
                      ],
                    },
                    {
                      name: "Impact",
                      score: impactScore,
                      analysis: [
                        `Global reach: ${["world", "planet", "every person", "every organization"].filter((word) => missionText.toLowerCase().includes(word)).length > 0 ? "Clearly defined" : "Unclear"}`,
                        `Transformation focus: ${["transition", "accelerate", "empower", "organize"].filter((word) => missionText.toLowerCase().includes(word)).length > 0 ? "Present" : "Missing"}`,
                        `Societal benefit: ${missionText.toLowerCase().includes("sustainable") || missionText.toLowerCase().includes("accessible") ? "Evident" : "Unclear"}`,
                      ],
                    },
                    {
                      name: "Authenticity",
                      score: authenticityScore,
                      analysis: [
                        `Corporate speak: ${["stakeholders", "leverage", "optimize", "maximize"].filter((word) => missionText.toLowerCase().includes(word)).length > 0 ? "Present" : "Avoided"}`,
                        `Genuine purpose: ${missionText.toLowerCase().includes("transition") || missionText.toLowerCase().includes("empower") ? "Authentic" : "Generic"}`,
                        `Length appropriateness: ${wordCount < 15 ? "Concise" : "Verbose"}`,
                      ],
                    },
                    {
                      name: "Memorability",
                      score: memorabilityScore,
                      analysis: [
                        `Length for recall: ${wordCount >= 6 && wordCount <= 12 ? "Optimal" : "Suboptimal"}`,
                        `Structure: ${missionText.startsWith("To ") ? "Clear format" : "Unclear format"}`,
                        `Complexity: ${missionText.split(/,|—|;/).length === 1 ? "Simple" : "Complex"}`,
                      ],
                    },
                  ].map((metric) => (
                    <Card
                      key={metric.name}
                      className="bg-[#0a0e1a] border-gray-600 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-[#f8fafc] flex items-center gap-3 text-base sm:text-lg">
                            <span className="text-lg sm:text-xl">{getScoreIndicator(metric.score)}</span>
                            {metric.name}
                          </h4>
                          <span className={`font-bold text-base sm:text-lg ${getScoreColor(metric.score)}`}>
                            {metric.score}/100
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {metric.analysis.map((point, index) => (
                            <li
                              key={index}
                              className="text-sm sm:text-base text-gray-300 flex items-start gap-3 leading-relaxed"
                            >
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Alternative Rewrite Options */}
              <div className="mb-8 lg:mb-10">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6 lg:mb-8 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                  AI-Generated Alternative Rewrites
                </h3>
                <div className="grid gap-4 sm:gap-6">
                  {(() => {
                    const alternatives = aiAnalysis?.alternativeRewrites || {
                      actionFocused: generateAlternativeRewrites(missionText, overallScore).actionFocused,
                      problemSolution: generateAlternativeRewrites(missionText, overallScore).problemSolution,
                      visionDriven: generateAlternativeRewrites(missionText, overallScore).visionDriven,
                    }
                    
                    const isEnhanced = aiAnalysis?.alternativeRewrites?.actionFocused?.text !== undefined
                    
                    return [
                      {
                        title: "Action-Focused Version",
                        text: isEnhanced ? alternatives.actionFocused.text : alternatives.actionFocused,
                        description: "Emphasizes strong verbs and transformation",
                        rationale: isEnhanced ? alternatives.actionFocused.rationale : null,
                        improvesOn: isEnhanced ? alternatives.actionFocused.improvesOn : [],
                        icon: "⚡",
                      },
                      {
                        title: "Problem-Solution Version",
                        text: isEnhanced ? alternatives.problemSolution.text : alternatives.problemSolution,
                        description: "Highlights challenges and solutions",
                        rationale: isEnhanced ? alternatives.problemSolution.rationale : null,
                        improvesOn: isEnhanced ? alternatives.problemSolution.improvesOn : [],
                        icon: "🎯",
                      },
                      {
                        title: "Vision-Driven Version",
                        text: isEnhanced ? alternatives.visionDriven.text : alternatives.visionDriven,
                        description: "Focuses on future aspirations and impact",
                        rationale: isEnhanced ? alternatives.visionDriven.rationale : null,
                        improvesOn: isEnhanced ? alternatives.visionDriven.improvesOn : [],
                        icon: "🚀",
                      },
                    ].map((alternative, index) => (
                      <Card
                        key={index}
                        className="bg-[#0a0e1a] border-gray-600 hover:shadow-lg transition-all duration-200 relative overflow-hidden"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-[#f8fafc] text-base sm:text-lg flex items-center gap-2">
                              <span className="text-2xl">{alternative.icon}</span>
                              {alternative.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(alternative.text)
                                setCopiedIndex(index)
                                setTimeout(() => setCopiedIndex(null), 2000)
                              }}
                              className="text-gray-400 hover:text-white"
                              aria-label="Copy to clipboard"
                            >
                              {copiedIndex === index ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-gray-100 font-medium mb-4 text-base sm:text-lg leading-relaxed bg-gray-800/50 p-3 rounded-lg">
                            "{alternative.text}"
                          </p>
                          
                          {alternative.rationale && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-300 leading-relaxed">
                                <span className="font-semibold text-[#3b82f6]">Why this works:</span> {alternative.rationale}
                              </p>
                            </div>
                          )}
                          
                          {alternative.improvesOn.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs text-gray-400">Improves:</span>
                              {alternative.improvesOn.map((metric: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full"
                                >
                                  {metric}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-400 leading-relaxed">{alternative.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  })()}
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6 lg:mb-8">
                  Recommended Next Steps
                </h3>
                {(() => {
                  const nextSteps = getNextSteps(overallScore)
                  return (
                    <Card className="bg-[#0a0e1a] border-gray-600 shadow-lg">
                      <CardContent className="p-6 sm:p-8">
                        <h4 className="font-semibold text-[#f8fafc] mb-6 text-lg sm:text-xl">{nextSteps.title}</h4>
                        <ul className="space-y-4">
                          {nextSteps.steps.map((step, index) => (
                            <li
                              key={index}
                              className="text-gray-300 flex items-start gap-4 text-sm sm:text-base leading-relaxed"
                            >
                              <span className="text-lg sm:text-xl flex-shrink-0">{step.split(" ")[0]}</span>
                              <span>{step.substring(step.indexOf(" ") + 1)}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example Companies */}
        <div className="space-y-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[#f8fafc] mb-6 flex items-center gap-2">
            <span>{industries.find(i => i.value === selectedIndustry)?.icon}</span>
            {industries.find(i => i.value === selectedIndustry)?.label} Examples
          </h3>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(industryExamples[selectedIndustry as keyof typeof industryExamples] || industryExamples.technology).map((company) => (
              <Card
                key={company.name}
                className="bg-[#111827] border-gray-700 hover:border-[#3b82f6] transition-all duration-200 cursor-pointer group hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                onClick={() => handleExampleClick(company.mission)}
                tabIndex={0}
                role="button"
                aria-label={`Analyze ${company.name}'s mission statement`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleExampleClick(company.mission)
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <CardContent className="p-4 sm:p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#f8fafc] group-hover:text-[#3b82f6] transition-colors text-base sm:text-lg">
                      {company.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-sm sm:text-base ${getScoreColor(company.score)}`}>
                        {company.score}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm">/100</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                    "{company.mission}"
                  </p>
                  <div className="text-xs sm:text-sm text-gray-500 group-hover:text-[#3b82f6] transition-colors font-medium">
                    Click to analyze this example
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Professional-grade analysis powered by Fortune 500 benchmarking standards
          </p>
        </div>
      </main>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          
          .animate-spin,
          .animate-in,
          .transition-all,
          .duration-200,
          .duration-300,
          .duration-500,
          .duration-700,
          .duration-1000,
          .duration-2000 {
            animation: none !important;
            transition: none !important;
          }
          
          .hover\\:scale-\\[1\\.02\\] {
            transform: none !important;
          }
          
          .hover\\:-translate-y-1 {
            transform: none !important;
          }
        }
        
        /* Focus styles for accessibility */
        .focus\\:ring-2:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .text-gray-400 {
            color: #9ca3af;
          }
          
          .text-gray-300 {
            color: #d1d5db;
          }
          
          .border-gray-600 {
            border-color: #6b7280;
          }
        }
        
        /* Touch target optimization */
        @media (pointer: coarse) {
          button,
          [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Performance optimizations */
        .animate-spin {
          animation: spin 1s linear infinite;
          will-change: transform;
        }
        
        .transition-all {
          will-change: transform, opacity, box-shadow;
        }
        
        /* Smooth animations */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slide-in-from-bottom 0.5s ease-out;
        }
        
        /* Typography improvements */
        body {
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Grid system consistency */
        .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        @media (min-width: 640px) {
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

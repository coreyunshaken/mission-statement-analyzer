"use client"

import React, { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sentiment analysis keywords
const POSITIVE_WORDS = [
  'accelerate', 'achieve', 'advance', 'amazing', 'awesome', 'beautiful', 'benefit', 'best', 'better', 'breakthrough',
  'brilliant', 'champion', 'create', 'deliver', 'discover', 'drive', 'elevate', 'empower', 'enable', 'enhance',
  'excel', 'exceptional', 'exciting', 'extraordinary', 'fantastic', 'forward', 'great', 'grow', 'help', 'improve',
  'incredible', 'innovate', 'inspire', 'lead', 'leading', 'love', 'outstanding', 'perfect', 'positive', 'powerful',
  'progress', 'remarkable', 'revolutionize', 'solve', 'strong', 'success', 'superior', 'support', 'thrive',
  'transform', 'ultimate', 'unique', 'unlock', 'wonderful', 'world-class'
]

const NEGATIVE_WORDS = [
  'against', 'avoid', 'bad', 'barrier', 'challenge', 'combat', 'crisis', 'decline', 'defeat', 'difficult',
  'disaster', 'eliminate', 'fail', 'fear', 'fight', 'hard', 'hate', 'impossible', 'loss', 'negative',
  'never', 'no', 'nothing', 'obstacle', 'oppose', 'problem', 'reject', 'risk', 'struggle', 'terrible',
  'threat', 'trouble', 'unfortunately', 'war', 'weak', 'worry', 'worse', 'worst'
]

const POWER_WORDS = [
  'accelerate', 'achieve', 'advance', 'breakthrough', 'champion', 'create', 'deliver', 'drive', 'elevate',
  'empower', 'enable', 'enhance', 'excel', 'innovate', 'inspire', 'lead', 'pioneer', 'revolutionize',
  'solve', 'transform', 'unlock', 'catalyze', 'amplify', 'maximize', 'optimize'
]

const INCLUSIVE_LANGUAGE = [
  'everyone', 'all people', 'every person', 'every individual', 'inclusive', 'diverse', 'equitable',
  'accessible', 'universal', 'global', 'worldwide', 'humanity', 'community', 'together', 'collective'
]

const POTENTIALLY_EXCLUSIVE = [
  'normal', 'standard', 'typical', 'obvious', 'simple', 'natural', 'traditional', 'conventional',
  'mainstream', 'regular', 'ordinary', 'usual', 'common sense', 'clearly', 'obviously'
]

const CORPORATE_JARGON = [
  'synergy', 'leverage', 'paradigm', 'optimization', 'streamline', 'best-in-class', 'world-class',
  'cutting-edge', 'state-of-the-art', 'turnkey', 'scalable', 'robust', 'holistic', 'strategic',
  'innovative solutions', 'core competencies', 'value proposition', 'low-hanging fruit'
]

// Calculate reading level using Flesch-Kincaid formula
function calculateReadingLevel(text: string): { grade: number; level: string; score: number } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length
  const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0)

  if (sentences === 0 || wordCount === 0) {
    return { grade: 0, level: "Invalid", score: 0 }
  }

  // Flesch-Kincaid Grade Level
  const grade = Math.round(0.39 * (wordCount / sentences) + 11.8 * (syllableCount / wordCount) - 15.59)
  
  let level = "Graduate"
  if (grade <= 6) level = "Elementary"
  else if (grade <= 8) level = "Middle School"
  else if (grade <= 12) level = "High School"
  else if (grade <= 16) level = "College"

  // Convert to accessibility score (lower grade = higher score)
  const score = Math.max(0, Math.min(100, 100 - Math.max(0, grade - 6) * 8))

  return { grade: Math.max(1, grade), level, score }
}

function countSyllables(word: string): number {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

// Sentiment analysis
function analyzeSentiment(text: string): { score: number; tone: string; details: string[] } {
  const words = text.toLowerCase().split(/\s+/)
  
  const positiveCount = words.filter(word => 
    POSITIVE_WORDS.some(pos => word.includes(pos))
  ).length
  
  const negativeCount = words.filter(word => 
    NEGATIVE_WORDS.some(neg => word.includes(neg))
  ).length
  
  const totalWords = words.length
  const netSentiment = positiveCount - negativeCount
  const sentimentRatio = totalWords > 0 ? (netSentiment / totalWords) * 100 : 0
  
  // Convert to 0-100 score
  const score = Math.max(0, Math.min(100, 50 + sentimentRatio * 25))
  
  let tone = "Neutral"
  if (score >= 75) tone = "Very Positive"
  else if (score >= 60) tone = "Positive"
  else if (score >= 40) tone = "Neutral"
  else if (score >= 25) tone = "Negative"
  else tone = "Very Negative"
  
  const details = []
  if (positiveCount > 0) details.push(`${positiveCount} positive words`)
  if (negativeCount > 0) details.push(`${negativeCount} negative words`)
  if (positiveCount === 0 && negativeCount === 0) details.push("No strong emotional indicators")
  
  return { score: Math.round(score), tone, details }
}

// Cultural sensitivity analysis
function analyzeCulturalSensitivity(text: string): { score: number; level: string; insights: string[] } {
  const words = text.toLowerCase().split(/\s+/)
  
  const inclusiveCount = words.filter(word => 
    INCLUSIVE_LANGUAGE.some(inc => word.includes(inc))
  ).length
  
  const exclusiveCount = words.filter(word => 
    POTENTIALLY_EXCLUSIVE.some(exc => word.includes(exc))
  ).length
  
  const jargonCount = words.filter(word => 
    CORPORATE_JARGON.some(jarg => text.toLowerCase().includes(jarg))
  ).length
  
  // Base score starts at 70
  let score = 70
  
  // Add points for inclusive language
  score += inclusiveCount * 8
  
  // Subtract points for exclusive language
  score -= exclusiveCount * 12
  
  // Subtract points for corporate jargon (can be exclusionary)
  score -= jargonCount * 5
  
  // Bonus for global/universal scope
  if (text.toLowerCase().includes('world') || text.toLowerCase().includes('global') || 
      text.toLowerCase().includes('universal') || text.toLowerCase().includes('everyone')) {
    score += 10
  }
  
  score = Math.max(0, Math.min(100, score))
  
  let level = "Highly Inclusive"
  if (score < 50) level = "Needs Improvement"
  else if (score < 70) level = "Moderately Inclusive"
  else if (score < 85) level = "Inclusive"
  
  const insights = []
  if (inclusiveCount > 0) insights.push(`Uses ${inclusiveCount} inclusive terms`)
  if (exclusiveCount > 0) insights.push(`Contains ${exclusiveCount} potentially exclusive terms`)
  if (jargonCount > 0) insights.push(`Includes ${jargonCount} jargon terms that may exclude some audiences`)
  if (insights.length === 0) insights.push("Language is appropriately neutral")
  
  return { score: Math.round(score), level, insights }
}

// Linguistic pattern analysis
function analyzeLinguisticPatterns(text: string): { 
  powerWords: number
  passiveVoice: number
  wordComplexity: number
  insights: string[]
} {
  const words = text.toLowerCase().split(/\s+/)
  
  const powerWordCount = words.filter(word => 
    POWER_WORDS.some(power => word.includes(power))
  ).length
  
  // Simple passive voice detection
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am']
  let passiveCount = 0
  for (let i = 0; i < words.length - 1; i++) {
    if (passiveIndicators.includes(words[i]) && words[i + 1].endsWith('ed')) {
      passiveCount++
    }
  }
  
  // Word complexity (average syllables per word)
  const totalSyllables = words.reduce((total, word) => total + countSyllables(word), 0)
  const avgSyllables = words.length > 0 ? totalSyllables / words.length : 0
  const complexityScore = Math.min(100, Math.max(0, (avgSyllables - 1) * 50))
  
  const insights = []
  if (powerWordCount > 0) insights.push(`Contains ${powerWordCount} power words for impact`)
  if (passiveCount > 0) insights.push(`${passiveCount} instances of passive voice detected`)
  else insights.push("Uses active voice effectively")
  
  if (avgSyllables > 2) insights.push("Uses complex vocabulary")
  else if (avgSyllables < 1.5) insights.push("Uses simple, accessible language")
  else insights.push("Balanced vocabulary complexity")
  
  return {
    powerWords: powerWordCount,
    passiveVoice: passiveCount,
    wordComplexity: Math.round(complexityScore),
    insights
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-green-400"
  if (score >= 70) return "text-blue-400"
  if (score >= 55) return "text-yellow-400"
  if (score >= 40) return "text-orange-400"
  return "text-red-400"
}

interface AdvancedAnalyticsProps {
  missionText: string
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ missionText }) => {
  const analytics = useMemo(() => {
    if (!missionText.trim()) return null
    
    const readingLevel = calculateReadingLevel(missionText)
    const sentiment = analyzeSentiment(missionText)
    const cultural = analyzeCulturalSensitivity(missionText)
    const linguistic = analyzeLinguisticPatterns(missionText)
    
    return {
      readingLevel,
      sentiment,
      cultural,
      linguistic
    }
  }, [missionText])

  if (!analytics) return null

  return (
    <Card className="bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 mt-8 shadow-2xl">
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            🔬 Advanced Analytics
          </h2>
          <p className="text-gray-200 text-base sm:text-lg">
            Deep linguistic analysis including sentiment, readability, and cultural sensitivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Sentiment Analysis */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                😊 Sentiment Analysis
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Emotional Tone</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(analytics.sentiment.score)}`}>
                    {analytics.sentiment.score}/100
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {analytics.sentiment.tone}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analytics.sentiment.score >= 85 ? 'bg-green-400' :
                    analytics.sentiment.score >= 70 ? 'bg-blue-400' :
                    analytics.sentiment.score >= 55 ? 'bg-yellow-400' :
                    analytics.sentiment.score >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${analytics.sentiment.score}%` }}
                />
              </div>
              
              <div className="space-y-2">
                {analytics.sentiment.details.map((detail, index) => (
                  <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {detail}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reading Level */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                📚 Reading Level
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Accessibility</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(analytics.readingLevel.score)}`}>
                    {analytics.readingLevel.score}/100
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Grade {analytics.readingLevel.grade}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analytics.readingLevel.score >= 85 ? 'bg-green-400' :
                    analytics.readingLevel.score >= 70 ? 'bg-blue-400' :
                    analytics.readingLevel.score >= 55 ? 'bg-yellow-400' :
                    analytics.readingLevel.score >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${analytics.readingLevel.score}%` }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  {analytics.readingLevel.level} level text
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  {analytics.readingLevel.grade <= 8 ? 'Highly accessible' : 
                   analytics.readingLevel.grade <= 12 ? 'Moderately accessible' : 'Advanced vocabulary'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cultural Sensitivity */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                🌍 Cultural Sensitivity
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Inclusivity</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(analytics.cultural.score)}`}>
                    {analytics.cultural.score}/100
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {analytics.cultural.level}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analytics.cultural.score >= 85 ? 'bg-green-400' :
                    analytics.cultural.score >= 70 ? 'bg-blue-400' :
                    analytics.cultural.score >= 55 ? 'bg-yellow-400' :
                    analytics.cultural.score >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${analytics.cultural.score}%` }}
                />
              </div>
              
              <div className="space-y-2">
                {analytics.cultural.insights.map((insight, index) => (
                  <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {insight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linguistic Patterns */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                🔤 Linguistic Patterns
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Power Words</span>
                  <span className="text-indigo-400 font-semibold">{analytics.linguistic.powerWords}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Passive Voice</span>
                  <span className={`font-semibold ${analytics.linguistic.passiveVoice === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {analytics.linguistic.passiveVoice}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Word Complexity</span>
                  <span className={`font-semibold ${getScoreColor(100 - analytics.linguistic.wordComplexity)}`}>
                    {analytics.linguistic.wordComplexity}/100
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                {analytics.linguistic.insights.map((insight, index) => (
                  <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {insight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Accessibility Score */}
        <Card className="bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
              🎯 Overall Accessibility Score
            </h3>
            
            {(() => {
              const overallScore = Math.round(
                (analytics.sentiment.score * 0.2 + 
                 analytics.readingLevel.score * 0.3 + 
                 analytics.cultural.score * 0.3 + 
                 (100 - analytics.linguistic.wordComplexity) * 0.2)
              )
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">How accessible is your mission to diverse audiences?</span>
                    <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}/100
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        overallScore >= 85 ? 'bg-green-400' :
                        overallScore >= 70 ? 'bg-blue-400' :
                        overallScore >= 55 ? 'bg-yellow-400' :
                        overallScore >= 40 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${overallScore}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {overallScore >= 85 ? "Highly accessible to diverse audiences with clear, inclusive language." :
                     overallScore >= 70 ? "Generally accessible with room for minor improvements." :
                     overallScore >= 55 ? "Moderately accessible but could benefit from simplification." :
                     overallScore >= 40 ? "Limited accessibility - consider simpler language and more inclusive terms." :
                     "Low accessibility - significant improvements needed for broader understanding."}
                  </p>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
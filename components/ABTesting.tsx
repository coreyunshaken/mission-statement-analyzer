"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

// Score calculation helpers
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
  if (wordCount >= 6 && wordCount <= 12) score = 90
  else if (wordCount >= 13 && wordCount <= 20) score = 85
  else if (wordCount > 20) score = 75 - (wordCount - 20) * 2
  else if (wordCount < 6) score = 50 + wordCount * 5

  if (text.startsWith("To ")) score += 3
  const clauses = text.split(/,|—|;/).length
  if (clauses === 1) score += 5
  else score -= (clauses - 1) * 3

  return Math.max(20, Math.min(100, Math.round(score)))
}

function calculateAllScores(text: string): ABTestScores {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
  
  const clarity = calculateClarity(text, wordCount)
  const specificity = calculateSpecificity(text)
  const impact = calculateImpact(text)
  const authenticity = calculateAuthenticity(text, wordCount)
  const memorability = calculateMemorability(text, wordCount)
  
  return {
    clarity,
    specificity,
    impact,
    authenticity,
    memorability,
    overall: Math.round((clarity + specificity + impact + authenticity + memorability) / 5)
  }
}

function compareVersions(versions: ABTestVersion[]): ABTestResults | null {
  const validVersions = versions.filter(v => v.text.trim() && v.scores)
  if (validVersions.length < 2) return null
  
  const metrics: (keyof ABTestScores)[] = ['clarity', 'specificity', 'impact', 'authenticity', 'memorability', 'overall']
  const comparison: ABTestResults = {
    winner: '',
    winnerScore: 0,
    metricWinners: {},
    insights: []
  }
  
  // Find overall winner
  let highestScore = 0
  validVersions.forEach(version => {
    if (version.scores!.overall > highestScore) {
      highestScore = version.scores!.overall
      comparison.winner = version.id
      comparison.winnerScore = version.scores!.overall
    }
  })
  
  // Find metric winners
  metrics.forEach(metric => {
    let highestMetricScore = 0
    let metricWinner = ''
    
    validVersions.forEach(version => {
      if (version.scores![metric] > highestMetricScore) {
        highestMetricScore = version.scores![metric]
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
    const scoreDiff = winner.scores!.overall - loser.scores!.overall
    const winnerText = winner.text
    const loserText = loser.text
    
    comparison.insights.push({
      type: 'overall',
      message: `Version ${winner.id} wins by ${scoreDiff} points (${winner.scores!.overall} vs ${loser.scores!.overall})`
    })
    
    if (winner.scores!.clarity > loser.scores!.clarity + 5) {
      comparison.insights.push({
        type: 'clarity',
        message: `Version ${winner.id} is clearer and more concise`
      })
    }
    
    if (winner.scores!.authenticity > loser.scores!.authenticity + 5) {
      comparison.insights.push({
        type: 'authenticity',
        message: `Version ${winner.id} avoids corporate buzzwords better`
      })
    }
    
    if (winnerText.length < loserText.length && winner.scores!.memorability > loser.scores!.memorability) {
      comparison.insights.push({
        type: 'memorability',
        message: `Version ${winner.id} is more memorable due to its conciseness`
      })
    }
  }
  
  return comparison
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400"
  if (score >= 80) return "text-blue-400"
  if (score >= 70) return "text-yellow-400"
  if (score >= 60) return "text-orange-400"
  return "text-red-400"
}

export interface ABTestScores {
  clarity: number
  specificity: number
  impact: number
  authenticity: number
  memorability: number
  overall: number
}

export interface ABTestVersion {
  id: string
  text: string
  scores: ABTestScores | null
}

export interface ABTestResults {
  winner: string
  winnerScore: number
  metricWinners: Record<string, { winner: string; score: number }>
  insights: Array<{ type: string; message: string }>
}

interface ABTestingProps {
  initialVersionA: string
  initialVersionB: string
  onSelectWinner: (text: string) => void
  onClose: () => void
}

export const ABTesting: React.FC<ABTestingProps> = ({
  initialVersionA,
  initialVersionB,
  onSelectWinner,
  onClose
}) => {
  const [versions, setVersions] = useState<ABTestVersion[]>([
    { id: 'A', text: initialVersionA, scores: null },
    { id: 'B', text: initialVersionB, scores: null },
  ])
  const [results, setResults] = useState<ABTestResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVersionChange = useCallback((versionId: string, text: string) => {
    setVersions(prev => prev.map(version => 
      version.id === versionId ? { ...version, text } : version
    ))
  }, [])

  const handleRunTest = useCallback(async () => {
    setIsLoading(true)
    
    // Calculate scores for each version
    const updatedVersions = versions.map(version => ({
      ...version,
      scores: calculateAllScores(version.text)
    }))
    
    setVersions(updatedVersions)
    
    // Generate comparison results
    const testResults = compareVersions(updatedVersions)
    setResults(testResults)
    
    setIsLoading(false)
  }, [versions])

  const handleSelectWinner = useCallback((versionId: string) => {
    const winningVersion = versions.find(v => v.id === versionId)
    if (winningVersion) {
      onSelectWinner(winningVersion.text)
    }
  }, [versions, onSelectWinner])

  const handleAddVersion = useCallback(() => {
    if (versions.length < 3) {
      setVersions(prev => [...prev, { 
        id: String.fromCharCode(65 + prev.length), // C, D, etc.
        text: '', 
        scores: null
      }])
    }
  }, [versions.length])

  return (
    <Card 
      id="ab-testing-section"
      className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mt-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
    >
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            📊 A/B Testing Lab
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Compare multiple versions side-by-side to find your strongest mission statement
          </p>
        </div>

        {/* Version Input Section */}
        <div className="space-y-6 mb-8">
          {versions.map((version) => (
            <Card key={version.id} className="bg-[#0a0e1a] border-gray-600">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
                    <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
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
                      {results?.winner === version.id && (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                          🏆 WINNER
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <Textarea
                  value={version.text}
                  onChange={(e) => handleVersionChange(version.id, e.target.value)}
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
                        {results?.metricWinners[metric.name.toLowerCase()]?.winner === version.id && (
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
            onClick={handleRunTest}
            disabled={isLoading || versions.some(v => !v.text.trim())}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-white font-semibold px-8 py-3 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
          
          {versions.length < 3 && (
            <Button
              variant="outline"
              onClick={handleAddVersion}
              className="border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
            >
              ➕ Add Version
            </Button>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-6 flex items-center gap-2">
                🏆 Test Results
              </h3>
              
              {/* Winner Announcement */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  Version {results.winner} Wins!
                </div>
                <div className="text-lg text-gray-300">
                  Score: {results.winnerScore}/100
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-3 mb-6">
                {results.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[#0a0e1a] rounded-lg">
                    <span className="text-yellow-400">💡</span>
                    <span className="text-gray-300 text-sm">{insight.message}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => handleSelectWinner(results.winner)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2"
                >
                  🎯 Use Version {results.winner}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
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
  )
}
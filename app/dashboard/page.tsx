"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, BarChart3, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

interface Analysis {
  id: string
  missionText: string
  industry: string
  overallScore: number
  clarityScore: number
  specificityScore: number
  impactScore: number
  authenticityScore: number
  memorabilityScore: number
  createdAt: string
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analyses')
      const data = await response.json()
      setAnalyses(data.analyses || [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 60) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (score >= 80) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    if (score >= 70) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    if (score >= 60) return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0e1a]/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analyzer
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#f8fafc]">My Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#111827] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Analyses</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">{analyses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">
                    {analyses.length > 0 
                      ? Math.round(analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Best Score</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">
                    {analyses.length > 0 
                      ? Math.max(...analyses.map(a => a.overallScore))
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#f8fafc] mb-6">Recent Analyses</h2>
          
          {analyses.length === 0 ? (
            <Card className="bg-[#111827] border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 mb-4">No analyses yet</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af]">
                    Analyze Your First Mission Statement
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="bg-[#111827] border-gray-700 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-[#f8fafc] font-medium mb-2 leading-relaxed">
                          "{analysis.missionText.length > 150 
                            ? analysis.missionText.substring(0, 150) + "..."
                            : analysis.missionText}"
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {analysis.industry}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <Badge className={`${getScoreBadgeColor(analysis.overallScore)} border`}>
                          {analysis.overallScore}/100
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3 text-center">
                      {[
                        { name: "Clarity", score: analysis.clarityScore },
                        { name: "Specificity", score: analysis.specificityScore },
                        { name: "Impact", score: analysis.impactScore },
                        { name: "Authenticity", score: analysis.authenticityScore },
                        { name: "Memorability", score: analysis.memorabilityScore },
                      ].map((metric) => (
                        <div key={metric.name}>
                          <p className={`text-lg font-semibold ${getScoreColor(metric.score)}`}>
                            {metric.score}
                          </p>
                          <p className="text-xs text-gray-400">{metric.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  Target,
  Sparkles,
  Building2,
  FileText,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  History,
  Save,
  Star,
  Globe,
  Zap,
  Shield,
  Heart,
  Brain,
} from "lucide-react"

const industries = [
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "retail", label: "Retail", icon: "🛍️" },
  { value: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "nonprofit", label: "Non-Profit", icon: "🤝" },
  { value: "hospitality", label: "Hospitality", icon: "🏨" },
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
      score: 92,
    },
    {
      name: "Microsoft",
      mission: "To empower every person and every organization on the planet to achieve more.",
      score: 93,
    },
  ],
  healthcare: [
    {
      name: "Mayo Clinic",
      mission: "To inspire hope and promote health through integrated clinical practice, education and research.",
      score: 68,
    },
    {
      name: "CVS Health",
      mission: "Helping people on their path to better health.",
      score: 69,
    },
  ],
  finance: [
    {
      name: "JPMorgan Chase",
      mission: "To be the best financial services company in the world.",
      score: 73,
    },
    {
      name: "PayPal",
      mission: "To democratize financial services to ensure that everyone has access to affordable, convenient, and secure products.",
      score: 68,
    },
  ],
}

// Scoring functions (same as before)
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
  if (wordCount >= 6 && wordCount <= 12) score = 93
  else if (wordCount >= 13 && wordCount <= 20) score = 90
  else if (wordCount >= 21 && wordCount <= 30) score = 82
  else if (wordCount > 30) score = 75 - (wordCount - 30) * 2
  if (text.startsWith("To ") || text.includes("We're in business to")) score += 5
  const ideas = text.split(/,|—|;/).length
  if (ideas === 1) score += 8
  return Math.max(35, Math.min(100, Math.round(score)))
}

export default function MissionStatementAnalyzer() {
  const [missionText, setMissionText] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("technology")
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [scores, setScores] = useState<any>(null)
  const [activeView, setActiveView] = useState("analyzer")
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([])

  const wordCount = useMemo(() => {
    return missionText.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [missionText])

  const handleAnalyze = useCallback(() => {
    if (missionText.trim().length < 10) return
    
    const calculatedScores = calculateAllScores(missionText, selectedIndustry)
    setScores(calculatedScores)
    setIsAnalyzed(true)
    
    // Add to saved analyses
    setSavedAnalyses(prev => [{
      id: Date.now(),
      mission: missionText,
      scores: calculatedScores,
      industry: selectedIndustry,
      date: new Date().toLocaleDateString()
    }, ...prev].slice(0, 5))
  }, [missionText, selectedIndustry])

  const handleExampleClick = useCallback((example: any) => {
    setMissionText(example.mission)
    setIsAnalyzed(false)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Strong"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Work"
  }

  const currentExamples = industryExamples[selectedIndustry as keyof typeof industryExamples] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mission Statement Analyzer</h1>
                <p className="text-sm text-gray-500">Fortune 500 Standards</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                Guide
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button
                  variant={activeView === "analyzer" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("analyzer")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Analyzer
                </Button>
                <Button
                  variant={activeView === "examples" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("examples")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Industry Examples
                </Button>
                <Button
                  variant={activeView === "tips" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("tips")}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Best Practices
                </Button>
              </CardContent>
            </Card>

            {/* Saved Analyses */}
            {savedAnalyses.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium">Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setMissionText(analysis.mission)
                        setSelectedIndustry(analysis.industry)
                        setScores(analysis.scores)
                        setIsAnalyzed(true)
                      }}
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {analysis.mission}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{analysis.date}</span>
                        <Badge variant="secondary" className="text-xs">
                          {analysis.scores.overall}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            {/* Hero Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Analyze Your Mission Statement</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Get instant feedback based on Fortune 500 best practices
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Your Industry
                  </label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          <span className="flex items-center gap-2">
                            <span>{industry.icon}</span>
                            <span>{industry.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your Mission Statement
                    </label>
                    <span className="text-xs text-gray-500">
                      {wordCount} words
                    </span>
                  </div>
                  <Textarea
                    placeholder="Enter your mission statement here..."
                    value={missionText}
                    onChange={(e) => setMissionText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={missionText.trim().length < 10}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Mission Statement
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            {isAnalyzed && scores && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Analysis Results</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-lg px-3 py-1 ${
                        scores.overall >= 80 ? 'bg-green-100 text-green-800' :
                        scores.overall >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Overall Score: {scores.overall}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Score Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "Clarity", score: scores.clarity, icon: <Globe className="h-4 w-4" /> },
                        { name: "Specificity", score: scores.specificity, icon: <Target className="h-4 w-4" /> },
                        { name: "Impact", score: scores.impact, icon: <Zap className="h-4 w-4" /> },
                        { name: "Authenticity", score: scores.authenticity, icon: <Shield className="h-4 w-4" /> },
                        { name: "Memorability", score: scores.memorability, icon: <Brain className="h-4 w-4" /> },
                      ].map((metric) => (
                        <div key={metric.name} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="text-gray-600">{metric.icon}</div>
                              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getScoreIcon(metric.score)}
                              <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                                {metric.score}
                              </span>
                            </div>
                          </div>
                          <Progress value={metric.score} className="h-2" />
                          <span className="text-xs text-gray-500 mt-1 block">
                            {getScoreLabel(metric.score)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Industry Examples */}
            {activeView === "analyzer" && currentExamples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Industry Examples</CardTitle>
                  <p className="text-sm text-gray-600">
                    Click any example to test it in the analyzer
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentExamples.map((example) => (
                    <div
                      key={example.name}
                      onClick={() => handleExampleClick(example)}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{example.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              Score: {example.score}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{example.mission}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 mt-1" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            {/* Quick Stats */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analyses Today</span>
                  <span className="font-semibold">{savedAnalyses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Score</span>
                  <span className="font-semibold">
                    {savedAnalyses.length > 0 
                      ? Math.round(savedAnalyses.reduce((acc, a) => acc + a.scores.overall, 0) / savedAnalyses.length)
                      : "-"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Score</span>
                  <span className="font-semibold">
                    {savedAnalyses.length > 0 
                      ? Math.max(...savedAnalyses.map(a => a.scores.overall))
                      : "-"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Keep it under 20 words for maximum impact
                  </div>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Start with an action verb like "To empower" or "To transform"
                  </div>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Avoid buzzwords like "synergy" or "leverage"
                  </div>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Focus on your unique value proposition
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
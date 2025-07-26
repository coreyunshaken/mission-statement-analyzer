"use client"

import React, { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, Sparkles } from "lucide-react"

// Color and category functions
function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400"
  if (score >= 80) return "text-blue-400"
  if (score >= 70) return "text-yellow-400"
  if (score >= 60) return "text-orange-400"
  return "text-red-400"
}

function getScoreCategory(score: number): string {
  if (score >= 90) return "Exceptional"
  if (score >= 80) return "Strong"
  if (score >= 70) return "Good"
  if (score >= 60) return "Needs Work"
  return "Poor"
}

function getProgressColor(score: number): string {
  if (score >= 90) return "bg-green-400"
  if (score >= 80) return "bg-blue-400"
  if (score >= 70) return "bg-yellow-400"
  if (score >= 60) return "bg-orange-400"
  return "bg-red-400"
}

function getScoreIndicator(score: number): string {
  if (score >= 90) return "🏆"
  if (score >= 80) return "⭐"
  if (score >= 70) return "👍"
  if (score >= 60) return "⚠️"
  return "❌"
}

// Benchmark data
const industryBenchmarks: Record<string, { average: number; top25: number; top10: number; median: number }> = {
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

function calculatePercentile(score: number, industry: string): number {
  const benchmark = industryBenchmarks[industry] || industryBenchmarks.other
  
  if (score >= benchmark.top10) return Math.min(95, 85 + (score - benchmark.top10) * 2)
  if (score >= benchmark.top25) return Math.min(85, 65 + (score - benchmark.top25) * 3)
  if (score >= benchmark.median) return Math.min(65, 35 + (score - benchmark.median) * 2.5)
  if (score >= benchmark.average - 10) return Math.min(35, 15 + (score - (benchmark.average - 10)) * 2)
  return Math.max(5, score * 0.25)
}

function getPerformanceBand(score: number): string {
  if (score >= 90) return "Exceptional"
  if (score >= 80) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs Improvement"
}

export interface Scores {
  clarity: number
  specificity: number
  impact: number
  authenticity: number
  memorability: number
  overall: number
}

export interface Alternative {
  text: string
  rationale?: string
  improvesOn?: string[]
}

export interface AnalysisData {
  scores?: Scores
  alternatives?: {
    actionFocused: Alternative
    problemSolution: Alternative
    visionDriven: Alternative
  }
  weaknesses?: {
    primary: string
    secondary: string
    tertiary: string
  }
}

interface AnalysisResultsProps {
  scores: Scores
  selectedIndustry: string
  aiAnalysis?: AnalysisData
  onGetCompleteReport: () => void
  copiedIndex: number | null
  onCopyAlternative: (index: number, text: string) => void
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = memo(({
  scores,
  selectedIndustry,
  aiAnalysis,
  onGetCompleteReport,
  copiedIndex,
  onCopyAlternative
}) => {
  const benchmark = industryBenchmarks[selectedIndustry] || industryBenchmarks.other
  const percentile = calculatePercentile(scores.overall, selectedIndustry)
  const performanceBand = getPerformanceBand(scores.overall)

  return (
    <Card
      id="results-section"
      className="bg-[#111827] border-gray-600 mt-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
    >
      <CardContent className="p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent mb-4 lg:mb-6">
            📊 Mission Statement Analysis
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Professional assessment using Fortune 500 standards
          </p>
        </div>

        {/* Overall Score Display */}
        <div className="text-center mb-12">
          <div
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full border-8 flex items-center justify-center mb-6 relative overflow-hidden"
            style={{
              borderColor: getScoreColor(scores.overall).replace('text-', ''),
              background: `conic-gradient(${getScoreColor(scores.overall).replace('text-', '')} ${scores.overall * 3.6}deg, #374151 0deg)`
            }}
          >
            <div className="bg-[#111827] w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center">
              <span className={`text-3xl sm:text-4xl font-bold ${getScoreColor(scores.overall)}`}>
                {scores.overall}
              </span>
            </div>
          </div>
          <div className="text-center">
            <span className={`text-lg sm:text-xl font-semibold ${getScoreColor(scores.overall)}`}>
              {getScoreCategory(scores.overall)}
            </span>
            <p className="text-sm sm:text-base text-gray-400 mt-2 leading-relaxed">Overall Performance</p>
          </div>
        </div>

        {/* Enhanced Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {[
            { name: "Clarity", score: scores.clarity, delay: "0ms" },
            { name: "Specificity", score: scores.specificity, delay: "150ms" },
            { name: "Impact", score: scores.impact, delay: "300ms" },
            { name: "Authenticity", score: scores.authenticity, delay: "450ms" },
            { name: "Memorability", score: scores.memorability, delay: "600ms" },
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

        {/* Enhanced Industry Benchmarking */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="font-semibold text-[#f8fafc] mb-6 text-lg sm:text-xl flex items-center gap-2">
            📊 Industry Performance Analysis
          </h4>
          
          {/* Percentile Ranking Card */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 mb-6">
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
        </div>

        {/* AI-Generated Alternative Rewrites */}
        {aiAnalysis?.alternatives && (
          <div className="mb-8 lg:mb-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#f8fafc] mb-6 lg:mb-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              AI-Generated Alternative Rewrites
            </h3>
            <div className="grid gap-4 sm:gap-6">
              {[
                {
                  title: "Action-Focused Version",
                  alt: aiAnalysis.alternatives.actionFocused,
                  icon: "⚡",
                  description: "Emphasizes strong verbs and transformation"
                },
                {
                  title: "Problem-Solution Version", 
                  alt: aiAnalysis.alternatives.problemSolution,
                  icon: "🎯",
                  description: "Highlights challenges and solutions"
                },
                {
                  title: "Vision-Driven Version",
                  alt: aiAnalysis.alternatives.visionDriven,
                  icon: "🚀", 
                  description: "Focuses on future aspirations and impact"
                }
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
                        onClick={() => onCopyAlternative(index, alternative.alt.text)}
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
                      "{alternative.alt.text}"
                    </p>
                    
                    {alternative.alt.rationale && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          <span className="font-semibold text-[#3b82f6]">Why this works:</span> {alternative.alt.rationale}
                        </p>
                      </div>
                    )}
                    
                    {alternative.alt.improvesOn && alternative.alt.improvesOn.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-gray-400">Improves:</span>
                        {alternative.alt.improvesOn.map((metric: string, idx: number) => (
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
              ))}
            </div>
          </div>
        )}

        {/* Get Complete Report Button */}
        <div className="text-center mt-8">
          <Button
            onClick={onGetCompleteReport}
            className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 min-h-[44px] text-base sm:text-lg"
            aria-label="Get complete strategic analysis report"
          >
            Get My Complete Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

AnalysisResults.displayName = 'AnalysisResults'
"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Share2, 
  FileText, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink,
  Calendar,
  BarChart3,
  Sparkles
} from "lucide-react"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
  recommendations?: Array<{
    category: string
    issue: string
    suggestion: string
  }>
}

interface ExportIntegrationProps {
  missionText: string
  scores: Scores
  selectedIndustry: string
  aiAnalysis?: AnalysisData
  onClose: () => void
}

// Industry labels mapping
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

function getScoreColor(score: number): string {
  if (score >= 90) return "#10b981" // green-500
  if (score >= 80) return "#3b82f6" // blue-500
  if (score >= 70) return "#f59e0b" // yellow-500
  if (score >= 60) return "#f97316" // orange-500
  return "#ef4444" // red-500
}

function getScoreCategory(score: number): string {
  if (score >= 90) return "Exceptional"
  if (score >= 80) return "Strong"
  if (score >= 70) return "Good"
  if (score >= 60) return "Needs Work"
  return "Poor"
}

export const ExportIntegration: React.FC<ExportIntegrationProps> = ({
  missionText,
  scores,
  selectedIndustry,
  aiAnalysis,
  onClose
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const industryLabel = industries.find(i => i.value === selectedIndustry)?.label || "Other"

  // Generate PDF Report
  const handleGeneratePDF = useCallback(async () => {
    setIsGeneratingPDF(true)
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      
      // Header
      pdf.setFontSize(24)
      pdf.setTextColor(59, 130, 246) // Blue color
      pdf.text('Mission Statement Analysis Report', margin, 30)
      
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 40)
      
      // Mission Statement
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Your Mission Statement:', margin, 60)
      
      pdf.setFontSize(12)
      pdf.setTextColor(60, 60, 60)
      const missionLines = pdf.splitTextToSize(`"${missionText}"`, contentWidth - 10)
      pdf.text(missionLines, margin + 5, 70)
      
      let yPosition = 70 + (missionLines.length * 7) + 20
      
      // Overall Score
      pdf.setFontSize(18)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Overall Performance', margin, yPosition)
      
      yPosition += 10
      pdf.setFontSize(36)
      pdf.setTextColor(...hexToRgb(getScoreColor(scores.overall)))
      pdf.text(`${scores.overall}/100`, margin, yPosition)
      
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`${getScoreCategory(scores.overall)} - ${industryLabel} Industry`, margin + 50, yPosition - 5)
      
      yPosition += 25
      
      // Metric Breakdown
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Detailed Metrics', margin, yPosition)
      
      yPosition += 15
      const metrics = [
        { name: 'Clarity', score: scores.clarity },
        { name: 'Specificity', score: scores.specificity },
        { name: 'Impact', score: scores.impact },
        { name: 'Authenticity', score: scores.authenticity },
        { name: 'Memorability', score: scores.memorability }
      ]
      
      metrics.forEach((metric, index) => {
        pdf.setFontSize(12)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`${metric.name}:`, margin, yPosition)
        
        pdf.setTextColor(...hexToRgb(getScoreColor(metric.score)))
        pdf.text(`${metric.score}/100`, margin + 50, yPosition)
        
        // Progress bar
        pdf.setDrawColor(200, 200, 200)
        pdf.rect(margin + 80, yPosition - 3, 80, 4)
        
        pdf.setFillColor(...hexToRgb(getScoreColor(metric.score)))
        pdf.rect(margin + 80, yPosition - 3, (metric.score / 100) * 80, 4, 'F')
        
        yPosition += 12
      })
      
      // AI Alternatives (if available)
      if (aiAnalysis?.alternatives) {
        yPosition += 10
        
        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          pdf.addPage()
          yPosition = 30
        }
        
        pdf.setFontSize(16)
        pdf.setTextColor(0, 0, 0)
        pdf.text('AI-Generated Alternatives', margin, yPosition)
        
        yPosition += 15
        
        const alternatives = [
          { title: 'Action-Focused', alt: aiAnalysis.alternatives.actionFocused },
          { title: 'Problem-Solution', alt: aiAnalysis.alternatives.problemSolution },
          { title: 'Vision-Driven', alt: aiAnalysis.alternatives.visionDriven }
        ]
        
        alternatives.forEach((alternative) => {
          if (yPosition > pageHeight - 60) {
            pdf.addPage()
            yPosition = 30
          }
          
          pdf.setFontSize(12)
          pdf.setTextColor(59, 130, 246)
          pdf.text(`${alternative.title}:`, margin, yPosition)
          
          yPosition += 8
          pdf.setTextColor(60, 60, 60)
          const altLines = pdf.splitTextToSize(`"${alternative.alt.text}"`, contentWidth - 10)
          pdf.text(altLines, margin + 5, yPosition)
          
          yPosition += (altLines.length * 5) + 15
        })
      }
      
      // Footer
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text('Generated by Mission Statement Analyzer - Professional Fortune 500 Standards', 
        margin, pageHeight - 10)
      
      // Save the PDF
      pdf.save(`mission-statement-analysis-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [missionText, scores, selectedIndustry, aiAnalysis, industryLabel])

  // Helper function to convert hex to RGB
  function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0]
  }

  // Generate Shareable Link
  const handleGenerateLink = useCallback(async () => {
    setIsGeneratingLink(true)
    
    try {
      // Create a shareable data object
      const shareData = {
        mission: missionText,
        scores,
        industry: selectedIndustry,
        alternatives: aiAnalysis?.alternatives,
        timestamp: Date.now()
      }
      
      // Encode the data
      const encodedData = btoa(JSON.stringify(shareData))
      const shareableUrl = `${window.location.origin}${window.location.pathname}?share=${encodedData}`
      
      setShareableLink(shareableUrl)
    } catch (error) {
      console.error('Error generating shareable link:', error)
      alert('Failed to generate shareable link. Please try again.')
    } finally {
      setIsGeneratingLink(false)
    }
  }, [missionText, scores, selectedIndustry, aiAnalysis])

  // Copy Link to Clipboard
  const handleCopyLink = useCallback(async () => {
    if (!shareableLink) return
    
    try {
      await navigator.clipboard.writeText(shareableLink)
      setIsLinkCopied(true)
      setTimeout(() => setIsLinkCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link. Please try again.')
    }
  }, [shareableLink])

  // Send Email Report
  const handleSendEmail = useCallback(async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }
    
    setIsSendingEmail(true)
    
    try {
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          missionText,
          scores,
          industry: selectedIndustry,
          aiAnalysis
        })
      })
      
      if (response.ok) {
        setIsEmailSent(true)
        setTimeout(() => setIsEmailSent(false), 3000)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email report. Please try again or download the PDF instead.')
    } finally {
      setIsSendingEmail(false)
    }
  }, [emailAddress, missionText, scores, selectedIndustry, aiAnalysis])

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 mt-8 shadow-2xl">
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            📤 Export & Share
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Save, share, and integrate your mission statement analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* PDF Export */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-400" />
                PDF Report
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Complete analysis with all metrics and scores
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI-generated alternatives and recommendations
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Professional formatting with date and branding
                  </div>
                </div>
                
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF Report
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shareable Link */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                <Share2 className="h-6 w-6 text-pink-400" />
                Shareable Link
              </h3>
              
              <div className="space-y-4">
                {!shareableLink ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Share analysis with team members or stakeholders
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Preserves all scores and AI insights
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleGenerateLink}
                      disabled={isGeneratingLink}
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white"
                    >
                      {isGeneratingLink ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Generate Shareable Link
                        </div>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                      <div className="text-xs text-gray-400 mb-1">Shareable Link:</div>
                      <div className="text-sm text-gray-300 break-all">
                        {shareableLink}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyLink}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white"
                      >
                        {isLinkCopied ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Copied!
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </div>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setShareableLink("")}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        New Link
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Report */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-400" />
                Email Report
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    Send a comprehensive analysis report directly to your inbox
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || !emailAddress}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {isSendingEmail ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : isEmailSent ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="h-4 w-4" />
                        Email Sent!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Email Report
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Options */}
          <Card className="bg-[#0a0e1a] border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
                <ExternalLink className="h-6 w-6 text-green-400" />
                Integration Ready
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      API
                    </Badge>
                    Use our analysis API in your applications
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Embed
                    </Badge>
                    Embed scoring widget on your website
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Webhook
                    </Badge>
                    Real-time notifications for new analyses
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open('/api-docs', '_blank')}
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View API Documentation
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#f8fafc] mb-4 text-center">
              📊 Analysis Summary
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{scores.overall}</div>
                <div className="text-xs text-gray-400">Overall Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{industryLabel}</div>
                <div className="text-xs text-gray-400">Industry</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {aiAnalysis?.alternatives ? 3 : 0}
                </div>
                <div className="text-xs text-gray-400">AI Alternatives</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Close Button */}
        <div className="text-center mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close Export Options
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, missionText, scores, industry, aiAnalysis } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 })
    }

    if (!missionText || !scores) {
      return NextResponse.json({ error: 'Mission text and scores are required' }, { status: 400 })
    }

    // Industry labels mapping
    const industries: Record<string, string> = {
      technology: "Technology",
      healthcare: "Healthcare", 
      finance: "Finance",
      retail: "Retail",
      manufacturing: "Manufacturing",
      education: "Education",
      nonprofit: "Non-Profit",
      hospitality: "Hospitality",
      energy: "Energy",
      transportation: "Transportation",
      media: "Media & Entertainment",
      agriculture: "Agriculture",
      realestate: "Real Estate",
      other: "Other"
    }

    const industryLabel = industries[industry] || "Other"

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

    // Generate HTML email content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mission Statement Analysis Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .mission-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .mission-text { font-size: 18px; font-style: italic; color: #1f2937; margin: 0; }
        .score-section { margin: 30px 0; }
        .overall-score { text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; margin: 20px 0; }
        .score-circle { display: inline-block; width: 120px; height: 120px; border-radius: 50%; position: relative; margin-bottom: 15px; }
        .score-number { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px; font-weight: bold; }
        .score-label { font-size: 18px; font-weight: 600; margin-bottom: 5px; }
        .score-sublabel { color: #6b7280; font-size: 14px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
        .metric-name { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
        .metric-score { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
        .metric-bar { width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
        .metric-progress { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
        .alternatives-section { margin: 30px 0; }
        .alternative-card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .alternative-title { color: #3b82f6; font-weight: 600; font-size: 16px; margin-bottom: 10px; }
        .alternative-text { font-size: 16px; color: #1f2937; margin-bottom: 10px; padding: 10px; background: #ffffff; border-radius: 6px; border-left: 3px solid #3b82f6; }
        .alternative-rationale { font-size: 14px; color: #6b7280; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .branding { color: #3b82f6; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>📊 Mission Statement Analysis</h1>
          <p>Professional Assessment Report - Generated ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Mission Statement -->
          <div class="mission-box">
            <p class="mission-text">"${missionText}"</p>
          </div>

          <!-- Overall Score -->
          <div class="overall-score">
            <div class="score-circle" style="background: conic-gradient(${getScoreColor(scores.overall)} ${scores.overall * 3.6}deg, #e5e7eb 0deg);">
              <div style="position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span class="score-number" style="color: ${getScoreColor(scores.overall)};">${scores.overall}</span>
              </div>
            </div>
            <div class="score-label" style="color: ${getScoreColor(scores.overall)};">${getScoreCategory(scores.overall)} Performance</div>
            <div class="score-sublabel">${industryLabel} Industry Analysis</div>
          </div>

          <!-- Detailed Metrics -->
          <div class="score-section">
            <h2 style="color: #1f2937; margin-bottom: 20px;">📈 Detailed Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-name">Clarity</div>
                <div class="metric-score" style="color: ${getScoreColor(scores.clarity)};">${scores.clarity}/100</div>
                <div class="metric-bar">
                  <div class="metric-progress" style="width: ${scores.clarity}%; background-color: ${getScoreColor(scores.clarity)};"></div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-name">Specificity</div>
                <div class="metric-score" style="color: ${getScoreColor(scores.specificity)};">${scores.specificity}/100</div>
                <div class="metric-bar">
                  <div class="metric-progress" style="width: ${scores.specificity}%; background-color: ${getScoreColor(scores.specificity)};"></div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-name">Impact</div>
                <div class="metric-score" style="color: ${getScoreColor(scores.impact)};">${scores.impact}/100</div>
                <div class="metric-bar">
                  <div class="metric-progress" style="width: ${scores.impact}%; background-color: ${getScoreColor(scores.impact)};"></div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-name">Authenticity</div>
                <div class="metric-score" style="color: ${getScoreColor(scores.authenticity)};">${scores.authenticity}/100</div>
                <div class="metric-bar">
                  <div class="metric-progress" style="width: ${scores.authenticity}%; background-color: ${getScoreColor(scores.authenticity)};"></div>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-name">Memorability</div>
                <div class="metric-score" style="color: ${getScoreColor(scores.memorability)};">${scores.memorability}/100</div>
                <div class="metric-bar">
                  <div class="metric-progress" style="width: ${scores.memorability}%; background-color: ${getScoreColor(scores.memorability)};"></div>
                </div>
              </div>
            </div>
          </div>

          ${aiAnalysis?.alternatives ? `
          <!-- AI Alternatives -->
          <div class="alternatives-section">
            <h2 style="color: #1f2937; margin-bottom: 20px;">✨ AI-Generated Alternatives</h2>
            
            <div class="alternative-card">
              <div class="alternative-title">⚡ Action-Focused Version</div>
              <div class="alternative-text">"${aiAnalysis.alternatives.actionFocused.text}"</div>
              ${aiAnalysis.alternatives.actionFocused.rationale ? `<div class="alternative-rationale"><strong>Why this works:</strong> ${aiAnalysis.alternatives.actionFocused.rationale}</div>` : ''}
            </div>

            <div class="alternative-card">
              <div class="alternative-title">🎯 Problem-Solution Version</div>
              <div class="alternative-text">"${aiAnalysis.alternatives.problemSolution.text}"</div>
              ${aiAnalysis.alternatives.problemSolution.rationale ? `<div class="alternative-rationale"><strong>Why this works:</strong> ${aiAnalysis.alternatives.problemSolution.rationale}</div>` : ''}
            </div>

            <div class="alternative-card">
              <div class="alternative-title">🚀 Vision-Driven Version</div>
              <div class="alternative-text">"${aiAnalysis.alternatives.visionDriven.text}"</div>
              ${aiAnalysis.alternatives.visionDriven.rationale ? `<div class="alternative-rationale"><strong>Why this works:</strong> ${aiAnalysis.alternatives.visionDriven.rationale}</div>` : ''}
            </div>
          </div>
          ` : ''}

          <!-- Next Steps -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">🎯 Recommended Next Steps</h3>
            <ul style="color: #1f2937; margin: 10px 0; padding-left: 20px;">
              <li>Review the detailed metrics to identify areas for improvement</li>
              <li>Consider testing the AI-generated alternatives with your team</li>
              <li>Use the highest-scoring version in your marketing materials</li>
              <li>Re-analyze after making changes to track improvement</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Generated by <span class="branding">Mission Statement Analyzer</span></p>
          <p>Professional Fortune 500 Standards • AI-Powered Analysis</p>
          <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
            This analysis was generated using advanced AI and proven scoring methodologies from Fortune 500 companies.
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Mission Statement Analyzer <noreply@resend.dev>',
      to: [email],
      subject: `Your Mission Statement Analysis Report - Score: ${scores.overall}/100`,
      html: htmlContent,
    })

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: emailResult.data?.id 
    })

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
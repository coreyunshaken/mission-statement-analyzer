import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplateData {
  firstName?: string
  company?: string
  missionText: string
  overallScore: number
  industry: string
  scores: {
    clarity: number
    specificity: number
    impact: number
    authenticity: number
    memorability: number
  }
  recommendations: Array<{
    category: string
    issue: string
    suggestion: string
  }>
  alternatives: {
    actionFocused: { text: string; rationale: string }
    problemSolution: { text: string; rationale: string }
    visionDriven: { text: string; rationale: string }
  }
}

export async function sendMissionAnalysisReport(email: string, data: EmailTemplateData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email service not configured - would send report to:', email)
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const htmlContent = generateReportHTML(data)
    
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Mission Analyzer <noreply@yourdomain.com>',
      to: email,
      subject: `Your Mission Statement Analysis Report (Score: ${data.overallScore}/100)`,
      html: htmlContent
    })

    return { success: true, message: 'Report sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: 'Failed to send email' }
  }
}

function generateReportHTML(data: EmailTemplateData): string {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981' // green
    if (score >= 80) return '#3b82f6' // blue
    if (score >= 70) return '#f59e0b' // yellow
    if (score >= 60) return '#f97316' // orange
    return '#ef4444' // red
  }

  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'Exceptional'
    if (score >= 80) return 'Strong'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Needs Work'
    return 'Poor'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mission Statement Analysis Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 30px; }
        .score-circle { width: 120px; height: 120px; border-radius: 50%; border: 8px solid; display: inline-flex; align-items: center; justify-content: center; margin: 20px auto; }
        .score-text { font-size: 32px; font-weight: bold; }
        .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .metric-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .metric-score { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .metric-name { color: #64748b; font-size: 14px; }
        .recommendations { background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .alternative { background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Mission Statement Analysis Report</h1>
          <p>Professional assessment using Fortune 500 standards</p>
        </div>
        
        <div class="content">
          ${data.firstName ? `<p>Hi ${data.firstName},</p>` : '<p>Hello,</p>'}
          
          <p>Thank you for using our Mission Statement Analyzer! Here's your comprehensive analysis report:</p>
          
          <div style="text-align: center;">
            <div class="score-circle" style="border-color: ${getScoreColor(data.overallScore)}; color: ${getScoreColor(data.overallScore)};">
              <span class="score-text">${data.overallScore}</span>
            </div>
            <h2 style="color: ${getScoreColor(data.overallScore)}; margin-top: 10px;">
              ${getScoreCategory(data.overallScore)} Performance
            </h2>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3>Your Mission Statement:</h3>
            <p style="font-style: italic; font-size: 16px; color: #1e293b;">
              "${data.missionText}"
            </p>
            <p style="color: #64748b; font-size: 14px;">
              Industry: ${data.industry} | Word Count: ${data.missionText.trim().split(/\\s+/).length}
            </p>
          </div>
          
          <h3>Detailed Scores</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-score" style="color: ${getScoreColor(data.scores.clarity)};">
                ${data.scores.clarity}/100
              </div>
              <div class="metric-name">Clarity</div>
            </div>
            <div class="metric-card">
              <div class="metric-score" style="color: ${getScoreColor(data.scores.specificity)};">
                ${data.scores.specificity}/100
              </div>
              <div class="metric-name">Specificity</div>
            </div>
            <div class="metric-card">
              <div class="metric-score" style="color: ${getScoreColor(data.scores.impact)};">
                ${data.scores.impact}/100
              </div>
              <div class="metric-name">Impact</div>
            </div>
            <div class="metric-card">
              <div class="metric-score" style="color: ${getScoreColor(data.scores.authenticity)};">
                ${data.scores.authenticity}/100
              </div>
              <div class="metric-name">Authenticity</div>
            </div>
          </div>
          
          <h3>💡 Key Recommendations</h3>
          <div class="recommendations">
            ${data.recommendations.map(rec => `
              <div style="margin-bottom: 15px;">
                <strong>${rec.category}:</strong> ${rec.issue}<br>
                <span style="color: #059669;">→ ${rec.suggestion}</span>
              </div>
            `).join('')}
          </div>
          
          <h3>✨ Alternative Versions</h3>
          
          <div class="alternative">
            <h4>⚡ Action-Focused Version</h4>
            <p style="font-style: italic; margin: 10px 0;">
              "${data.alternatives.actionFocused.text}"
            </p>
            <p style="font-size: 14px; color: #64748b;">
              ${data.alternatives.actionFocused.rationale}
            </p>
          </div>
          
          <div class="alternative">
            <h4>🎯 Problem-Solution Version</h4>
            <p style="font-style: italic; margin: 10px 0;">
              "${data.alternatives.problemSolution.text}"
            </p>
            <p style="font-size: 14px; color: #64748b;">
              ${data.alternatives.problemSolution.rationale}
            </p>
          </div>
          
          <div class="alternative">
            <h4>🚀 Vision-Driven Version</h4>
            <p style="font-style: italic; margin: 10px 0;">
              "${data.alternatives.visionDriven.text}"
            </p>
            <p style="font-size: 14px; color: #64748b;">
              ${data.alternatives.visionDriven.rationale}
            </p>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
            <h3>🎯 Next Steps</h3>
            <ul>
              <li>Review and consider the alternative versions above</li>
              <li>Test your chosen mission with team members and stakeholders</li>
              <li>Ensure it aligns with your company's actual activities</li>
              <li>Use it consistently across all communications</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <h3>Mission Statement Success Calculator</h3>
          <p>Professional-grade analysis powered by AI and Fortune 500 standards</p>
          <p style="font-size: 12px; color: #94a3b8;">
            This report was generated using advanced AI analysis. 
            Visit our analyzer again anytime to track your progress.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
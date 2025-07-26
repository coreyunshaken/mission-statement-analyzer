import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMissionAnalysisReport } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      firstName, 
      company, 
      missionText, 
      overallScore, 
      industry,
      scores,
      recommendations,
      alternatives
    } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Save or update email capture
    await prisma.emailCapture.upsert({
      where: { email },
      update: {
        firstName,
        company,
        missionText,
        overallScore,
        industry
      },
      create: {
        email,
        firstName,
        company,
        missionText,
        overallScore,
        industry
      }
    })

    // Send email report if we have the analysis data
    if (scores && recommendations && alternatives) {
      const emailResult = await sendMissionAnalysisReport(email, {
        firstName,
        company,
        missionText,
        overallScore,
        industry,
        scores,
        recommendations,
        alternatives
      })

      if (emailResult.success) {
        // Mark email as sent
        await prisma.emailCapture.update({
          where: { email },
          data: {
            reportSent: true,
            reportSentAt: new Date()
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: emailResult.success 
          ? 'Report sent to your email successfully!' 
          : 'Request saved, but email could not be sent at this time.',
        emailSent: emailResult.success
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Report request saved successfully',
      emailSent: false
    })
  } catch (error) {
    console.error('Error capturing email:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
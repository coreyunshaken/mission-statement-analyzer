import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get overall analytics
    const [
      totalAnalyses,
      avgScore,
      industryDistribution,
      scoreDistribution,
      recentTrends
    ] = await Promise.all([
      // Total analyses count
      prisma.analysis.count(),
      
      // Average overall score
      prisma.analysis.aggregate({
        _avg: {
          overallScore: true,
          clarityScore: true,
          specificityScore: true,
          impactScore: true,
          authenticityScore: true,
          memorabilityScore: true
        }
      }),
      
      // Industry distribution
      prisma.analysis.groupBy({
        by: ['industry'],
        _count: {
          industry: true
        },
        _avg: {
          overallScore: true
        },
        orderBy: {
          _count: {
            industry: 'desc'
          }
        }
      }),
      
      // Score distribution (ranges)
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN "overallScore" >= 90 THEN '90-100'
            WHEN "overallScore" >= 80 THEN '80-89'
            WHEN "overallScore" >= 70 THEN '70-79'
            WHEN "overallScore" >= 60 THEN '60-69'
            ELSE '0-59'
          END as score_range,
          COUNT(*) as count
        FROM "Analysis"
        GROUP BY score_range
        ORDER BY score_range DESC
      `,
      
      // Recent trends (last 30 days)
      prisma.analysis.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          overallScore: true,
          industry: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    // Calculate weekly trends
    const weeklyTrends = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
      
      const weekData = recentTrends.filter(analysis => 
        analysis.createdAt >= weekStart && analysis.createdAt < weekEnd
      )
      
      return {
        week: `Week ${4 - i}`,
        count: weekData.length,
        avgScore: weekData.length > 0 
          ? Math.round(weekData.reduce((sum, a) => sum + a.overallScore, 0) / weekData.length)
          : 0
      }
    }).reverse()

    const analytics = {
      overview: {
        totalAnalyses,
        averageScores: {
          overall: Math.round(avgScore._avg.overallScore || 0),
          clarity: Math.round(avgScore._avg.clarityScore || 0),
          specificity: Math.round(avgScore._avg.specificityScore || 0),
          impact: Math.round(avgScore._avg.impactScore || 0),
          authenticity: Math.round(avgScore._avg.authenticityScore || 0),
          memorability: Math.round(avgScore._avg.memorabilityScore || 0)
        }
      },
      industries: industryDistribution.map(item => ({
        industry: item.industry,
        count: item._count.industry,
        avgScore: Math.round(item._avg.overallScore || 0)
      })),
      scoreDistribution,
      trends: {
        weekly: weeklyTrends,
        topPerformingIndustries: industryDistribution
          .filter(item => (item._avg.overallScore || 0) >= 80)
          .slice(0, 5)
          .map(item => ({
            industry: item.industry,
            avgScore: Math.round(item._avg.overallScore || 0),
            count: item._count.industry
          }))
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
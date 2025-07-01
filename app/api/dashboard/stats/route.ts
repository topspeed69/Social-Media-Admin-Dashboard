import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get current counts
    const [userCount, postCount, commentCount, loginCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.login.count()
    ])

    // Get last month's counts
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [lastMonthUsers, lastMonthPosts, lastMonthComments, lastMonthLogins] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            lt: lastMonth
          }
        }
      }),
      prisma.post.count({
        where: {
          createdAt: {
            lt: lastMonth
          }
        }
      }),
      prisma.comment.count({
        where: {
          createdAt: {
            lt: lastMonth
          }
        }
      }),
      prisma.login.count({
        where: {
          loginTime: {
            lt: lastMonth
          }
        }
      })
    ])

    // Calculate trends
    const calculateTrend = (current: number, last: number) => {
      if (last === 0) return 0
      return Math.round(((current - last) / last) * 100)
    }

    // Return formatted data
    return NextResponse.json({
      users: {
        total: userCount,
        trend: calculateTrend(userCount, lastMonthUsers)
      },
      posts: {
        total: postCount,
        trend: calculateTrend(postCount, lastMonthPosts)
      },
      comments: {
        total: commentCount,
        trend: calculateTrend(commentCount, lastMonthComments)
      },
      logins: {
        total: loginCount,
        trend: calculateTrend(loginCount, lastMonthLogins)
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' }, 
      { status: 500 }
    )
  }
}
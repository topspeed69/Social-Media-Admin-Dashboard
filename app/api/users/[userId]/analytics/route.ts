import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface ChartDataPoint {
  name: string
  value: number
}

interface AnalyticsData {
  posts: ChartDataPoint[]
  engagement: ChartDataPoint[]
  followers: ChartDataPoint[]
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)
    const days = 7

    // Initialize data structure with empty arrays
    const data: AnalyticsData = {
      posts: [],
      engagement: [],
      followers: []
    }

    // Get dates for the last 7 days
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date
    }).reverse()

    // Collect data for each day
    for (const date of dates) {
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)
      nextDate.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)

      // Get posts count
      const postsCount = await prisma.post.count({
        where: {
          userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })

      // Get engagement (likes + comments)
      const [postLikes, commentLikes] = await Promise.all([
        prisma.postLike.count({
          where: {
            post: {
              userId,
              createdAt: {
                gte: date,
                lt: nextDate
              }
            }
          }
        }),
        prisma.commentLike.count({
          where: {
            comment: {
              userId,
              createdAt: {
                gte: date,
                lt: nextDate
              }
            }
          }
        })
      ])

      // Get new followers
      const newFollowers = await prisma.follow.count({
        where: {
          followeeId: userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })

      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      // Push data points to respective arrays
      data.posts.push({ name: dayStr, value: postsCount })
      data.engagement.push({ name: dayStr, value: postLikes + commentLikes })
      data.followers.push({ name: dayStr, value: newFollowers })
    }

    // Also get total counts
    const [totalPosts, totalFollowers] = await Promise.all([
      prisma.post.count({
        where: { userId }
      }),
      prisma.follow.count({
        where: { followeeId: userId }
      })
    ])

    return NextResponse.json({
      data,
      totals: {
        posts: totalPosts,
        followers: totalFollowers
      }
    })
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
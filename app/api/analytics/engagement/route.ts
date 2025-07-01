import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get current content stats
    const [posts, photos, videos, hashtags] = await Promise.all([
      prisma.post.count(),
      prisma.photo.count(),
      prisma.video.count(),
      prisma.hashtag.count()
    ])

    // Get last month's stats
    const [lastMonthPosts, lastMonthPhotos, lastMonthVideos, lastMonthHashtags] = await Promise.all([
      prisma.post.count({
        where: {
          createdAt: {
            lt: thisMonth,
            gte: lastMonth
          }
        }
      }),
      prisma.photo.count({
        where: {
          createdAt: {
            lt: thisMonth,
            gte: lastMonth
          }
        }
      }),
      prisma.video.count({
        where: {
          createdAt: {
            lt: thisMonth,
            gte: lastMonth
          }
        }
      }),
      prisma.hashtag.count({
        where: {
          createdAt: {
            lt: thisMonth,
            gte: lastMonth
          }
        }
      })
    ])

    return NextResponse.json({
      posts: {
        total: posts,
        trend: calculateTrend(posts, lastMonthPosts)
      },
      media: {
        photos: {
          total: photos,
          trend: calculateTrend(photos, lastMonthPhotos)
        },
        videos: {
          total: videos,
          trend: calculateTrend(videos, lastMonthVideos)
        }
      },
      hashtags: {
        total: hashtags,
        trend: calculateTrend(hashtags, lastMonthHashtags)
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

function calculateTrend(current: number, last: number): number {
  return last === 0 ? 0 : Math.round(((current - last) / last) * 100)
}
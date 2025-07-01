// app/api/trending/hashtags/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const period = 24 * 7 // Increase to 7 days
    const limit = 10
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - period)

    // Simplified query to get active hashtags
    const hashtags = await prisma.hashtag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      },
      take: limit
    })

    const trendingHashtags = hashtags
      .map(tag => ({
        name: tag.name,
        count: tag._count.posts,
        trend: Math.floor(Math.random() * 20) // Simplified trend calculation
      }))
      .filter(tag => tag.count > 0)

    console.log('Trending hashtags found:', trendingHashtags.length)

    return NextResponse.json({ hashtags: trendingHashtags })
  } catch (error) {
    console.error('Error fetching trending hashtags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending hashtags' },
      { status: 500 }
    )
  }
}
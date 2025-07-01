// app/api/trending/posts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const period = 24 * 7 // Increase to 7 days to get more data
    const limit = 10
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - period)

    // Simplified query to ensure we get data
    const posts = await prisma.post.findMany({
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            profilePhotoUrl: true
          }
        },
        likes: true,
        comments: true
      },
      orderBy: [
        {
          likes: {
            _count: 'desc'
          }
        },
        {
          comments: {
            _count: 'desc'
          }
        }
      ]
    })

    const trendingPosts = posts.map(post => ({
      id: post.id,
      content: post.caption || '',
      user: {
        username: post.user.username,
        profilePhotoUrl: post.user.profilePhotoUrl
      },
      engagement: post.likes.length + (post.comments.length * 2),
      timestamp: post.createdAt.toISOString()
    }))

    console.log('Trending posts found:', trendingPosts.length)

    return NextResponse.json({ posts: trendingPosts })
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending posts' },
      { status: 500 }
    )
  }
}
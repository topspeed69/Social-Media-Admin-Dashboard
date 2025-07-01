// app/api/trending/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'hashtags'

    if (type === 'hashtags') {
      // Get trending hashtags
      const hashtags = await prisma.hashtag.findMany({
        include: {
          posts: true
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      })

      const formattedHashtags = hashtags.map(tag => ({
        name: tag.name,
        count: tag.posts.length,
        trend: 0 // You can calculate trend based on time if needed
      }))

      return NextResponse.json({ hashtags: formattedHashtags })
    } else {
      // Get trending posts
      const posts = await prisma.post.findMany({
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
        orderBy: {
          likes: {
            _count: 'desc'
          }
        },
        take: 10
      })

      const formattedPosts = posts.map(post => ({
        id: post.id,
        content: post.caption || '',
        user: {
          username: post.user.username,
          profilePhotoUrl: post.user.profilePhotoUrl
        },
        engagement: post.likes.length + post.comments.length,
        timestamp: post.createdAt.toISOString()
      }))

      return NextResponse.json({ posts: formattedPosts })
    }
  } catch (error) {
    console.error('Error fetching trending:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    )
  }
}
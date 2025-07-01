// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showFlagged = searchParams.get('showFlagged') === 'true'

    console.log('Fetching posts with showFlagged:', showFlagged) // Debug log

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            profilePhotoUrl: true
          }
        },
        photo: {
          select: {
            photoUrl: true
          }
        },
        video: {
          select: {
            videoUrl: true
          }
        },
        likes: true,
        comments: true,
        flags: {
          where: {
            status: 'pending'
          }
        },
        tags: {
          include: {
            hashtag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found posts:', posts.length) // Debug log

    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.caption || '',
      photo: post.photo ? { photoUrl: post.photo.photoUrl } : null,
      video: post.video ? { videoUrl: post.video.videoUrl } : null,
      user: {
        username: post.user.username,
        profilePhotoUrl: post.user.profilePhotoUrl
      },
      likes: post.likes.length,
      comments: post.comments.length,
      hashtags: post.tags.map(tag => tag.hashtag.name),
      createdAt: post.createdAt.toISOString(),
      flags: post.flags.length > 0 ? {
        count: post.flags.length,
        status: 'pending'
      } : undefined
    }))

    console.log('Formatted posts:', formattedPosts.length) // Debug log

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
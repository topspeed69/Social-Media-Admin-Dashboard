// app/api/moderation/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const flaggedPosts = await prisma.postFlag.findMany({
      where: {
        status: 'pending'
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                username: true
              }
            },
            photo: true,
            video: true
          }
        },
        reporter: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedContent = flaggedPosts.map(flag => ({
      id: `POST#${flag.postId}`,
      type: flag.post.photo ? 'Photo' : flag.post.video ? 'Video' : 'Post',
      content: flag.post.caption || '',
      author: flag.post.user.username,
      reason: flag.reason,
      reportCount: 1,
      timestamp: flag.createdAt.toISOString(),
      status: flag.status,
      reporter: flag.reporter.username,
      postId: flag.postId
    }))

    return NextResponse.json({ flaggedContent: formattedContent })
  } catch (error) {
    console.error('Error fetching flagged content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flagged content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { postId, reason, reporterId } = await request.json()

    const flag = await prisma.postFlag.create({
      data: {
        postId: parseInt(postId),
        reportedBy: parseInt(reporterId),
        reason,
        status: 'pending'
      }
    })

    return NextResponse.json(flag)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to flag content' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    if (type === 'login') {
      const logs = await prisma.login.findMany({
        take: limit,
        orderBy: {
          loginTime: 'desc'
        },
        include: {
          user: {
            select: {
              username: true
            }
          }
        }
      })

      return NextResponse.json(
        logs.map(log => ({
          id: log.id,
          username: log.user.username,
          type: 'login',
          action: 'User Login',
          details: `IP: ${log.ip}`,
          createdAt: log.loginTime
        }))
      )
    }

    // For all activity logs
    const [posts, comments, follows] = await Promise.all([
      prisma.post.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true } }
        }
      }),
      prisma.comment.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true } }
        }
      }),
      prisma.follow.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: { select: { username: true } },
          followee: { select: { username: true } }
        }
      })
    ])

    const allLogs = [
      ...posts.map(post => ({
        id: `post-${post.id}`,
        username: post.user.username,
        type: 'post',
        action: 'Created Post',
        details: post.caption || 'No caption',
        createdAt: post.createdAt
      })),
      ...comments.map(comment => ({
        id: `comment-${comment.id}`,
        username: comment.user.username,
        type: 'comment',
        action: 'Added Comment',
        details: comment.text,
        createdAt: comment.createdAt
      })),
      ...follows.map(follow => ({
        id: `follow-${follow.followerId}-${follow.followeeId}`,
        username: follow.follower.username,
        type: 'follow',
        action: 'Followed User',
        details: `Followed ${follow.followee.username}`,
        createdAt: follow.createdAt
      }))
    ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)

    return NextResponse.json(allLogs)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
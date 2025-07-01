// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    console.log('Fetching users with params:', { username })

    if (username) {
      console.log('Searching for specific user:', username)
      const user = await prisma.user.findFirst({
        where: {
          username: {
            contains: username
          }
        },
        include: {
          posts: {
            include: {
              photo: true,
              video: true,
              likes: true,
              comments: true,
            }
          },
          comments: {
            include: {
              likes: true,
              post: true
            }
          },
          following: {
            include: {
              followee: {
                select: {
                  id: true,
                  username: true,
                  profilePhotoUrl: true
                }
              }
            }
          },
          followers: {
            include: {
              follower: {
                select: {
                  id: true,
                  username: true,
                  profilePhotoUrl: true
                }
              }
            }
          }
        }
      })

      console.log('User found:', user ? 'Yes' : 'No')

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        )
      }

      // Format the response
      const formattedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePhotoUrl: user.profilePhotoUrl,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
        posts: user.posts.map(post => ({
          id: post.id,
          content: post.caption || '',
          photo: post.photo,
          video: post.video,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt.toISOString()
        })),
        comments: user.comments.map(comment => ({
          id: comment.id,
          postId: comment.postId,
          text: comment.text,
          likes: comment.likes,
          createdAt: comment.createdAt.toISOString()
        })),
        following: user.following.map(follow => ({
          id: follow.followee.id,
          username: follow.followee.username,
          profilePhotoUrl: follow.followee.profilePhotoUrl,
          followedAt: follow.createdAt.toISOString()
        })),
        followers: user.followers.map(follow => ({
          id: follow.follower.id,
          username: follow.follower.username,
          profilePhotoUrl: follow.follower.profilePhotoUrl,
          followedAt: follow.createdAt.toISOString()
        }))
      }

      return NextResponse.json(formattedUser)
    }

    // User growth analytics for the last 7 days
    const days = 7
    const data = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })
      data.unshift({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: count
      })
    }
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
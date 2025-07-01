// app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (username) {
      const users = await prisma.user.findFirst({
        where: {
          username: {
            contains: username
          }
        },
        select: {
          id: true,
          username: true,
          email: true,
          profilePhotoUrl: true,
          bio: true,
          createdAt: true
        }
      });

      return NextResponse.json(users)
    }

    const userId = parseInt(request.url.split('/').pop() || '')
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            photo: true,
            video: true,
            likes: true,
            comments: {
              include: {
                user: true,
                likes: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        comments: {
          include: {
            post: true,
            likes: true
          },
          orderBy: {
            createdAt: 'desc'
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePhotoUrl: user.profilePhotoUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
      posts: user.posts.map(post => ({
        id: post.id,
        content: post.caption,
        photo: post.photo ? { photoUrl: post.photo.photoUrl } : null,
        video: post.video ? { videoUrl: post.video.videoUrl } : null,
        likes: post.likes,
        comments: post.comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          userId: comment.userId,
          username: comment.user.username,
          likes: comment.likes,
          createdAt: comment.createdAt.toISOString()
        })),
        createdAt: post.createdAt.toISOString()
      })),
      comments: user.comments.map(comment => ({
        id: comment.id,
        postId: comment.postId,
        text: comment.text,
        likes: comment.likes,
        createdAt: comment.createdAt.toISOString(),
        post: comment.post ? {
          id: comment.post.id,
          caption: comment.post.caption
        } : null
      })),
      following: user.following.map(f => ({
        id: f.followee.id,
        username: f.followee.username,
        profilePhotoUrl: f.followee.profilePhotoUrl,
        followedAt: f.createdAt.toISOString()
      })),
      followers: user.followers.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        profilePhotoUrl: f.follower.profilePhotoUrl,
        followedAt: f.createdAt.toISOString()
      }))
    }

    return NextResponse.json(formattedUser)

  } catch (error) {
    console.error('Error in user route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
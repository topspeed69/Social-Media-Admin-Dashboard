// app/api/users/[userId]/follows/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)

    // Get following data
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        followee: {
          select: {
            id: true,
            username: true,
            profilePhotoUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get followers data
    const followers = await prisma.follow.findMany({
      where: { followeeId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePhotoUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the data
    const formattedData = {
      following: following.map(f => ({
        id: f.followee.id,
        username: f.followee.username,
        profilePhotoUrl: f.followee.profilePhotoUrl,
        followedAt: f.createdAt.toISOString()
      })),
      followers: followers.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        profilePhotoUrl: f.follower.profilePhotoUrl,
        followedAt: f.createdAt.toISOString()
      }))
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching follows data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follows data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
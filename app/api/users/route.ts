import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    // If username is provided, handle search case
    if (username) {
      const user = await prisma.user.findFirst({
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
          createdAt: true
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    }

    // For moderator dialog, return list of users who aren't already moderators
    const users = await prisma.user.findMany({
      where: {
        moderator: null
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePhotoUrl: true
      },
      orderBy: {
        username: 'asc'
      }
    })

    console.log('Found users:', users.length)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
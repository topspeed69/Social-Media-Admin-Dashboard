// app/api/moderators/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

// Define types for our requests
type ModeratorRequest = {
  userId: number;
  role: 'admin' | 'moderator';
  permissions: string[];
}

type ModeratorUpdateRequest = {
  id: number;
  role: 'admin' | 'moderator';
  permissions: string[];
}

export async function GET() {
  try {
    const moderators = await prisma.moderator.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(
      moderators.map(mod => ({
        id: mod.id,
        userId: mod.userId,
        username: mod.user.username,
        email: mod.user.email,
        role: mod.role,
        permissions: mod.permissions,
        createdAt: mod.createdAt.toISOString()
      }))
    )
  } catch (error) {
    console.error('Error fetching moderators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moderators' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Creating moderator with data:', body)

    const moderator = await prisma.moderator.create({
      data: {
        userId: body.userId,
        role: body.role,
        permissions: body.permissions
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      id: moderator.id,
      userId: moderator.userId,
      username: moderator.user.username,
      email: moderator.user.email,
      role: moderator.role,
      permissions: moderator.permissions,
      createdAt: moderator.createdAt.toISOString()
    })
  } catch (error) {
    console.error('Error creating moderator:', error)
    return NextResponse.json(
      { error: 'Failed to create moderator' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, role, permissions }: ModeratorUpdateRequest = await request.json()

    const updatedModerator = await prisma.moderator.update({
      where: {
        id
      },
      data: {
        role,
        permissions: permissions as Prisma.InputJsonValue
      },
      select: {
        id: true,
        userId: true,
        role: true,
        permissions: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      id: updatedModerator.id,
      userId: updatedModerator.userId,
      username: updatedModerator.user.username,
      email: updatedModerator.user.email,
      role: updatedModerator.role,
      permissions: updatedModerator.permissions as string[],
      createdAt: updatedModerator.createdAt.toISOString()
    })
  } catch (error) {
    console.error('Error updating moderator:', error)
    return NextResponse.json(
      { error: 'Failed to update moderator' },
      { status: 500 }
    )
  }
}
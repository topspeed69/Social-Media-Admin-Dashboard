// /api/moderators/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { role, permissions } = body

    const moderator = await prisma.moderator.update({
      where: { id },
      data: {
        role,
        permissions,
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
    console.error('Error updating moderator:', error)
    return NextResponse.json(
      { error: 'Failed to update moderator' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.moderator.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting moderator:', error)
    return NextResponse.json(
      { error: 'Failed to delete moderator' },
      { status: 500 }
    )
  }
}
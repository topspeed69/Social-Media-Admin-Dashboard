import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    const { status, resolverId } = await request.json()

    // Find pending flags for this post
    const existingFlags = await prisma.postFlag.findMany({
      where: {
        postId: postId,
        status: 'pending'
      }
    })

    if (existingFlags.length === 0) {
      return NextResponse.json(
        { error: 'No pending flags found for this post' },
        { status: 404 }
      )
    }

    // Update all pending flags
    const result = await prisma.postFlag.updateMany({
      where: {
        postId: postId,
        status: 'pending'
      },
      data: {
        status: status,
        resolvedAt: new Date(),
        resolvedBy: resolverId
      }
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'No flags were updated' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      updatedCount: result.count 
    })

  } catch (error) {
    console.error('Server error updating flag:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update flag status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
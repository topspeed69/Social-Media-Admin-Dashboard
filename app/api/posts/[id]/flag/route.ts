// app/api/posts/[id]/flag/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const { reason, reporterId } = await request.json()

    // Create flag
    await prisma.postFlag.create({
      data: {
        postId,
        reportedBy: reporterId,
        reason,
        status: 'pending'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error flagging post:', error)
    return NextResponse.json(
      { error: 'Failed to flag post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);

    await prisma.$transaction([
      // Delete post likes
      prisma.postLike.deleteMany({ where: { postId } }),
    
      // Delete post tags
      prisma.postTag.deleteMany({ where: { postId } }),
    
      // Delete comment likes associated with comments of the post
      prisma.commentLike.deleteMany({
        where: {
          comment: {
            postId,
          },
        },
      }),
    
      // Delete comments associated with the post
      prisma.comment.deleteMany({ where: { postId } }),
    
      // Delete post flags associated with the post
      prisma.postFlag.deleteMany({ where: { postId } }),
    
      // Delete the post itself (cascades to Video and Photo)
      prisma.post.delete({ where: { id: postId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
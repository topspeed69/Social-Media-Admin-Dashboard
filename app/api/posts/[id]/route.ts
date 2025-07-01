// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('DELETE request received for post:', params.id);
  try {
    const postId = parseInt(params.id);
    
    // First check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      console.log('Post not found:', postId);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete related records
    await prisma.$transaction([
      prisma.postLike.deleteMany({ where: { postId } }),
      prisma.commentLike.deleteMany({
        where: { comment: { postId } }
      }),
      prisma.comment.deleteMany({ where: { postId } }),
      prisma.postFlag.deleteMany({ where: { postId } }),
      prisma.postTag.deleteMany({ where: { postId } }),
      prisma.post.delete({ where: { id: postId } })
    ]);

    console.log('Post deleted successfully:', postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
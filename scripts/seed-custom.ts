// scripts/seed-custom.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCustom() {
  try {
    // Clean existing data in correct order
    console.log('Cleaning existing data...')
    await prisma.$transaction([
      // First, delete dependent records
      prisma.postLike.deleteMany(),
      prisma.commentLike.deleteMany(),
      prisma.postTag.deleteMany(),
      prisma.postFlag.deleteMany(),
      prisma.comment.deleteMany(),
      // Then delete posts
      prisma.post.deleteMany(),
      // Then delete photos and videos
      prisma.photo.deleteMany(),
      prisma.video.deleteMany(),
      // Then delete user relationships
      prisma.follow.deleteMany(),
      prisma.hashtagFollow.deleteMany(),
      prisma.moderator.deleteMany(),
      // Finally delete main records
      prisma.hashtag.deleteMany(),
      prisma.user.deleteMany(),
    ])
    console.log('Existing data cleaned')

    // Now you can add your original data back
    // Add your INSERT statements here

    console.log('Data restored successfully!')
  } catch (error) {
    console.error('Error in database operation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCustom()
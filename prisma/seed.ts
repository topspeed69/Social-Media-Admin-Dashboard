// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Upsert users
    const user1 = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        bio: 'System Administrator'
      }
    })

    const user2 = await prisma.user.upsert({
      where: { username: 'moderator' },
      update: {},
      create: {
        username: 'moderator',
        email: 'mod@example.com',
        bio: 'Content Moderator'
      }
    })

    const user3 = await prisma.user.upsert({
      where: { username: 'user1' },
      update: {},
      create: {
        username: 'user1',
        email: 'user1@example.com',
        bio: 'Regular User'
      }
    })

    // Upsert moderator
    await prisma.moderator.upsert({
      where: { userId: user2.id },
      update: {},
      create: {
        userId: user2.id,
        role: 'moderator',
        permissions: ['delete_posts', 'ban_users']
      }
    })

    // Upsert posts
    const post1 = await prisma.post.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: user3.id,
        caption: 'First test post #trending',
      }
    })

    const post2 = await prisma.post.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: user3.id,
        caption: 'Second test post #viral',
      }
    })

    // Upsert hashtags
    const hashtag1 = await prisma.hashtag.upsert({
      where: { name: 'trending' },
      update: {},
      create: {
        name: 'trending'
      }
    })

    const hashtag2 = await prisma.hashtag.upsert({
      where: { name: 'viral' },
      update: {},
      create: {
        name: 'viral'
      }
    })

    // Upsert post tags
    await prisma.postTag.upsert({
      where: { postId_hashtagId: { postId: post1.id, hashtagId: hashtag1.id } },
      update: {},
      create: {
        postId: post1.id,
        hashtagId: hashtag1.id
      }
    })

    await prisma.postTag.upsert({
      where: { postId_hashtagId: { postId: post2.id, hashtagId: hashtag2.id } },
      update: {},
      create: {
        postId: post2.id,
        hashtagId: hashtag2.id
      }
    })

    // Upsert post flag
    await prisma.postFlag.upsert({
      where: { id: 1 },
      update: {},
      create: {
        postId: post1.id,
        reportedBy: user2.id,
        reason: 'Test flag',
        status: 'pending'
      }
    })

    console.log('Database has been seeded (without wiping existing data)!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
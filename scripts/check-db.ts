// scripts/check-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('\n--- Database Content Check ---\n')

    // Check Users
    const users = await prisma.user.findMany()
    console.log('Users:', users)

    // Check Moderators
    const moderators = await prisma.moderator.findMany({
      include: {
        user: true
      }
    })
    console.log('\nModerators:', moderators)

    // Check Posts
    const posts = await prisma.post.findMany({
      include: {
        user: true
      }
    })
    console.log('\nPosts:', posts)

    // Check Flags
    const flags = await prisma.postFlag.findMany({
      include: {
        post: true,
        reporter: true
      }
    })
    console.log('\nFlags:', flags)

  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
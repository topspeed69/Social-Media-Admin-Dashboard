// scripts/debug-user.ts
import { prisma } from '../lib/db'

async function debugDatabase() {
  try {
    // 1. First get all users
    console.log('Fetching all users...')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true
      },
      take: 10 // Limit to 10 users for cleaner output
    })

    console.log('\nAvailable users:', JSON.stringify(users, null, 2))

    if (users.length === 0) {
      console.log('\nNo users found in database! Please check if database is properly seeded.')
      return
    }

    // 2. Get detailed data for the first user
    const firstUser = users[0]
    console.log(`\nFetching detailed data for user: ${firstUser.username}`)

    const userDetails = await prisma.user.findUnique({
      where: { username: firstUser.username },
      include: {
        posts: {
          include: {
            photo: true,
            video: true,
            likes: true,
            comments: true,
          },
        },
        comments: {
          include: {
            post: true,
            likes: true,
          },
        },
        following: true,
        followers: true,
      },
    })

    console.log('\nUser details:', JSON.stringify(userDetails, null, 2))

    // 3. Print summary
    console.log('\nSummary:')
    if (userDetails) {
      console.log(`Posts count: ${userDetails.posts.length}`)
      console.log(`Comments count: ${userDetails.comments.length}`)
      console.log(`Following count: ${userDetails.following.length}`)
      console.log(`Followers count: ${userDetails.followers.length}`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDatabase()
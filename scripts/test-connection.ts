// scripts/test-connection.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // Test the connection
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('Database connection successful!')
    console.log('Test query result:', result)
    
    // Count users
    const userCount = await prisma.user.count()
    console.log('Number of users:', userCount)
    
    // Get all users
    const users = await prisma.user.findMany()
    console.log('Users:', users)
    
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const logs = await prisma.login.findMany({
      take: 50,
      orderBy: {
        loginTime: 'desc'
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    })

    const formattedLogs = logs.map(log => ({
      id: log.id,
      userId: log.userId,
      username: log.user.username,  // Changed from moderator to username
      ip: log.ip,
      loginTime: log.loginTime.toISOString()  // Ensure proper date formatting
    }))

    return NextResponse.json(formattedLogs)
  } catch (error) {
    console.error('Error fetching login logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
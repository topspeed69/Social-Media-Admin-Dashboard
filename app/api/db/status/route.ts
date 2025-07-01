import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getMysqlMetrics } from '@/lib/mysql-metrics'

export async function GET() {
  const start = Date.now()
  try {
    // Ping DB and get row counts
    const [userCount, postCount, commentCount, loginCount, metrics] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.login.count(),
      getMysqlMetrics(),
    ])
    const duration = Date.now() - start
    return NextResponse.json({
      status: 'ok',
      userCount,
      postCount,
      commentCount,
      loginCount,
      queryTimeMs: duration,
      timestamp: new Date().toISOString(),
      ...metrics,
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

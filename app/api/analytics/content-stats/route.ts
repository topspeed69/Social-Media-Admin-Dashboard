import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const days = 7
    const data = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      const [likes, comments] = await Promise.all([
        prisma.postLike.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.comment.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        })
      ])

      data.unshift({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: likes + comments
      })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
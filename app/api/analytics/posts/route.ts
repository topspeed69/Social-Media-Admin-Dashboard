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

      const [posts, photos, videos] = await Promise.all([
        prisma.post.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.photo.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.video.count({
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
        total: posts,
        photos,
        videos
      })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching post analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post analytics' }, 
      { status: 500 }
    )
  }
}
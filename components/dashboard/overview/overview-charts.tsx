'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  value: number
}

interface ChartProps {
  data: ChartData[]
  title: string
  color: string
}

function ChartCard({ data, title, color }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function OverviewCharts() {
  const [userGrowth, setUserGrowth] = useState<ChartData[]>([])
  const [postActivity, setPostActivity] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const [userResponse, postResponse] = await Promise.all([
          fetch('/api/analytics/users'),
          fetch('/api/analytics/posts')
        ])
        
        const userData = await userResponse.json()
        const postData = await postResponse.json()
        
        setUserGrowth(userData.data)
        setPostActivity(postData.data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-[300px] animate-pulse bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartCard 
        data={userGrowth} 
        title="User Growth" 
        color="#8884d8" 
      />
      <ChartCard 
        data={postActivity} 
        title="Post Activity" 
        color="#82ca9d" 
      />
    </div>
  )
}
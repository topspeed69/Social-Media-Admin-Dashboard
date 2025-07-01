'use client'

import { useEffect, useState, useRef } from 'react'
import { Users, FileText, MessageSquare, Shield, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsData {
  users: {
    total: number
    trend: number
  }
  posts: {
    total: number
    trend: number
  }
  comments: {
    total: number
    trend: number
  }
  logins: {
    total: number
    trend: number
  }
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<any | null>(null)
  const dbStatusInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stats')
        }
        
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setIsLoading(false)
      }
    }
    async function fetchDbStatus() {
      try {
        const response = await fetch('/api/db/status')
        const data = await response.json()
        setDbStatus(data)
      } catch (err) {
        setDbStatus({ status: 'error', error: 'Failed to fetch DB status' })
      }
    }
    fetchStats()
    fetchDbStatus()
    dbStatusInterval.current = setInterval(fetchDbStatus, 10000)
    return () => {
      if (dbStatusInterval.current) clearInterval(dbStatusInterval.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        Error: {error}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No stats available
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.users.trend}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.posts.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.posts.trend}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.comments.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.comments.trend}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.logins.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.logins.trend}% increase
          </p>
        </CardContent>
      </Card>

      {/* DB Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">DB Status</CardTitle>
        </CardHeader>
        <CardContent>
          {dbStatus ? (
            dbStatus.status === 'ok' ? (
              <>
                <div className="text-green-600 font-bold">Connected</div>
                <div className="text-xs mt-2">Users: {dbStatus.userCount}</div>
                <div className="text-xs">Posts: {dbStatus.postCount}</div>
                <div className="text-xs">Comments: {dbStatus.commentCount}</div>
                <div className="text-xs">Logins: {dbStatus.loginCount}</div>
                <div className="text-xs mt-2">Query: {dbStatus.queryTimeMs} ms</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(dbStatus.timestamp).toLocaleTimeString()}</div>
              </>
            ) : (
              <div className="text-red-600 font-bold">Error: {dbStatus.error}</div>
            )
          ) : (
            <div className="text-gray-400">Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
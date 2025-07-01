"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DbStatusSection() {
  const [dbStatus, setDbStatus] = useState<any | null>(null)
  const dbStatusInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function fetchDbStatus() {
      try {
        const response = await fetch('/api/db/status')
        const data = await response.json()
        setDbStatus(data)
      } catch (err) {
        setDbStatus({ status: 'error', error: 'Failed to fetch DB status' })
      }
    }
    fetchDbStatus()
    dbStatusInterval.current = setInterval(fetchDbStatus, 10000)
    return () => {
      if (dbStatusInterval.current) clearInterval(dbStatusInterval.current)
    }
  }, [])

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">Database Status & Performance</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus ? (
              dbStatus.status === 'ok' ? (
                <div className="text-green-600 font-bold">Connected</div>
              ) : (
                <div className="text-red-600 font-bold">Error: {dbStatus.error}</div>
              )
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Row Counts</CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus && dbStatus.status === 'ok' ? (
              <>
                <div className="text-xs">Users: {dbStatus.userCount}</div>
                <div className="text-xs">Posts: {dbStatus.postCount}</div>
                <div className="text-xs">Comments: {dbStatus.commentCount}</div>
                <div className="text-xs">Logins: {dbStatus.loginCount}</div>
              </>
            ) : (
              <div className="text-gray-400">-</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Query Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus && dbStatus.status === 'ok' ? (
              <>
                <div className="text-xs">Query Time: {dbStatus.queryTimeMs} ms</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(dbStatus.timestamp).toLocaleTimeString()}</div>
              </>
            ) : (
              <div className="text-gray-400">-</div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

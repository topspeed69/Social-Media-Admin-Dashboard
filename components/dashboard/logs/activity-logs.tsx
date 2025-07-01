'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ActivityLog {
  id: number
  type: 'post' | 'comment' | 'like' | 'follow'
  username: string
  action: string
  details: string
  createdAt: string
}

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivityLogs() {
      try {
        const response = await fetch('/api/logs')
        const data = await response.json()
        setLogs(data)
      } catch (error) {
        console.error('Error fetching activity logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityLogs()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 animate-pulse bg-gray-200 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.username}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LoginLog {
  id: number
  userId: number
  username: string
  ip: string
  loginTime: string
}

export function LoginLogs() {
  const [logs, setLogs] = useState<LoginLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/logs/login')
        if (!response.ok) {
          throw new Error('Failed to fetch logs')
        }
        const data = await response.json()
        setLogs(data)
      } catch (error) {
        console.error('Error fetching logs:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch logs')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 animate-pulse bg-gray-200 rounded" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Login Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.username}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>
                  {new Date(log.loginTime).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'medium'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
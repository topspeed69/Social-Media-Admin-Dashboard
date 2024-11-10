import { Users, FileText, MessageSquare, Shield, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockData } from '@/lib/mock-data'

export function StatsCards() {
  const { stats } = mockData

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.trends.users}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.trends.posts}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalComments}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.trends.comments}% increase
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Moderations</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalModerations}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            {stats.trends.moderations}% increase
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

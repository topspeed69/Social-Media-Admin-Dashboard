'use client'

import { useEffect, useState } from 'react'
import { Hash, TrendingUp, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface TrendingHashtag {
  name: string
  count: number
  trend: number
}

interface TrendingPost {
  id: number
  content: string
  user: {
    username: string
    profilePhotoUrl: string | null
  }
  engagement: number
  timestamp: string
}

export function TrendingSection() {
  const [view, setView] = useState<'hashtags' | 'posts'>('hashtags')
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([])
  const [posts, setPosts] = useState<TrendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTrendingData()
  }, [view])

  const fetchTrendingData = async () => {
    setLoading(true)
    try {
      const endpoint = view === 'hashtags' ? '/api/trending/hashtags' : '/api/trending/posts'
      console.log('Fetching from:', endpoint)
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      console.log('Received data:', data) // Add this log
      
      if (view === 'hashtags') {
        setHashtags(data.hashtags || [])
        console.log('Set hashtags:', data.hashtags?.length)
      } else {
        setPosts(data.posts || [])
        console.log('Set posts:', data.posts?.length)
      }
    } catch (error) {
      console.error(`Error fetching trending ${view}:`, error)
      toast({
        title: "Error",
        description: `Failed to fetch trending ${view}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Trending</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={view === 'hashtags' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('hashtags')}
              >
                <Hash className="h-4 w-4 mr-2" />
                Hashtags
              </Button>
              <Button
                variant={view === 'posts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('posts')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Posts
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
 
  const showEmptyState = view === 'hashtags' ? !hashtags.length : !posts.length

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Trending</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'hashtags' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('hashtags')}
            >
              <Hash className="h-4 w-4 mr-2" />
              Hashtags
            </Button>
            <Button
              variant={view === 'posts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('posts')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Posts
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showEmptyState ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No trending {view} found</p>
            <p className="text-sm mt-1">Check back later for updates</p>
          </div>
        ) : view === 'hashtags' ? (
          <div className="space-y-4">
            {hashtags.map((tag) => (
              <div 
                key={tag.name}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{tag.count} posts</Badge>
                  <span 
                    className={tag.trend > 0 ? 'text-green-500' : 'text-red-500'}
                  >
                    {tag.trend > 0 ? '+' : ''}{tag.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">@{post.user.username}</span>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    <BarChart2 className="h-3 w-3 mr-1" />
                    {post.engagement}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
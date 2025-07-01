// components/dashboard/moderation/flagged-content.tsx
'use client'

import { useState, useEffect } from 'react'
import { Flag } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContentReview } from './content-review'
import { useToast } from "@/components/ui/use-toast"

interface FlaggedContent {
  id: string
  type: string
  content: string
  author: string
  reason: string
  reportCount: number
  timestamp: string
  status: string
  reporter: string
  postId: number
}

export function FlaggedContent() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFlaggedContent()
  }, [])

  const fetchFlaggedContent = async () => {
    try {
      const response = await fetch('/api/moderation')
      if (!response.ok) throw new Error('Failed to fetch content')
      const data = await response.json()
      console.log('Fetched content:', data) // Debug log
      setFlaggedContent(data.flaggedContent)
    } catch (error) {
      console.error('Error fetching flagged content:', error)
      toast({
        title: "Error",
        description: "Failed to fetch flagged content",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFlag = async (status: 'dismissed' | 'resolved') => {
    if (!selectedContent) {
      console.error('No content selected')
      return
    }
  
    try {
      const postId = selectedContent.postId
      const response = await fetch(`/api/moderation/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          resolverId: 1
        }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update flag status')
      }
  
      // Only update state if the request was successful
      setFlaggedContent(prev => 
        prev.filter(content => content.id !== selectedContent.id)
      )
      setSelectedContent(null)
  
      toast({
        title: "Success",
        description: `Content has been ${status}`
      })
    } catch (error) {
      console.error('Update flag error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update flag status",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-32 animate-pulse bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {flaggedContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No flagged content to review
              </div>
            ) : (
              flaggedContent.map((content) => (
                <div
                  key={content.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors
                    ${selectedContent?.id === content.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  onClick={() => setSelectedContent(content)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-destructive" />
                      <span className="font-medium">{content.id}</span>
                    </div>
                    <Badge variant="outline">{content.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {content.content}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>By: {content.author}</span>
                    <span>Reporter: {content.reporter}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{new Date(content.timestamp).toLocaleString()}</span>
                    <span>{content.reportCount} reports</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ContentReview 
        selectedContent={selectedContent}
        onDismiss={() => handleUpdateFlag('dismissed')}
        onRemove={() => handleUpdateFlag('resolved')}
      />
    </div>
  )
}
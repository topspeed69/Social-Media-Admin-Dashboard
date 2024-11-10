'use client'

import { useState } from 'react'
import { Search, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContentReview } from './content-review'
import { mockData } from '@/lib/mock-data'

export function FlaggedContent() {
  const [searchId, setSearchId] = useState('')
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const { flaggedContent } = mockData.moderation

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Flagged Content</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search by ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-[200px]"
              />
              <Button size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flaggedContent.map((content) => (
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
                <p className="text-sm text-muted-foreground mb-2">{content.content}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{content.timestamp}</span>
                  <span>{content.reportCount} reports</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ContentReview selectedContent={selectedContent} />
    </div>
  )
}

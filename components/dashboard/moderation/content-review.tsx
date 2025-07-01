// components/dashboard/moderation/content-review.tsx
'use client'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast" // Assuming you have a toast component for notifications

interface ContentReviewProps {
  selectedContent: any
  onDismiss: () => Promise<void>
  onRemove: () => Promise<void>
}

export function ContentReview({ selectedContent, onDismiss, onRemove }: ContentReviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true)
    try {
      await action()
    } finally {
      setIsLoading(false)
    }
  }

  // New handleDelete function
  const handleDelete = async () => {
    if (!selectedContent) return

    try {
      const response = await fetch(`/api/content/${selectedContent.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete content')

      toast({
        title: "Success",
        description: "Content has been deleted"
      })

      // Call onRemove to update local state if needed
      await onRemove(); // Assuming onRemove updates the local state

      // Call onDismiss to close the dialog after deletion
      await onDismiss(); // Dismiss the content review dialog

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Content</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedContent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted">
              <pre className="whitespace-pre-wrap text-sm">
                {selectedContent.content}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Reason for Flag</h3>
              <p className="text-sm text-muted-foreground">{selectedContent.reason}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => handleAction(handleDelete)} // Updated to use handleDelete
                disabled={isLoading}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {isLoading ? 'Processing...' : 'Remove Content'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAction(onDismiss)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Dismiss Flag'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Select content to review
          </div>
        )}
      </CardContent>
    </Card>
  )
}
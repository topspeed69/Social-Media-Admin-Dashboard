import { AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContentReview({ selectedContent }: { selectedContent: any }) {
  const handleRemoveContent = () => {
    console.log('Removing content:', selectedContent?.id)
    // In a real app, this would make an API call
  }

  const handleDismissFlag = () => {
    console.log('Dismissing flag:', selectedContent?.id)
    // In a real app, this would make an API call
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
              <Button variant="destructive" onClick={handleRemoveContent}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Remove Content
              </Button>
              <Button variant="outline" onClick={handleDismissFlag}>
                Dismiss Flag
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

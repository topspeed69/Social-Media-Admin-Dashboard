// app/dashboard/posts/post-management/flag-details-dialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FlagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: any | null
  onFlag: (postId: number, reason: string) => Promise<void>
  onFlagComplete: () => void; // Add this line

}

export function FlagDetailsDialog({
  open,
  onOpenChange,
  post,
  onFlag
}: FlagDialogProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!post || !reason.trim()) return;

    setLoading(true);
    try {
      await onFlag(post.id, reason.trim());
      setReason('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error flagging post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) setReason('');
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag Post</DialogTitle>
          <DialogDescription>
            Provide a reason for flagging this post. Flagged posts will be reviewed by moderators.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="font-medium mb-2">Post Content:</p>
            <p className="text-sm">{post?.content}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for flagging</label>
            <Textarea
              placeholder="Explain why this post should be reviewed..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReason('');
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Flagging...' : 'Flag Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// Moved from app/dashboard/posts/post-management/flag-details-dialog.tsx
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
        <Textarea
          placeholder="Reason for flagging..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Flagging...' : 'Flag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

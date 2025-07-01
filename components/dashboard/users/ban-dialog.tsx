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

interface BanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
  username?: string
}

export function BanDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  username 
}: BanDialogProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return

    setLoading(true)
    try {
      await onConfirm(reason)
      setReason('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban {username}? This will delete all their posts
            and comments. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reason for Ban
            </label>
            <Textarea
              placeholder="Enter reason for banning this user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason.trim() || loading}
          >
            {loading ? 'Banning...' : 'Ban User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
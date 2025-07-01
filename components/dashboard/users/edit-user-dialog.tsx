'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

export function EditUserDialog({ 
  open, 
  onOpenChange, 
  user 
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      })
    }
  }, [user])

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.email.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      toast({
        title: 'Success',
        description: 'User details updated successfully.',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user details.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user's details. Username must be unique.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="Enter email"
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
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
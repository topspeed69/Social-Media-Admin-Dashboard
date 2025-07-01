'use client'

import { useState } from 'react'
import { UserSearch } from '@/components/dashboard/users/user-search'
import { BanDialog } from '@/components/dashboard/users/ban-dialog'
import { EditUserDialog } from '@/components/dashboard/users/edit-user-dialog'
import { useToast } from '@/components/ui/use-toast'

// Import the User type from UserSearch
interface User {
  id: number
  username: string
  email: string
  profilePhotoUrl: string | null
  bio: string | null
  createdAt: string
  posts: Array<{
    id: number
    content: string
    photo?: { photoUrl: string }
    video?: { videoUrl: string }
    likes: any[]
    comments: any[]
    createdAt: string
  }>
  comments: Array<{
    id: number
    postId: number
    text: string
    likes: any[]
    createdAt: string
  }>
  following: Array<{
    id: number
    username: string
    profilePhotoUrl: string | null
    followedAt: string
  }>
  followers: Array<{
    id: number
    username: string
    profilePhotoUrl: string | null
    followedAt: string
  }>
}

export default function UsersPage() {
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleBanUser = async (reason: string) => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error('Failed to ban user')
      }

      toast({
        title: 'User Banned',
        description: `${selectedUser.username} has been banned successfully.`,
      })
      setShowBanDialog(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to ban user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <UserSearch onUserSelect={(user) => handleUserSelect(user as User)} />
      
      <BanDialog 
        open={showBanDialog} 
        onOpenChange={setShowBanDialog}
        onConfirm={handleBanUser}
        username={selectedUser?.username}
      />
      
      <EditUserDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={selectedUser}
      />
    </div>
  )
}
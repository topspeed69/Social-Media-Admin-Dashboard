'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserProfile } from './user-profile'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { User, UserSearchProps } from '@/types'

const isValidUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function UserSearch({ onUserSelect }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username to search",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/users?username=${encodeURIComponent(searchTerm.trim())}`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user')
      }

      const data = await response.json()
      console.log('Received data:', data)

      if (!data) {
        throw new Error('No data received')
      }

      const formattedUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        profilePhotoUrl: isValidUrl(data.profilePhotoUrl) ? data.profilePhotoUrl : null,
        bio: data.bio,
        createdAt: data.createdAt,
        posts: data.posts?.map((post: any) => ({
          id: post.id,
          content: post.caption || '',
          photo: post.photo && isValidUrl(post.photo.photoUrl) ? post.photo : null,
          video: post.video && isValidUrl(post.video.videoUrl) ? post.video : null,
          likes: post.likes || [],
          comments: post.comments || [],
          createdAt: post.createdAt
        })) || [],
        comments: data.comments || [],
        following: data.following?.map((f: any) => ({
          id: f.followee.id,
          username: f.followee.username,
          profilePhotoUrl: isValidUrl(f.followee.profilePhotoUrl) ? f.followee.profilePhotoUrl : null,
          followedAt: f.createdAt
        })) || [],
        followers: data.followers?.map((f: any) => ({
          id: f.follower.id,
          username: f.follower.username,
          profilePhotoUrl: isValidUrl(f.follower.profilePhotoUrl) ? f.follower.profilePhotoUrl : null,
          followedAt: f.createdAt
        })) || []
      }

      console.log('Formatted user data:', formattedUser)
      setUserData(formattedUser)
      
      if (onUserSelect) {
        onUserSelect(formattedUser)
      }

    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to find user",
        variant: "destructive"
      })
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search user by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-4">
            <p>Loading...</p>
          </CardContent>
        </Card>
      )}

      {userData && !loading && (
        <div className="mt-6">
          <UserProfile user={userData} />
        </div>
      )}
      
      {!userData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{searchTerm ? 'No user found' : 'Search for a user to view their details.'}</p>
          </CardContent>
        </Card>
      )}

      {process.env.NODE_ENV === 'development' && userData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-mono text-sm">
            Debug: User data loaded for {userData.username}
          </p>
        </div>
      )}
    </div>
  )
}
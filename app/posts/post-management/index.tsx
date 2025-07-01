'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Flag, Trash2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { DeleteDialog } from './delete-dialog'
import { FlagDetailsDialog } from './flag-details-dialog'

interface Post {
  id: number
  content: string
  media: {
    type: 'photo' | 'video'
    url: string
  } | null
  user: {
    username: string
    profilePhotoUrl: string | null
  }
  likes: number
  comments: number
  hashtags: string[]
  createdAt: string
  flags?: {
    count: number
    status: 'pending' | 'resolved' | 'dismissed'
  }
}

export function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [timeFilter])

  async function fetchPosts() {
    setLoading(true)
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      toast({
        title: 'Error fetching posts',
        description: 'There was an error fetching the posts. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
  }

  function handleTimeFilterChange(value: string) {
    setTimeFilter(value)
  }

  function handleDeletePost(post: Post) {
    setSelectedPost(post)
    setShowDeleteDialog(true)
  }

  function handleFlagPost(post: Post) {
    setSelectedPost(post)
    setShowFlagDialog(true)
  }

  const filteredPosts = posts.filter(post => {
    return post.content.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <Button>
          New Post
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-4">
        <Input 
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select onValueChange={handleTimeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This week</SelectItem>
            <SelectItem value="this_month">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[150px]">Media</TableHead>
              <TableHead className="w-[100px]">Likes</TableHead>
              <TableHead className="w-[100px]">Comments</TableHead>
              <TableHead className="w-[150px]">Hashtags</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleEditPost(post)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeletePost(post)}
                      >
                        Delete
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleFlagPost(post)}
                      >
                        Flag
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.user.profilePhotoUrl || '/default-avatar.png'} 
                        alt={post.user.username} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{post.user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.media ? (
                      post.media.type === 'photo' ? (
                        <img 
                          src={post.media.url} 
                          alt="Post media" 
                          className="w-full h-auto rounded-md"
                        />
                      ) : (
                        <video 
                          src={post.media.url} 
                          controls 
                          className="w-full h-auto rounded-md"
                        />
                      )
                    ) : (
                      <p className="text-center text-muted-foreground">No media</p>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {post.likes}
                  </TableCell>
                  <TableCell className="text-center">
                    {post.comments}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map(hashtag => (
                        <Badge key={hashtag} variant="outline">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {post.flags ? (
                      <Badge variant={post.flags.status === 'resolved' ? 'success' : 'warning'}>
                        {post.flags.status}
                      </Badge>
                    ) : (
                      <p className="text-muted-foreground">No flags</p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      {selectedPost && (
        <>
          <DeleteDialog 
            open={showDeleteDialog} 
            onOpenChange={setShowDeleteDialog} 
            post={selectedPost} 
            onDelete={fetchPosts}
          />
          <FlagDetailsDialog 
            open={showFlagDialog} 
            onOpenChange={setShowFlagDialog} 
            post={selectedPost} 
            onFlagUpdate={fetchPosts}
          />
        </>
      )}
    </div>
  )
}

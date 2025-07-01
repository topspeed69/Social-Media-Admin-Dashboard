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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <Input 
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time Filter</label>
          <Select onValueChange={handleTimeFilterChange} defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <span className="loader"></span>
        </div>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[150px]">Media</TableHead>
              <TableHead className="w-[100px]">Likes</TableHead>
              <TableHead className="w-[100px]">Comments</TableHead>
              <TableHead className="w-[150px]">Hashtags</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="w-[100px]">Flags</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
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
                  <TableCell className="text-center">{post.id}</TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell className="text-center">
                    {post.media ? (
                      post.media.type === 'photo' ? (
                        <img src={post.media.url} alt="Post media" className="w-full h-auto rounded-md" />
                      ) : (
                        <video controls className="w-full h-auto rounded-md">
                          <source src={post.media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )
                    ) : (
                      <span className="text-gray-500">No media</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{post.likes}</TableCell>
                  <TableCell className="text-center">{post.comments}</TableCell>
                  <TableCell className="text-center">
                    {post.hashtags.length > 0 ? (
                      post.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {hashtag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No hashtags</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(post.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {post.flags ? post.flags.count : 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleFlagPost(post)}
                        className="mr-2"
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeletePost(post)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
            onFlag={fetchPosts}
          />
        </>
      )}
    </div>
  )
}

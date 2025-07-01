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

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (timeFilter !== 'all') params.append('timeFilter', timeFilter)
      params.append('showFlagged', 'false')

      const response = await fetch(`/api/posts?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPosts()
  }

  const handleDelete = async (postId: number) => {
    console.log('Initiating delete for post:', postId);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
      
      await fetchPosts();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const handleFlagSubmit = async (postId: number, reason: string) => {
    console.log('Initiating flag for post:', postId);
    try {
      const response = await fetch(`/api/posts/${postId}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
          reporterId: 1, // Replace with actual user ID when auth is implemented
        }),
      });

      const data = await response.json();
      console.log('Flag response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to flag post');
      }

      toast({
        title: "Success",
        description: "Post has been flagged for review"
      });

      await fetchPosts();
      setShowFlagDialog(false);
    } catch (error) {
      console.error('Error flagging post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to flag post",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleFlagComplete = () => {
    fetchPosts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">ID: {post.id}</Badge>
                    <p className="truncate">{post.content}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>@{post.user.username}</TableCell>
                <TableCell>
                  {post.media ? (
                    <Badge>
                      {post.media.type}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {post.likes} likes
                    </p>
                    <p className="text-sm">
                      {post.comments} comments
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell>
                  {post.flags ? (
                    <Badge 
                      variant={post.flags.status === 'pending' ? 'destructive' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowFlagDialog(true)
                      }}
                    >
                      {post.flags.count} flags
                    </Badge>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowFlagDialog(true)
                      }}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => selectedPost && handleDelete(selectedPost.id)}
        postId={selectedPost?.id}
      />

      <FlagDetailsDialog
        open={showFlagDialog}
        onOpenChange={setShowFlagDialog}
        post={selectedPost}
       // onFlag={handleFlag}
        onFlagComplete={() => setShowFlagDialog(false)}
      />
    </div>
  )
}
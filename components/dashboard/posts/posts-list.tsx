'use client'

import { useState, useEffect } from 'react'
import { Flag, Trash2, MoreVertical } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FlagDetailsDialog } from '@/app/dashboard/posts/post-management/flag-details-dialog'

interface Post {
  id: number
  content: string
  photo?: { photoUrl: string } | null
  video?: { videoUrl: string } | null
  user: {
    username: string
    profilePhotoUrl: string | null
  }
  likes: number
  comments: number
  createdAt: string
  hashtags: string[]
  flags?: {
    status: 'pending' | 'resolved' | 'dismissed'
    count: number
  }
}

interface PostsListProps {
  searchTerm?: string
  showFlagged?: boolean
}

export function PostsList({ searchTerm, showFlagged }: PostsListProps) {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [searchTerm, showFlagged])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (showFlagged) params.append('showFlagged', 'true')
      
      console.log('Fetching posts with params:', params.toString())
      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      console.log('Received posts data:', data)

      if (!response.ok) throw new Error('Failed to fetch posts')
      
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPost) return

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/flag`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete post')

      toast({
        title: "Success",
        description: "Post has been deleted"
      })

      // Remove from local state
      setPosts(posts.filter(post => post.id !== selectedPost.id))
      setShowDeleteDialog(false)
      setSelectedPost(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-24 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  // In PostsList and TrendingSection components
  if (!posts.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No posts found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={`post-${post.id}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.user.profilePhotoUrl || ''} />
                  <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">@{post.user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedPost(post)
                      setShowFlagDialog(true)
                    }}
                    className={post.flags ? "text-destructive" : ""}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {post.flags ? `Flagged (${post.flags.count})` : "Flag Post"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedPost(post)
                      setShowDeleteDialog(true)
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4">
              <p className="text-sm">{post.content}</p>
              {post.photo && (
                <img 
                  src={post.photo.photoUrl} 
                  alt="Post content" 
                  className="mt-3 rounded-lg w-full object-cover max-h-96" 
                />
              )}
              {post.video && (
                <video 
                  src={post.video.videoUrl} 
                  controls 
                  className="mt-3 rounded-lg w-full" 
                />
              )}
            </div>

            {post.hashtags && post.hashtags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.hashtags.map((tag, idx) => (
                  <Badge key={`tag-${post.id}-${tag}-${idx}`} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Flag Dialog */}
      <FlagDetailsDialog
        open={showFlagDialog}
        onOpenChange={setShowFlagDialog}
        post={selectedPost}
        onFlag={async (postId, reason) => {
          if (!selectedPost) return;
          try {
            const reporterId = 1; // Replace with actual moderator ID
            const response = await fetch(`/api/posts/${selectedPost.id}/flag`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reason, reporterId })
            });
            if (!response.ok) throw new Error('Failed to flag post');
            toast({ title: "Success", description: "Post has been flagged for review" });
            setPosts(prevPosts =>
              prevPosts.map(p =>
                p.id === selectedPost.id
                  ? { ...p, flags: { status: 'pending', count: (p.flags?.count || 0) + 1 } }
                  : p
              )
            );
          } catch (error) {
            toast({ title: "Error", description: "Failed to flag post", variant: "destructive" });
          }
        }}
        onFlagComplete={() => {
          setShowFlagDialog(false);
          setSelectedPost(null);
        }}
      />

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
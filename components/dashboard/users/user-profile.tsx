'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { UserProfileProps } from '@/types'

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
    photo?: { photoUrl: string } | null
    video?: { videoUrl: string } | null
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

interface FollowData {
  id: number;
  username: string;
  profilePhotoUrl: string | null;
  followedAt: string;
}

const getInitials = (username: string) => {
  return username
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

export function UserProfile({ user: initialUser }: { user: User }) {
  const [user, setUser] = useState<User>(initialUser)
  useEffect(() => {
    console.log('User data in component:', user);
  }, [user]);

  const posts = user?.posts || [];
  const comments = user?.comments || [];
  const bio = user?.bio || 'No bio provided';

  const [expandedPosts, setExpandedPosts] = useState<number[]>([])
  const [followData, setFollowData] = useState<{
    following: FollowData[];
    followers: FollowData[];
  }>({ following: [], followers: [] });

// In user-profile.tsx
const fetchUserDetails = async (userId: number) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    if (data) {
      setUser(data);
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

useEffect(() => {
  if (user?.id) {
    fetchUserDetails(user.id);
  }
}, [user?.id]);

useEffect(() => {
  const fetchFollowData = async () => {
    try {
      console.log('Fetching follow data for user:', user.id)
      const response = await fetch(`/api/users/${user.id}/follows`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch follow data')
      }

      const data = await response.json()
      console.log('Received follow data:', data)
      
      setFollowData({
        following: data.following || [],
        followers: data.followers || []
      })
    } catch (error) {
      console.error('Error fetching follow data:', error)
      setFollowData({
        following: [],
        followers: []
      })
    }
  }

  if (user?.id) {
    fetchFollowData()
  }
}, [user?.id]);

  const togglePostExpansion = (postId: number) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const PostsContent = ({ posts }: { posts: any[] }) => {
    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No posts yet
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell className="max-w-md">
                {expandedPosts.includes(post.id) 
                  ? post.content 
                  : post.content?.length > 50 
                    ? `${post.content.slice(0, 50)}...` 
                    : post.content || 'No content'}
              </TableCell>
              <TableCell>
                {post.photo ? 'Photo' : post.video ? 'Video' : 'None'}
              </TableCell>
              <TableCell>{post.likes?.length || 0}</TableCell>
              <TableCell>{post.comments?.length || 0}</TableCell>
              <TableCell>
                {new Date(post.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {post.content?.length > 50 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePostExpansion(post.id)}
                  >
                    {expandedPosts.includes(post.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const CommentsContent = ({ comments }: { comments: any[] }) => {
    if (!comments || comments.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No comments yet
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comment</TableHead>
            <TableHead>Post ID</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.text}</TableCell>
              <TableCell>{comment.postId}</TableCell>
              <TableCell>{comment.likes?.length || 0}</TableCell>
              <TableCell>{new Date(comment.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                {user.profilePhotoUrl ? (
                  <AvatarImage 
                    src={user.profilePhotoUrl} 
                    alt={user.username}
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Bio</label>
              <p className="mt-1">{bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <Input value={user.id.toString()} readOnly className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Created At</label>
                <Input value={new Date(user.createdAt).toLocaleString()} readOnly className="mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
          <TabsTrigger value="follows">Follows & Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardContent>
              <PostsContent posts={posts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent>
              <CommentsContent comments={comments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follows">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Following ({followData.following.length})</h3>
                <div className="space-y-4">
                  {followData.following.map((followUser) => (
                    <div key={`following-${followUser.id}`} className="flex items-center space-x-4">
                      <Avatar>
                        {followUser.profilePhotoUrl ? (
                          <AvatarImage 
                            src={followUser.profilePhotoUrl} 
                            alt={followUser.username}
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <AvatarFallback>{getInitials(followUser.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{followUser.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Following since {new Date(followUser.followedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {followData.following.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Not following anyone</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Followers ({followData.followers.length})</h3>
                <div className="space-y-4">
                  {followData.followers.map((follower) => (
                    <div key={`follower-${follower.id}`} className="flex items-center space-x-4">
                      <Avatar>
                        {follower.profilePhotoUrl ? (
                          <AvatarImage 
                            src={follower.profilePhotoUrl} 
                            alt={follower.username}
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <AvatarFallback>{getInitials(follower.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{follower.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Follower since {new Date(follower.followedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {followData.followers.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No followers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
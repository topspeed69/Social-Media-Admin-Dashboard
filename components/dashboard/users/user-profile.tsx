'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from 'lucide-react'

export function UserProfile({ user }: { user: any }) {
  const [expandedPosts, setExpandedPosts] = useState<number[]>([])

  const togglePostExpansion = (postId: number) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="destructive">Ban User</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Bio</label>
              <p className="mt-1">{user.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <Input value={user.userId} readOnly className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Created At</label>
                <Input value={user.createdAt} readOnly className="mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="moderation">Moderation History</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.posts.map((post: any) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-md">
                        {expandedPosts.includes(post.id) 
                          ? post.content 
                          : `${post.content.slice(0, 50)}...`}
                      </TableCell>
                      <TableCell>{post.likes}</TableCell>
                      <TableCell>{post.comments}</TableCell>
                      <TableCell>{post.createdAt}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.comments.map((comment: any) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.postId}</TableCell>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>{comment.likes}</TableCell>
                      <TableCell>{comment.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Moderator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.moderationHistory.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.action}</TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.moderator}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

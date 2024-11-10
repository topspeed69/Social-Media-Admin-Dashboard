// Basic interfaces
export interface Post {
    id: number
    content: string
    likes: number
    comments: number
    createdAt: string
  }
  
  export interface Comment {
    id: number
    postId: number
    content: string
    createdAt: string
    likes: number
  }
  
  export interface User {
    id: number
    username: string
    avatar: string
  }
  
  export interface ModerationRecord {
    id: number
    action: string
    reason: string
    date: string
    moderator: string
  }
  
  export interface Analytics {
    name: string
    value: number
  }
  
  export interface UserData {
    username: string
    email: string
    avatar: string
    bio: string
    userId: string
    createdAt: string
    status: string
    posts: Post[]
    comments: Comment[]
    follows: User[]
    followers: User[]
    moderationHistory: ModerationRecord[]
    analytics: {
      engagement: Analytics[]
      followers: Analytics[]
      posts: Analytics[]
    }
  }
  
  export interface FlaggedContent {
    id: string
    type: string
    content: string
    reason: string
    reportCount: number
    timestamp: string
    status: string
  }
  
  export interface ModeratorLog {
    id: number
    moderator: string
    action: string
    timestamp: string
    ip: string
  }
  
  export interface ActivityLog {
    id: number
    moderator: string
    action: string
    target: string
    reason: string
    timestamp: string}
  
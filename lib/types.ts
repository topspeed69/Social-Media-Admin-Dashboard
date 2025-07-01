// Real Database Types
export interface User {
  id: number
  username: string
  email: string
  profilePhotoUrl: string | null
  bio: string | null
  createdAt: Date
}

export interface Post {
  id: number
  userId: number
  photoId: number | null
  videoId: number | null
  caption: string | null
  location: string | null
  createdAt: Date
  user: User
  photo?: {
    photoUrl: string
  }
  video?: {
    videoUrl: string
  }
  likes: PostLike[]
  comments: Comment[]
}

export interface Comment {
  id: number
  postId: number
  userId: number
  text: string
  createdAt: Date
  likes: CommentLike[]
}

export interface PostLike {
  userId: number
  postId: number
  createdAt: Date
}

export interface CommentLike {
  userId: number
  commentId: number
  createdAt: Date
}

export interface Follow {
  followerId: number
  followeeId: number
  createdAt: Date
  follower: User
  followee: User
}

export interface Hashtag {
  id: number
  name: string
  createdAt: Date
}

export interface Login {
  id: number
  userId: number
  ip: string
  loginTime: Date
  user: User
}

// Dashboard Types
export interface DashboardStats {
  users: {
    total: number
    trend: number
  }
  posts: {
    total: number
    trend: number
  }
  comments: {
    total: number
    trend: number
  }
  logins: {
    total: number
    trend: number
  }
}

export interface ChartData {
  name: string
  value: number
}

// Mock Types (for features not in database)
export interface FlaggedContent {
  id: string
  type: 'Post' | 'Comment'
  content: string
  reason: string
  reportCount: number
  timestamp: string
  status: string
}

export interface ModerationAction {
  id: number
  contentId: string
  moderatorId: number
  action: 'remove' | 'warn' | 'dismiss'
  reason: string
  timestamp: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
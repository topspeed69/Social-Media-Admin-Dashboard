export interface User {
    id: number
    username: string
    email: string
    profilePhotoUrl: string | null
    bio: string | null
    createdAt: string
    posts: Array<Post>
    comments: Array<Comment>
    following: Array<FollowUser>
    followers: Array<FollowUser>
  }
  
  export interface Post {
    id: number
    content: string
    photo?: { photoUrl: string } | null
    video?: { videoUrl: string } | null
    likes: any[]
    comments: any[]
    createdAt: string
  }
  
  export interface Comment {
    id: number
    postId: number
    text: string
    likes: any[]
    createdAt: string
  }
  
  export interface FollowUser {
    id: number
    username: string
    profilePhotoUrl: string | null
    followedAt: string
  }
  
  export interface UserSearchProps {
    onUserSelect?: (user: User) => void
  }
  
  export interface UserProfileProps {
    user: User
  }
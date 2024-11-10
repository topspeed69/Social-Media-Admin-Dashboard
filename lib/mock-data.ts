// Mock data for all dashboard components
export const mockData = {
    // Overview Stats
    stats: {
      totalUsers: 10482,
      totalPosts: 23591,
      totalComments: 42973,
      totalModerations: 1289,
      trends: {
        users: 12,
        posts: 8,
        comments: 15,
        moderations: 5
      }
    },
  
    // Chart Data
    charts: {
      userGrowth: [
        { name: 'Mon', value: 100 },
        { name: 'Tue', value: 120 },
        { name: 'Wed', value: 140 },
        { name: 'Thu', value: 160 },
        { name: 'Fri', value: 180 },
        { name: 'Sat', value: 200 },
        { name: 'Sun', value: 220 }
      ],
      postActivity: [
        { name: 'Mon', value: 5 },
        { name: 'Tue', value: 7 },
        { name: 'Wed', value: 6 },
        { name: 'Thu', value: 8 },
        { name: 'Fri', value: 10 },
        { name: 'Sat', value: 9 },
        { name: 'Sun', value: 12 }
      ],
      engagement: [
        { name: 'Mon', value: 65 },
        { name: 'Tue', value: 70 },
        { name: 'Wed', value: 75 },
        { name: 'Thu', value: 80 },
        { name: 'Fri', value: 85 },
        { name: 'Sat', value: 90 },
        { name: 'Sun', value: 88 }
      ]
    },
  
    // User Data
    users: {
      current: {
        username: "john_doe",
        email: "john@example.com",
        avatar: "/placeholder.svg",
        bio: "Passionate photographer and traveler. Always seeking new adventures!",
        userId: "user#123",
        createdAt: "2023-01-15 10:30:00",
        status: "active",
        posts: [
          {
            id: 1,
            content: "Just visited the Grand Canyon!",
            likes: 150,
            comments: 23,
            createdAt: "2023-06-15 14:30:00"
          },
          {
            id: 2,
            content: "New camera day! Can't wait to try it out...",
            likes: 89,
            comments: 12,
            createdAt: "2023-06-10 09:15:00"
          }
        ],
        comments: [
          {
            id: 1,
            postId: 123,
            content: "This is absolutely stunning! 😍",
            createdAt: "2024-01-15 14:30:00",
            likes: 45
          },
          {
            id: 2,
            postId: 124,
            content: "Great composition!",
            createdAt: "2024-01-14 09:15:00",
            likes: 32
          }
        ],
        follows: [
          { id: 1, username: "jane_smith", avatar: "/placeholder.svg" },
          { id: 2, username: "photo_master", avatar: "/placeholder.svg" }
        ],
        followers: [
          { id: 3, username: "travel_guru", avatar: "/placeholder.svg" },
          { id: 4, username: "nature_lover", avatar: "/placeholder.svg" }
        ],
        moderationHistory: [
          {
            id: 1,
            action: "Warning Issued",
            reason: "Inappropriate language",
            date: "2024-01-10",
            moderator: "admin1"
          },
          {
            id: 2,
            action: "Post Removed",
            reason: "Copyright violation",
            date: "2024-01-05",
            moderator: "admin2"
          }
        ],
        analytics: {
          engagement: [
            { name: 'Mon', value: 65 },
            { name: 'Tue', value: 70 },
            { name: 'Wed', value: 75 },
            { name: 'Thu', value: 80 },
            { name: 'Fri', value: 85 },
            { name: 'Sat', value: 90 },
            { name: 'Sun', value: 88 }
          ],
          followers: [
            { name: 'Mon', value: 100 },
            { name: 'Tue', value: 120 },
            { name: 'Wed', value: 140 },
            { name: 'Thu', value: 160 },
            { name: 'Fri', value: 180 },
            { name: 'Sat', value: 200 },
            { name: 'Sun', value: 220 }
          ],
          posts: [
            { name: 'Mon', value: 5 },
            { name: 'Tue', value: 7 },
            { name: 'Wed', value: 6 },
            { name: 'Thu', value: 8 },
            { name: 'Fri', value: 10 },
            { name: 'Sat', value: 9 },
            { name: 'Sun', value: 12 }
          ]
        }
      }
    },
  
    // Moderation Data
    moderation: {
      flaggedContent: [
        {
          id: "POST#123",
          type: "Post",
          content: "This is a flagged post content...",
          reason: "Inappropriate language",
          reportCount: 5,
          timestamp: "2024-01-20 14:30:00",
          status: "pending"
        },
        {
          id: "POST#124",
          type: "Comment",
          content: "This is a flagged comment...",
          reason: "Harassment",
          reportCount: 3,
          timestamp: "2024-01-20 15:45:00",
          status: "pending"
        }
      ]
    },
  
    // Logs Data
    logs: {
      loginLogs: [
        {
          id: 1,
          moderator: "mod_john",
          action: "Login",
          timestamp: "2024-01-20 09:00:00",
          ip: "192.168.1.1"
        },
        {
          id: 2,
          moderator: "mod_sarah",
          action: "Logout",
          timestamp: "2024-01-20 17:00:00",
          ip: "192.168.1.2"
        }
      ],
      activityLogs: [
        {
          id: 1,
          moderator: "mod_john",
          action: "Content Removed",
          target: "POST#123",
          reason: "Violation of community guidelines",
          timestamp: "2024-01-20 10:15:00"
        },
        {
          id: 2,
          moderator: "mod_sarah",
          action: "User Banned",
          target: "USER#456",
          reason: "Multiple violations",
          timestamp: "2024-01-20 11:30:00"
        }
      ]
    }
  }
  
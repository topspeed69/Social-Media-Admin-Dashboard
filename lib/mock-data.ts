// Only keeping mock data for features not in database
export const mockData = {
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
  }
}
import { type NextRequest, NextResponse } from "next/server"

// Mock database for demonstration
const notifications = [
  {
    id: "notif1",
    type: "like",
    actor: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
    },
    content:
      'liked your post: "Just finished my latest UI design project! Really happy with how the dashboard turned out."',
    time: "2 hours ago",
    isRead: false,
    actionUrl: "/posts/1",
    createdAt: "2024-03-27T10:30:00Z",
  },
  {
    id: "notif2",
    type: "comment",
    actor: {
      id: "user2",
      name: "Alex Chen",
      avatar: "/placeholder-user.jpg",
    },
    content: 'commented on your post: "This looks amazing! Can\'t wait to see the final product."',
    time: "3 hours ago",
    isRead: false,
    actionUrl: "/posts/1",
    createdAt: "2024-03-27T09:30:00Z",
  },
  {
    id: "notif3",
    type: "friend_request",
    actor: {
      id: "user3",
      name: "Maria Garcia",
      avatar: "/placeholder-user.jpg",
    },
    content: "sent you a friend request.",
    time: "5 hours ago",
    isRead: false,
    actionUrl: "/friends/requests",
    actionLabel: "Accept",
    secondaryActionUrl: "/friends/requests",
    secondaryActionLabel: "Decline",
    createdAt: "2024-03-27T07:30:00Z",
  },
  {
    id: "notif4",
    type: "mention",
    actor: {
      id: "user4",
      name: "Design Team",
      avatar: "/placeholder-user.jpg",
    },
    content: 'mentioned you in a comment: "@johndoe what do you think about this color scheme?"',
    time: "Yesterday at 4:30 PM",
    isRead: true,
    actionUrl: "/posts/2",
    createdAt: "2024-03-26T16:30:00Z",
  },
  {
    id: "notif5",
    type: "event",
    actor: {
      id: "user5",
      name: "Tech Community",
      avatar: "/placeholder-user.jpg",
    },
    content: 'invited you to an event: "Web Development Workshop" on March 15, 2024.',
    time: "Yesterday at 2:15 PM",
    isRead: true,
    actionUrl: "/events/1",
    actionLabel: "Interested",
    secondaryActionUrl: "/events/1",
    secondaryActionLabel: "Not Interested",
    createdAt: "2024-03-26T14:15:00Z",
  },
]

// Get notifications for the current user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const unreadOnly = searchParams.get("unreadOnly") === "true"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const page = Number.parseInt(searchParams.get("page") || "1")

  // Filter notifications if unreadOnly is true
  let filteredNotifications = unreadOnly ? notifications.filter((notification) => !notification.isRead) : notifications

  // Sort by createdAt (newest first)
  filteredNotifications = filteredNotifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Implement pagination
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

  // Return paginated notifications with metadata
  return NextResponse.json({
    notifications: paginatedNotifications,
    pagination: {
      total: filteredNotifications.length,
      page,
      limit,
      pages: Math.ceil(filteredNotifications.length / limit),
      unreadCount: notifications.filter((notification) => !notification.isRead).length,
    },
  })
}

// Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.notificationIds && !body.all) {
      return NextResponse.json({ error: "Notification IDs or 'all' flag is required" }, { status: 400 })
    }

    // In a real app, you would update the database
    // For demo, we'll just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}


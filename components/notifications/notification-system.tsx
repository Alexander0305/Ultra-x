"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  ImageIcon,
  CheckCircle,
  Settings,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

type NotificationType = "like" | "comment" | "friend_request" | "mention" | "event" | "tag" | "system"

interface Notification {
  id: string
  type: NotificationType
  actor: {
    id: string
    name: string
    avatar: string
  }
  content: string
  time: string
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
  secondaryActionUrl?: string
  secondaryActionLabel?: string
  image?: string
}

export default function NotificationSystem() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
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
        },
        {
          id: "notif6",
          type: "tag",
          actor: {
            id: "user6",
            name: "James Wilson",
            avatar: "/placeholder-user.jpg",
          },
          content: "tagged you in a photo.",
          time: "2 days ago",
          isRead: true,
          actionUrl: "/photos/1",
          image: "/placeholder.svg",
        },
        {
          id: "notif7",
          type: "system",
          actor: {
            id: "system",
            name: "SocialNet",
            avatar: "/placeholder-user.jpg",
          },
          content: "Your account was successfully verified.",
          time: "3 days ago",
          isRead: true,
        },
      ]

      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
    toast({
      title: "All notifications marked as read",
      description: "You have no unread notifications.",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const deleteAllNotifications = () => {
    setNotifications([])
    toast({
      title: "All notifications deleted",
      description: "All notifications have been removed.",
    })
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-rose-500 flex-shrink-0" />
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-green-500 flex-shrink-0" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500 flex-shrink-0" />
      case "tag":
        return <ImageIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
      case "system":
        return <Bell className="h-5 w-5 text-primary flex-shrink-0" />
      default:
        return <MessageCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.isRead
    return notif.type === activeTab
  })

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="default" className="rounded-full px-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark all as read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteAllNotifications} disabled={notifications.length === 0}>
                <Bell className="mr-2 h-4 w-4" />
                Clear all notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Notification settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-1 rounded-full px-1 py-0 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="mention" className="text-xs">
                Mentions
              </TabsTrigger>
              <TabsTrigger value="friend_request" className="text-xs">
                Requests
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:text-xs">Filter</span>
            </Button>
          </div>

          <TabsContent value={activeTab} className="space-y-4 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "all"
                    ? "You don't have any notifications yet."
                    : activeTab === "unread"
                      ? "You don't have any unread notifications."
                      : `You don't have any ${activeTab} notifications.`}
                </p>
              </div>
            ) : (
              <>
                {/* Today */}
                {filteredNotifications.some(
                  (notif) => notif.time.includes("hours ago") || notif.time.includes("just now"),
                ) && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Today</h3>
                    <div className="space-y-1">
                      {filteredNotifications
                        .filter((notif) => notif.time.includes("hours ago") || notif.time.includes("just now"))
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Yesterday */}
                {filteredNotifications.some((notif) => notif.time.includes("Yesterday")) && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Yesterday</h3>
                    <div className="space-y-1">
                      {filteredNotifications
                        .filter((notif) => notif.time.includes("Yesterday"))
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Earlier */}
                {filteredNotifications.some(
                  (notif) =>
                    !notif.time.includes("hours ago") &&
                    !notif.time.includes("just now") &&
                    !notif.time.includes("Yesterday"),
                ) && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Earlier</h3>
                    <div className="space-y-1">
                      {filteredNotifications
                        .filter(
                          (notif) =>
                            !notif.time.includes("hours ago") &&
                            !notif.time.includes("just now") &&
                            !notif.time.includes("Yesterday"),
                        )
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-rose-500 flex-shrink-0" />
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-green-500 flex-shrink-0" />
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500 flex-shrink-0" />
      case "tag":
        return <ImageIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
      case "system":
        return <Bell className="h-5 w-5 text-primary flex-shrink-0" />
      default:
        return <MessageCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors relative group",
        !notification.isRead && "bg-muted/30 dark:bg-muted/10",
      )}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <Avatar>
        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{notification.actor.name}</span> {notification.content}
        </p>
        <span className="text-xs text-muted-foreground">{notification.time}</span>

        {notification.image && (
          <div className="mt-2 bg-muted rounded-md w-16 h-16 flex items-center justify-center overflow-hidden">
            <img
              src={notification.image || "/placeholder.svg"}
              alt="Notification image"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {(notification.actionUrl || notification.secondaryActionUrl) && (
          <div className="flex gap-2 mt-2">
            {notification.actionUrl && (
              <Button size="sm" variant="default">
                {notification.actionLabel || "View"}
              </Button>
            )}
            {notification.secondaryActionUrl && (
              <Button size="sm" variant="outline">
                {notification.secondaryActionLabel || "Dismiss"}
              </Button>
            )}
          </div>
        )}
      </div>
      {getIcon(notification.type)}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!notification.isRead ? (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead(notification.id)
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as read
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                // In a real app, you would call an API to mark as unread
              }}
            >
              <Bell className="mr-2 h-4 w-4" />
              Mark as unread
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete(notification.id)
            }}
            className="text-destructive"
          >
            <Bell className="mr-2 h-4 w-4" />
            Remove this notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


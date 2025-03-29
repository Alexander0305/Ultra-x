"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, UserPlus, Calendar, ImageIcon, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type NotificationType = "like" | "comment" | "friend_request" | "mention" | "event" | "tag" | "system"

interface NotificationItemProps {
  notification: {
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
  onMarkAsRead?: (id: string) => void
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
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
        "flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors",
        !notification.isRead && "bg-muted/30",
      )}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <Avatar>
        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <Link href={`/profile/${notification.actor.id}`} className="font-medium hover:underline">
            {notification.actor.name}
          </Link>{" "}
          {notification.content}
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
            {notification.actionUrl && <Button size="sm">{notification.actionLabel || "View"}</Button>}
            {notification.secondaryActionUrl && (
              <Button size="sm" variant="outline">
                {notification.secondaryActionLabel || "Dismiss"}
              </Button>
            )}
          </div>
        )}
      </div>
      {getIcon(notification.type)}
    </div>
  )
}


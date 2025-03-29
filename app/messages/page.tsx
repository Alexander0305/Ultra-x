"use client"

import { useState } from "react"
import MainLayout from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Search } from "lucide-react"
import ChatInterface from "@/components/messaging/chat-interface"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample data
const conversations = [
  {
    id: "conv1",
    recipient: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
    },
    lastMessage: {
      content: "Sure, let's meet tomorrow at 2pm",
      timestamp: "2m",
      isRead: false,
    },
    messages: [
      {
        id: "msg1",
        content: "Hey John! How's the new project coming along?",
        sender: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "10:30 AM",
        isCurrentUser: false,
      },
      {
        id: "msg2",
        content: "Hi Sarah! It's going well. I'm just finalizing the design mockups.",
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "10:32 AM",
        isCurrentUser: true,
      },
      {
        id: "msg3",
        content: "Great! Can you share them with me when you're done? I'd love to take a look.",
        sender: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "10:33 AM",
        isCurrentUser: false,
      },
      {
        id: "msg4",
        content: "Of course! I should be done by this afternoon. I'll send them over as soon as they're ready.",
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "10:35 AM",
        isCurrentUser: true,
      },
      {
        id: "msg5",
        content: "Sure, let's meet tomorrow at 2pm",
        sender: {
          id: "user1",
          name: "Sarah Johnson",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "10:45 AM",
        isCurrentUser: false,
      },
    ],
  },
  {
    id: "conv2",
    recipient: {
      id: "user2",
      name: "Alex Chen",
      avatar: "/placeholder-user.jpg",
      isOnline: false,
      lastActive: "1h ago",
    },
    lastMessage: {
      content: "Did you see the latest design?",
      timestamp: "1h",
      isRead: true,
    },
    messages: [
      {
        id: "msg6",
        content: "Hey, I wanted to ask about the project timeline.",
        sender: {
          id: "user2",
          name: "Alex Chen",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "9:15 AM",
        isCurrentUser: false,
      },
      {
        id: "msg7",
        content: "Sure, what do you need to know?",
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "9:18 AM",
        isCurrentUser: true,
      },
      {
        id: "msg8",
        content: "When do you think we'll be ready for the first release?",
        sender: {
          id: "user2",
          name: "Alex Chen",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "9:20 AM",
        isCurrentUser: false,
      },
      {
        id: "msg9",
        content: "I'm aiming for the end of next month. We still have some features to implement.",
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "9:25 AM",
        isCurrentUser: true,
      },
      {
        id: "msg10",
        content: "Did you see the latest design?",
        sender: {
          id: "user2",
          name: "Alex Chen",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "9:30 AM",
        isCurrentUser: false,
      },
    ],
  },
  {
    id: "conv3",
    recipient: {
      id: "user3",
      name: "Design Team",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
    },
    lastMessage: {
      content: "Maria: I'll update the mockups",
      timestamp: "3h",
      isRead: false,
    },
    messages: [],
  },
]

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredConversations = conversations.filter((conv) =>
    conv.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConversation = conversations.find((conv) => conv.id === activeConversation)

  return (
    <MainLayout showRightSidebar={false}>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-8rem)]">
        {/* Conversations List - Hide on mobile when a conversation is active */}
        {(!isMobile || !activeConversation) && (
          <Card className="border rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">Messages</h2>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">New Message</span>
              </Button>
            </div>
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted ${activeConversation === conv.id ? "bg-muted/50" : ""}`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.recipient.avatar} alt={conv.recipient.name} />
                        <AvatarFallback>{conv.recipient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conv.recipient.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{conv.recipient.name}</div>
                      <div className="text-xs text-muted-foreground truncate w-40">{conv.lastMessage.content}</div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <div className="text-xs text-muted-foreground">{conv.lastMessage.timestamp}</div>
                      {!conv.lastMessage.isRead && <div className="h-2 w-2 rounded-full bg-primary mt-1"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Chat Window */}
        {activeConversation ? (
          selectedConversation && (
            <ChatInterface
              conversation={selectedConversation}
              onBack={() => setActiveConversation(null)}
              isMobile={isMobile}
            />
          )
        ) : (
          <div className="hidden md:flex items-center justify-center h-full bg-muted/20 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}


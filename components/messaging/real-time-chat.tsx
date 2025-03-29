"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Paperclip,
  ImageIcon,
  Smile,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  ArrowLeft,
  Loader2,
  Plus,
  Users,
  Filter,
  Star,
  Clock,
  CheckCheck,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: string
  isCurrentUser: boolean
  status?: "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "file"
    url: string
    name?: string
  }[]
}

interface Conversation {
  id: string
  recipient: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastActive?: string
    isTyping?: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
  }
  messages: Message[]
  isPinned?: boolean
  isArchived?: boolean
  isGroup?: boolean
  groupMembers?: {
    id: string
    name: string
    avatar: string
  }[]
}

export default function RealTimeChat() {
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: "conv1",
          recipient: {
            id: "user1",
            name: "Sarah Johnson",
            avatar: "/placeholder-user.jpg",
            isOnline: true,
            isTyping: false,
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
              timestamp: "10:35 AM",
              isCurrentUser: true,
            },
          ],
        },
        {
          id: "conv2",
          recipient: {
            id: "user2",
            name: "Emily Davis",
            avatar: "/placeholder-user.jpg",
            isOnline: false,
            lastActive: "5m",
            isTyping: false,
          },
          lastMessage: {
            content: "Okay, sounds good!",
            timestamp: "5m",
            isRead: true,
          },
          messages: [],
        },
        {
          id: "conv3",
          recipient: {
            id: "user3",
            name: "Michael Brown",
            avatar: "/placeholder-user.jpg",
            isOnline: false,
            lastActive: "10m",
            isTyping: false,
          },
          lastMessage: {
            content: "I'll send you the document by EOD.",
            timestamp: "10m",
            isRead: true,
          },
          messages: [],
        },
        {
          id: "conv4",
          recipient: {
            id: "user4",
            name: "Linda Wilson",
            avatar: "/placeholder-user.jpg",
            isOnline: true,
            isTyping: true,
          },
          lastMessage: {
            content: "Just finished the report. Can we discuss it?",
            timestamp: "15m",
            isRead: false,
          },
          messages: [],
        },
        {
          id: "conv5",
          recipient: {
            id: "user5",
            name: "David Garcia",
            avatar: "/placeholder-user.jpg",
            isOnline: false,
            lastActive: "20m",
            isTyping: false,
          },
          lastMessage: {
            content: "Thanks for the update!",
            timestamp: "20m",
            isRead: true,
          },
          messages: [],
        },
      ]
      setConversations(mockConversations)
      setActiveConversation("conv1")
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversations, activeConversation])

  const handleSendMessage = async () => {
    if (message.trim() === "") return

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        content: message,
        sender: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder-user.jpg",
        },
        timestamp: "Now",
        isCurrentUser: true,
        status: "sent",
      }

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation.id === activeConversation) {
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
              lastMessage: {
                content: message,
                timestamp: "Now",
                isRead: false,
              },
            }
          } else {
            return conversation
          }
        })
        return updatedConversations
      })

      setMessage("")
      setIsSending(false)
    }, 500)
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle file upload logic here
      toast({
        title: "File Uploaded",
        description: `You have uploaded ${file.name}`,
      })
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const conversationContent = conversations.find((conv) => conv.id === activeConversation)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      {/* Left Sidebar (Conversations List) */}
      <aside className="md:col-span-1 border-r border-gray-200 bg-white">
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="p-4" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading conversations...
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer",
                      activeConversation === conversation.id ? "bg-gray-100" : "",
                    )}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{conversation.recipient.name}</p>
                      <p className="text-xs text-gray-500">{conversation.lastMessage.content}</p>
                    </div>
                    {conversation.recipient.isOnline && (
                      <span className="absolute bottom-2 right-2 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )}
                  </div>
                ))}
              </ScrollArea>
            )}
          </TabsContent>
          <TabsContent value="unread" className="mt-2">
            {/* Content for Unread tab */}
            <p className="text-sm text-gray-500">No unread messages.</p>
          </TabsContent>
          <TabsContent value="groups" className="mt-2">
            {/* Content for Groups tab */}
            <p className="text-sm text-gray-500">No groups available.</p>
          </TabsContent>
        </Tabs>
      </aside>

      {/* Main Content (Chat Window) */}
      <main className="md:col-span-3 bg-gray-50 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <Button variant="ghost" size="sm" className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar>
                  <AvatarImage src={conversationContent?.recipient.avatar} alt={conversationContent?.recipient.name} />
                  <AvatarFallback>{conversationContent?.recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{conversationContent?.recipient.name}</p>
                  <div className="flex items-center space-x-2">
                    {conversationContent?.recipient.isOnline ? (
                      <>
                        <span className="block h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-xs text-gray-500">Online</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">Last seen {conversationContent?.recipient.lastActive}</p>
                    )}
                    {conversationContent?.recipient.isTyping && <Badge variant="secondary">Typing...</Badge>}
                  </div>
                </div>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="h-4 w-4 mr-2" />
                      Snooze Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {conversationContent?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex flex-col mb-2", message.isCurrentUser ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-xl",
                        message.isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800",
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAttachmentClick}>
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Attach Image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 rounded-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => {}}>
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSendMessage} disabled={isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <p className="text-lg text-gray-500">Select a conversation to start chatting.</p>
            )}
          </div>
        )}
      </main>

      <input type="file" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileSelect} />
    </div>
  )
}


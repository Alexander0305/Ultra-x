"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Paperclip, ImageIcon, Smile, Send, Phone, Video, MoreHorizontal, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/lib/pusher"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  isCurrentUser: boolean
  attachments?: {
    type: "image" | "file"
    url: string
    name?: string
  }[]
}

interface ChatInterfaceProps {
  conversation: {
    id: string
    recipient: {
      id: string
      name: string
      avatar: string
      isOnline: boolean
      lastActive?: string
    }
  }
  onBack?: () => void
  isMobile?: boolean
}

export default function ChatInterface({ conversation, onBack, isMobile = false }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isRecipientTyping, setIsRecipientTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMessages()

    // Subscribe to real-time updates
    const channel = pusherClient.subscribe(`private-user-${session?.user?.id}`)

    channel.bind("new-message", (data: any) => {
      if (data.conversation === conversation.id) {
        const newMessage: Message = {
          ...data.message,
          isCurrentUser: data.message.sender.id === session?.user?.id,
          createdAt: new Date(data.message.createdAt).toISOString(),
        }

        setMessages((prev) => [...prev, newMessage])
      }
    })

    channel.bind("typing", (data: any) => {
      if (data.conversation === conversation.id && data.user !== session?.user?.id) {
        setIsRecipientTyping(true)

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setIsRecipientTyping(false)
        }, 3000)
      }
    })

    return () => {
      pusherClient.unsubscribe(`private-user-${session?.user?.id}`)
    }
  }, [conversation.id, session?.user?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isRecipientTyping])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/messages?conversationId=${conversation.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()

      // Format messages
      const formattedMessages: Message[] = data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: {
          id: msg.sender.id,
          name: msg.sender.name,
          avatar: msg.sender.avatar,
        },
        createdAt: new Date(msg.createdAt).toISOString(),
        isCurrentUser: msg.sender.id === session?.user?.id,
        attachments: msg.mediaItems.map((media: any) => ({
          type: media.type === "IMAGE" ? "image" : "file",
          url: media.url,
          name: media.filename,
        })),
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError("Failed to load messages. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      setIsSending(true)

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          receiverId: conversation.recipient.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Clear input
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // Send typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    const timeout = setTimeout(async () => {
      try {
        await fetch("/api/messages/typing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversation.id,
            receiverId: conversation.recipient.id,
          }),
        })
      } catch (error) {
        console.error("Error sending typing indicator:", error)
      }
    }, 500)

    setTypingTimeout(timeout)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    try {
      setIsSending(true)

      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "message")

      // Upload file
      const uploadResponse = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const uploadData = await uploadResponse.json()

      // Send message with media
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "",
          receiverId: conversation.recipient.id,
          mediaIds: [uploadData.id],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error sending file:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send file. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
            <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{conversation.recipient.name}</div>
            <div className="text-xs text-muted-foreground">
              {isRecipientTyping ? (
                <span className="text-primary">Typing...</span>
              ) : conversation.recipient.isOnline ? (
                <span className="text-green-500">● Online</span>
              ) : (
                <span>Last active {conversation.recipient.lastActive}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
            <span className="sr-only">Video Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More Options</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">{error}</p>
              <Button onClick={fetchMessages}>Try Again</Button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[80%] ${msg.isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}
            >
              <Avatar className="mt-1">
                <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={`p-3 rounded-lg ${msg.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2">
                    {msg.attachments.map((attachment, index) => (
                      <div key={index} className="mb-2">
                        {attachment.type === "image" ? (
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt="Attachment"
                            className="rounded-md max-w-full max-h-[200px]"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm truncate">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {msg.content && <p>{msg.content}</p>}
                <div
                  className={`text-xs mt-1 ${msg.isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {formatMessageTime(msg.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}

        {isRecipientTyping && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <Avatar className="mt-1">
              <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
              <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce delay-75"></div>
                <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex items-center gap-2 w-full">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Image</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
            <span className="sr-only">Emoji</span>
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!message.trim() || isSending}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


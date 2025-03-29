"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Zap, Clock, Users } from "lucide-react"

type ContentItem = {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
    username: string
  }
  category: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  timestamp: string
  image?: string
}

export function ContentDiscovery() {
  const [activeTab, setActiveTab] = useState("trending")
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      // Mock data
      const mockContent: ContentItem[] = [
        {
          id: "1",
          title: "The Future of AI in Social Networks",
          description: "Exploring how artificial intelligence is reshaping our online social experiences.",
          author: {
            name: "Alex Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "alexj",
          },
          category: "Technology",
          tags: ["AI", "Social Media", "Future"],
          likes: 1243,
          comments: 89,
          shares: 324,
          timestamp: "2 hours ago",
          image: "/placeholder.svg?height=200&width=400",
        },
        {
          id: "2",
          title: "Sustainable Living in Urban Environments",
          description: "Practical tips for reducing your carbon footprint while living in the city.",
          author: {
            name: "Maya Patel",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "mayap",
          },
          category: "Lifestyle",
          tags: ["Sustainability", "Urban Living", "Environment"],
          likes: 876,
          comments: 132,
          shares: 201,
          timestamp: "5 hours ago",
          image: "/placeholder.svg?height=200&width=400",
        },
        {
          id: "3",
          title: "The Rise of Decentralized Finance",
          description: "Understanding the fundamentals of DeFi and its potential impact on traditional banking.",
          author: {
            name: "Sam Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "samw",
          },
          category: "Finance",
          tags: ["DeFi", "Blockchain", "Cryptocurrency"],
          likes: 1567,
          comments: 215,
          shares: 432,
          timestamp: "1 day ago",
          image: "/placeholder.svg?height=200&width=400",
        },
        {
          id: "4",
          title: "Remote Work Revolution: One Year Later",
          description: "Examining how the shift to remote work has changed corporate culture and employee well-being.",
          author: {
            name: "Jordan Lee",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "jordanl",
          },
          category: "Work",
          tags: ["Remote Work", "Corporate Culture", "Productivity"],
          likes: 932,
          comments: 178,
          shares: 267,
          timestamp: "2 days ago",
          image: "/placeholder.svg?height=200&width=400",
        },
      ]

      setContent(mockContent)
      setLoading(false)
    }, 1500)
  }, [activeTab])

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "trending":
        return <TrendingUp className="h-4 w-4 mr-2" />
      case "foryou":
        return <Zap className="h-4 w-4 mr-2" />
      case "recent":
        return <Clock className="h-4 w-4 mr-2" />
      case "following":
        return <Users className="h-4 w-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="trending" className="flex items-center">
            {getTabIcon("trending")}
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="foryou" className="flex items-center">
            {getTabIcon("foryou")}
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center">
            {getTabIcon("recent")}
            <span className="hidden sm:inline">Recent</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center">
            {getTabIcon("following")}
            <span className="hidden sm:inline">Following</span>
          </TabsTrigger>
        </TabsList>

        {["trending", "foryou", "recent", "following"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-6">
            {loading
              ? // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-0">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-[90%] mb-2" />
                      <Skeleton className="h-4 w-[80%] mb-6" />
                      <Skeleton className="h-[200px] w-full rounded-md" />
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <Skeleton className="h-10 w-[100px]" />
                        <Skeleton className="h-10 w-[100px]" />
                        <Skeleton className="h-10 w-[100px]" />
                      </div>
                    </CardFooter>
                  </Card>
                ))
              : // Actual content
                content.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={item.author.avatar} alt={item.author.name} />
                            <AvatarFallback>{item.author.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{item.author.name}</CardTitle>
                            <CardDescription>
                              @{item.author.username} • {item.timestamp}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      {item.image && (
                        <div className="rounded-md overflow-hidden mb-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex justify-between w-full">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{item.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{item.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>{item.shares}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}


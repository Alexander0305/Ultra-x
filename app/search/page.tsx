"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Calendar, ShoppingCart } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  description: string
  type: string
  imageUrl?: string
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const initialQuery = searchParams?.q || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchResults = async () => {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/search?q=${searchQuery}`)
      // const data = await response.json()

      // For now, we'll use mock data
      const mockData: SearchResult[] = [
        {
          id: "1",
          title: "John Doe",
          description: "Software Engineer",
          type: "user",
          imageUrl: "/placeholder.svg?height=50&width=50",
        },
        {
          id: "2",
          title: "Jane Smith",
          description: "Graphic Designer",
          type: "user",
          imageUrl: "/placeholder.svg?height=50&width=50",
        },
        {
          id: "3",
          title: "New Post",
          description: "Check out my new blog post about Next.js",
          type: "post",
        },
        {
          id: "4",
          title: "Summer Event",
          description: "Join us for a summer barbecue",
          type: "event",
        },
        {
          id: "5",
          title: "Awesome Product",
          description: "Buy this awesome product now",
          type: "marketplace",
        },
      ]

      setSearchResults(mockData)
    }

    fetchResults()
  }, [searchQuery])

  const filteredResults = searchResults.filter((result) => {
    if (activeTab === "all") return true
    return result.type === activeTab
  })

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search users, posts, groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="user">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="post">
            <FileText className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="event">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>{result.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Type: {result.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  )
}


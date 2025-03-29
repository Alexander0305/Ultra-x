"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Story {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  image: string
  seen: boolean
}

const SAMPLE_STORIES: Story[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Your Story",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: false,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Alex Chen",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: true,
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Maria Garcia",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: true,
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "James Wilson",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: false,
  },
  {
    id: "6",
    user: {
      id: "user6",
      name: "Emma Davis",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: false,
  },
  {
    id: "7",
    user: {
      id: "user7",
      name: "Michael Brown",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: true,
  },
  {
    id: "8",
    user: {
      id: "user8",
      name: "Sophia Lee",
      avatar: "/placeholder-user.jpg",
    },
    image: "/placeholder.svg",
    seen: false,
  },
]

export default function StoriesCarousel() {
  const [stories, setStories] = useState<Story[]>(SAMPLE_STORIES)
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200
      if (direction === "left") {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateStory = () => {
    if (preview) {
      // In a real app, you would upload the file to a server
      // and get back a URL to use for the story

      // For now, we'll just add it to the local state
      const newStory: Story = {
        id: `new-${Date.now()}`,
        user: {
          id: "user1",
          name: "Your Story",
          avatar: "/placeholder-user.jpg",
        },
        image: preview,
        seen: false,
      }

      // Replace the user's existing story or add a new one
      const updatedStories = stories.filter((story) => story.user.id !== "user1")
      setStories([newStory, ...updatedStories])

      // Reset form
      setSelectedFile(null)
      setPreview(null)
    }
  }

  const openStory = (storyId: string) => {
    setActiveStoryId(storyId)

    // Mark story as seen
    setStories(stories.map((story) => (story.id === storyId ? { ...story, seen: true } : story)))
  }

  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 py-2" ref={carouselRef}>
        {/* Create Story */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="flex-shrink-0 w-28 h-40 rounded-xl overflow-hidden relative cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
              <div className="h-full flex flex-col">
                <div className="h-3/4 bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:scale-110 transition-transform" />
                </div>
                <div className="h-1/4 flex items-center justify-center">
                  <span className="text-xs font-medium">Create Story</span>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-image">Upload Image</Label>
                  <Input id="story-image" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                </div>

                {preview && (
                  <div className="mt-4">
                    <div className="aspect-[9/16] max-h-[300px] rounded-lg overflow-hidden">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Story preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={handleCreateStory} disabled={!selectedFile}>
                  Create Story
                </Button>
              </TabsContent>
              <TabsContent value="text" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-text">Story Text</Label>
                  <textarea
                    id="story-text"
                    className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
                    placeholder="What's on your mind?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500"].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${color}`}
                        aria-label={`Select ${color} background`}
                      />
                    ))}
                  </div>
                </div>

                <Button className="w-full">Create Story</Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Stories */}
        {stories.map((story) => (
          <Card
            key={story.id}
            className="flex-shrink-0 w-28 h-40 rounded-xl overflow-hidden relative cursor-pointer"
            onClick={() => openStory(story.id)}
          >
            <img
              src={story.image || "/placeholder.svg"}
              alt={`${story.user.name}'s story`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
            <div className="absolute top-2 left-2 ring-4 ring-primary rounded-full">
              <Avatar className={`h-9 w-9 border-2 ${story.seen ? "border-muted" : "border-primary"}`}>
                <AvatarImage src={story.user.avatar} alt={story.user.name} />
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs truncate">{story.user.name}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 shadow-sm"
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 shadow-sm"
        onClick={() => handleScroll("right")}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Story Viewer */}
      {activeStoryId && (
        <Dialog open={!!activeStoryId} onOpenChange={(open) => !open && setActiveStoryId(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="relative">
              <div className="aspect-[9/16] bg-black">
                {stories.find((s) => s.id === activeStoryId) && (
                  <img
                    src={stories.find((s) => s.id === activeStoryId)?.image || "/placeholder.svg"}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage
                      src={stories.find((s) => s.id === activeStoryId)?.user.avatar}
                      alt={stories.find((s) => s.id === activeStoryId)?.user.name}
                    />
                    <AvatarFallback>{stories.find((s) => s.id === activeStoryId)?.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-medium">
                    {stories.find((s) => s.id === activeStoryId)?.user.name}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setActiveStoryId(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute top-0 left-0 right-0 flex gap-1 p-1">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className={`h-1 flex-1 rounded-full ${story.id === activeStoryId ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


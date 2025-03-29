"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Video, Smile, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePost() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()

  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async () => {
    if (!content.trim() && images.length === 0) {
      toast({
        title: "Cannot post empty content",
        description: "Please add some text or an image to your post.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, images }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      })

      setContent("")
      setImages([])
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Upload the image to Vercel Blob
    const formData = new FormData()
    formData.append("file", file)

    fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.url) {
          setImages([...images, data.url])
        } else {
          toast({
            variant: "destructive",
            title: "Error uploading image",
            description: "There was an error uploading your image. Please try again.",
          })
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error)
        toast({
          variant: "destructive",
          title: "Error uploading image",
          description: "There was an error uploading your image. Please try again.",
        })
      })
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image as string} alt={session?.user?.name as string} />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[80px] resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-9 gap-1">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Photo</span>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAddImage}
                    />
                  </label>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 gap-1">
                  <Video className="h-4 w-4 text-secondary" />
                  <span>Video</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 gap-1">
                  <Smile className="h-4 w-4 text-warning" />
                  <span>Feeling</span>
                </Button>
              </div>
              <Button size="sm" className="h-9" onClick={handleCreatePost} disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 bg-background/50 backdrop-blur-sm"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import PostCard from "@/components/post/post-card"
import CreatePost from "@/components/post/create-post"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Post {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
    verified?: boolean
  }
  mediaItems: {
    id: string
    url: string
    type: string
  }[]
  likesCount: number
  commentsCount: number
  isLiked: boolean
  isSaved: boolean
}

export default function NewsFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("foryou")
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [newPostsAvailable, setNewPostsAvailable] = useState(false)
  const { toast } = useToast()

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const fetchPosts = async (cursor?: string, replace = false) => {
    try {
      setIsLoadingMore(!replace)

      const url = new URL("/api/posts", window.location.origin)
      if (cursor) url.searchParams.append("cursor", cursor)
      url.searchParams.append("limit", "10")
      if (activeTab === "following") url.searchParams.append("following", "true")

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()

      if (replace) {
        setPosts(data.posts)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
      }

      setNextCursor(data.nextCursor)
      setHasMore(!!data.nextCursor)
      setNewPostsAvailable(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setPosts([])
    setNextCursor(null)
    setHasMore(true)
    fetchPosts(undefined, true)

    // Set up polling for new posts
    const interval = setInterval(() => {
      checkForNewPosts()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isLoadingMore) {
      fetchPosts(nextCursor)
    }
  }, [inView, hasMore, isLoading, isLoadingMore])

  const checkForNewPosts = async () => {
    try {
      const url = new URL("/api/posts/check-new", window.location.origin)
      if (posts.length > 0) {
        url.searchParams.append("since", posts[0].id)
      }
      if (activeTab === "following") url.searchParams.append("following", "true")

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error("Failed to check for new posts")
      }

      const data = await response.json()

      if (data.hasNewPosts) {
        setNewPostsAvailable(true)
      }
    } catch (error) {
      console.error("Error checking for new posts:", error)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setPosts([])
    setNextCursor(null)
    setHasMore(true)
    fetchPosts(undefined, true)
  }

  const handleNewPost = (post: Post) => {
    setPosts((prev) => [post, ...prev])
  }

  const handleLike = async (postId: string, liked: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: liked,
              likesCount: liked ? post.likesCount + 1 : post.likesCount - 1,
            }
          : post,
      ),
    )

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: liked ? "POST" : "DELETE",
      })

      if (!response.ok) {
        // Revert on error
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !liked,
                  likesCount: !liked ? post.likesCount + 1 : post.likesCount - 1,
                }
              : post,
          ),
        )
        throw new Error("Failed to update like status")
      }
    } catch (error) {
      console.error("Error updating like:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again.",
      })
    }
  }

  const handleSave = async (postId: string, saved: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isSaved: saved,
            }
          : post,
      ),
    )

    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: saved ? "POST" : "DELETE",
      })

      if (!response.ok) {
        // Revert on error
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isSaved: !saved,
                }
              : post,
          ),
        )
        throw new Error("Failed to update save status")
      }
    } catch (error) {
      console.error("Error updating save:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update save status. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <CreatePost onPostCreated={handleNewPost} />

      {newPostsAvailable && (
        <Button variant="outline" className="w-full" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          New posts available
        </Button>
      )}

      <Tabs defaultValue="foryou" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="foryou">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="foryou" className="space-y-4 mt-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full rounded-md" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
            </Card>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    name: post.author.name,
                    username: post.author.username,
                    avatar: post.author.avatar,
                    verified: post.author.verified,
                  }}
                  content={post.content}
                  images={post.mediaItems.filter((media) => media.type === "IMAGE").map((media) => media.url)}
                  video={post.mediaItems.find((media) => media.type === "VIDEO")?.url}
                  createdAt={new Date(post.createdAt).toLocaleString()}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  shares={0}
                  hasLiked={post.isLiked}
                  hasBookmarked={post.isSaved}
                  onLike={(liked) => handleLike(post.id, liked)}
                  onBookmark={(saved) => handleSave(post.id, saved)}
                />
              ))}

              {hasMore && (
                <div ref={ref} className="py-4 flex justify-center">
                  {isLoadingMore && (
                    <div className="space-y-4 w-full">
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-32 w-full rounded-md" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="following" className="space-y-4 mt-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full rounded-md" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Follow more people</h3>
              <p className="text-muted-foreground mb-4">When you follow people, you'll see their posts here.</p>
              <Button>Discover People</Button>
            </Card>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    name: post.author.name,
                    username: post.author.username,
                    avatar: post.author.avatar,
                    verified: post.author.verified,
                  }}
                  content={post.content}
                  images={post.mediaItems.filter((media) => media.type === "IMAGE").map((media) => media.url)}
                  video={post.mediaItems.find((media) => media.type === "VIDEO")?.url}
                  createdAt={new Date(post.createdAt).toLocaleString()}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  shares={0}
                  hasLiked={post.isLiked}
                  hasBookmarked={post.isSaved}
                  onLike={(liked) => handleLike(post.id, liked)}
                  onBookmark={(saved) => handleSave(post.id, saved)}
                />
              ))}

              {hasMore && (
                <div ref={ref} className="py-4 flex justify-center">
                  {isLoadingMore && (
                    <div className="space-y-4 w-full">
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-32 w-full rounded-md" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


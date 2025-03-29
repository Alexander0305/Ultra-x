"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  MoreHorizontal,
  Bookmark,
  Flag,
  UserMinus,
  Copy,
  Send,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface PostCardProps {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    verified?: boolean
  }
  content: string
  images?: string[]
  video?: string
  createdAt: string
  likes: number
  comments: number
  shares: number
  hasLiked?: boolean
  hasBookmarked?: boolean
  onLike?: (liked: boolean) => void
  onBookmark?: (bookmarked: boolean) => void
}

export default function PostCard({
  id,
  author,
  content,
  images,
  video,
  createdAt,
  likes,
  comments,
  shares,
  hasLiked = false,
  hasBookmarked = false,
  onLike,
  onBookmark,
}: PostCardProps) {
  const [liked, setLiked] = useState(hasLiked)
  const [likesCount, setLikesCount] = useState(likes)
  const [bookmarked, setBookmarked] = useState(hasBookmarked)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [postComments, setPostComments] = useState<any[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const { toast } = useToast()

  const handleLike = () => {
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1)
    onLike?.(newLikedState)
  }

  const handleBookmark = () => {
    const newBookmarkedState = !bookmarked
    setBookmarked(newBookmarkedState)
    onBookmark?.(newBookmarkedState)
  }

  const handleComment = async () => {
    setShowComments(!showComments)

    if (!showComments && comments > 0 && postComments.length === 0) {
      try {
        setIsLoadingComments(true)
        const response = await fetch(`/api/posts/${id}/comments`)

        if (!response.ok) {
          throw new Error("Failed to fetch comments")
        }

        const data = await response.json()
        setPostComments(data.comments)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load comments. Please try again.",
        })
      } finally {
        setIsLoadingComments(false)
      }
    }
  }

  const submitComment = async () => {
    if (!commentText.trim()) return

    try {
      setIsSubmittingComment(true)

      const response = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      const data = await response.json()

      // Add the new comment to the list
      setPostComments([data, ...postComments])
      setCommentText("")

      // Update comment count
      // This is handled optimistically
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit comment. Please try again.",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const copyPostLink = () => {
    const url = `${window.location.origin}/posts/${id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    })
  }

  const formatContent = (text: string) => {
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withLinks = text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`,
    )

    // Convert hashtags
    const hashtagRegex = /#(\w+)/g
    const withHashtags = withLinks.replace(
      hashtagRegex,
      '<a href="/hashtag/$1" class="text-primary hover:underline">#$1</a>',
    )

    // Convert mentions
    const mentionRegex = /@(\w+)/g
    const withMentions = withHashtags.replace(
      mentionRegex,
      '<a href="/profile/$1" class="text-primary hover:underline">@$1</a>',
    )

    return withMentions
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Link href={`/profile/${author.username}`} className="flex gap-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>
                {author.name.charAt(0)}
                {author.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold flex items-center gap-1">
                {author.name}
                {author.verified && (
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-primary rounded-full">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{createdAt}</div>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                {bookmarked ? "Remove bookmark" : "Bookmark post"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyPostLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserMinus className="h-4 w-4 mr-2" />
                Unfollow @{author.username}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mb-3 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />

        {images && images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="rounded-lg w-full object-cover"
                style={{ maxHeight: images.length > 1 ? "200px" : "400px" }}
              />
            ))}
          </div>
        )}

        {video && (
          <div className="rounded-lg overflow-hidden mb-3">
            <video src={video} controls className="w-full" poster="/placeholder.svg" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className={`gap-2 ${liked ? "text-red-500" : ""}`} onClick={handleLike}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleComment}>
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Repeat2 className="h-4 w-4" />
            <span>{shares}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 w-full space-y-4">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Your Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[60px] flex-1"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  size="icon"
                  className="h-8 w-8 self-end"
                  disabled={!commentText.trim() || isSubmittingComment}
                  onClick={submitComment}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {isLoadingComments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading comments...</p>
                </div>
              ) : postComments.length > 0 ? (
                postComments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="font-medium text-sm">{comment.author.name}</div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <button className="hover:text-foreground">Like</button>
                        <button className="hover:text-foreground">Reply</button>
                        <span>
                          {new Date(comment.createdAt).toLocaleString(undefined, {
                            hour: "numeric",
                            minute: "numeric",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {comments > postComments.length && (
              <Button variant="ghost" size="sm" className="w-full text-primary">
                View all {comments} comments
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}


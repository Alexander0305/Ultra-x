import FuturisticLayout from "@/components/layout/futuristic-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ImageIcon,
  Video,
  Smile,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <FuturisticLayout>
      <div className="grid grid-cols-1 gap-6">
        {/* Create Post Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[80px] resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-base"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-9 gap-1">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span>Photo</span>
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
                  <Button size="sm" className="h-9">
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Section */}
        <div className="relative">
          <h2 className="text-xl font-heading font-bold mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Stories
            <Button variant="ghost" size="sm" className="ml-auto">
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="relative group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt={`Story ${i + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-medium truncate">User Name</p>
                  <p className="text-white/70 text-xs">2h ago</p>
                </div>
                <div className="absolute top-3 left-3 ring-2 ring-primary p-0.5 rounded-full bg-background">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed Tabs */}
        <Tabs defaultValue="foryou" className="mt-2">
          <TabsList className="grid w-full grid-cols-2 h-11">
            <TabsTrigger
              value="foryou"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foryou" className="mt-4 space-y-4">
            {/* Post 1 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        Sarah Johnson
                        <Badge variant="outline" className="ml-2 text-xs font-normal py-0 h-5">
                          <Sparkles className="h-3 w-3 mr-1 text-primary" />
                          Verified
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">2 hours ago</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        width="15"
                        height="3"
                        viewBox="0 0 15 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-foreground"
                      >
                        <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                        <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                        <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <p className="mb-3">
                  Just finished my latest design project! So excited to share it with everyone. What do you think?
                </p>
                <div className="rounded-xl overflow-hidden mb-2">
                  <img src="/placeholder.svg" alt="Post image" className="w-full h-auto" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Heart className="h-4 w-4" />
                      <span>124</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>32</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>8</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Post 2 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="Tech Community" />
                  <AvatarFallback>TC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Tech Community</CardTitle>
                      <CardDescription className="text-xs">5 hours ago</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        width="15"
                        height="3"
                        viewBox="0 0 15 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-foreground"
                      >
                        <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                        <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                        <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <p className="mb-3">
                  We're hosting a virtual meetup next week on the future of AI in web development. Join us for an
                  insightful discussion with industry experts!
                </p>
                <div className="bg-muted rounded-xl p-4 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">March 15, 2024 • 7:00 PM EST</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Zoom (link will be shared with registered attendees)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>42 people going</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Heart className="h-4 w-4" />
                      <span>89</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>14</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>5</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    Interested
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Post 3 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="Alex Chen" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Alex Chen</CardTitle>
                      <CardDescription className="text-xs">Yesterday</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        width="15"
                        height="3"
                        viewBox="0 0 15 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-foreground"
                      >
                        <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                        <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                        <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <p className="mb-3">Check out this amazing sunset I captured yesterday! 🌅 #photography #nature</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="rounded-xl overflow-hidden">
                    <img src="/placeholder.svg" alt="Sunset 1" className="w-full h-full object-cover aspect-square" />
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img src="/placeholder.svg" alt="Sunset 2" className="w-full h-full object-cover aspect-square" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Heart className="h-4 w-4" />
                      <span>215</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>42</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>18</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Follow more people</h3>
                <p className="text-muted-foreground mb-4">When you follow people, you'll see their posts here.</p>
                <Button>Discover People</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FuturisticLayout>
  )
}


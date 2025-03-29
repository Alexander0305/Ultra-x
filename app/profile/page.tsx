import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bell,
  Home,
  MessageSquare,
  Search,
  Users,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Smile,
  MapPin,
  Mail,
  LinkIcon,
  MapPinIcon,
  Briefcase,
  Cake,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SN</span>
              </div>
              <span className="font-bold text-xl hidden md:inline-block">SocialNet</span>
            </Link>
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-9 w-[300px] pl-8"
              />
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/" className="p-2 text-muted-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
            <Link href="/messages" className="p-2 text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Link>
            <Link href="/notifications" className="p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
            <Link href="/friends" className="p-2 text-muted-foreground hover:text-foreground">
              <Users className="h-5 w-5" />
              <span className="sr-only">Friends</span>
            </Link>
            <Link href="/profile" className="ml-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 w-full"></div>
        <div className="container relative">
          <div className="absolute -bottom-16 flex items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src="/placeholder-user.jpg" alt="John Doe" />
              <AvatarFallback className="text-4xl">JD</AvatarFallback>
            </Avatar>
            <div className="mb-4">
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-muted-foreground">@johndoe</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container pt-20 pb-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  UI/UX Designer and Frontend Developer passionate about creating beautiful and functional user
                  experiences.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Designer at Creative Agency</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a href="#" className="text-primary hover:underline">
                      johndoe.design
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Cake className="h-4 w-4 text-muted-foreground" />
                    <span>Joined January 2020</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Photos
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Friends</CardTitle>
                <CardDescription>428 friends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src="/placeholder-user.jpg" alt={`Friend ${i}`} />
                        <AvatarFallback>F{i}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs mt-1 text-center truncate w-full">Friend {i}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Friends
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Posts and Activity */}
          <div className="md:w-2/3">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="space-y-4 mt-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="rounded-full bg-muted px-4 py-2 cursor-pointer hover:bg-muted/80">
                          What's on your mind, John?
                        </div>
                        <div className="flex justify-between mt-3">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Image className="h-4 w-4" />
                            <span>Photo</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Location</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Smile className="h-4 w-4" />
                            <span>Feeling</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" alt="John Doe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">John Doe</div>
                          <div className="text-sm text-muted-foreground">Yesterday at 3:45 PM</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-3">
                      Just finished my latest UI design project! Really happy with how the dashboard turned out.
                    </p>
                    <div className="rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      <span>87</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>14</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" alt="John Doe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">John Doe</div>
                          <div className="text-sm text-muted-foreground">Last week</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p>
                      Excited to announce that I'll be speaking at the upcoming Design Conference next month! Who else
                      is attending?
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      <span>124</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>32</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About John Doe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p>
                        UI/UX Designer and Frontend Developer with over 5 years of experience creating beautiful and
                        functional user experiences. Passionate about design systems, accessibility, and user-centered
                        design.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Work</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">Senior UI Designer</div>
                          <div className="text-sm text-muted-foreground">Creative Agency • 2020 - Present</div>
                        </div>
                        <div>
                          <div className="font-medium">UI/UX Designer</div>
                          <div className="text-sm text-muted-foreground">Tech Solutions Inc. • 2018 - 2020</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Education</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">Master's in Interaction Design</div>
                          <div className="text-sm text-muted-foreground">Design University • 2016 - 2018</div>
                        </div>
                        <div>
                          <div className="font-medium">Bachelor's in Graphic Design</div>
                          <div className="text-sm text-muted-foreground">Art Institute • 2012 - 2016</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>john.doe@example.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <a href="#" className="text-primary hover:underline">
                            johndoe.design
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="friends" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Friends</CardTitle>
                    <CardDescription>You have 428 friends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="/placeholder-user.jpg" alt={`Friend ${i + 1}`} />
                            <AvatarFallback>F{i + 1}</AvatarFallback>
                          </Avatar>
                          <div className="mt-2 text-center">
                            <div className="font-medium">Friend {i + 1}</div>
                            <div className="text-xs text-muted-foreground">42 mutual friends</div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Users className="h-3 w-3 mr-1" />
                            Friends
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Friends
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="photos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Photos</CardTitle>
                    <CardDescription>Your uploaded photos and tagged images</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden"
                        >
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Photos
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}


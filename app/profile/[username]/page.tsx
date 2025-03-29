import FuturisticLayout from "@/components/layout/futuristic-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Briefcase,
  Calendar,
  LinkIcon,
  Mail,
  Edit,
  UserPlus,
  MessageSquare,
  Users,
  Sparkles,
  LayoutGrid,
  ListFilter,
  BookOpen,
  Award,
  Heart,
  Star,
} from "lucide-react"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, you would fetch user data based on the username
  const user = {
    id: "user1",
    name: "John Doe",
    username: params.username,
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    bio: "UI/UX Designer and Frontend Developer passionate about creating beautiful and functional user experiences.",
    location: "San Francisco, CA",
    website: "https://johndoe.design",
    occupation: "Senior UI Designer at Creative Agency",
    joinDate: "January 2020",
    email: "john.doe@example.com",
    isVerified: true,
    isCurrentUser: params.username === "johndoe",
    isFriend: false,
    mutualFriends: 5,
    stats: {
      posts: 42,
      friends: 428,
      photos: 156,
    },
    badges: [
      { name: "Early Adopter", icon: Sparkles, color: "text-primary" },
      { name: "Top Contributor", icon: Award, color: "text-warning" },
      { name: "Trendsetter", icon: Star, color: "text-secondary" },
    ],
  }

  return (
    <FuturisticLayout showRightSidebar={false}>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-60 rounded-xl overflow-hidden bg-muted">
            <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            {user.isCurrentUser && (
              <Button
                size="icon"
                className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Change cover</span>
              </Button>
            )}
          </div>

          <div className="absolute -bottom-16 left-6 flex items-end">
            <div className="relative">
              <div className="h-32 w-32 rounded-full ring-4 ring-background overflow-hidden">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0)}
                    {user.name.split(" ")[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {user.isCurrentUser && (
                <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary">
                  <Edit className="h-4 w-4 text-primary-foreground" />
                  <span className="sr-only">Change avatar</span>
                </Button>
              )}
              {user.isVerified && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <Card className="mt-20 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                {user.name}
                {user.isVerified && (
                  <Badge variant="outline" className="ml-2 text-xs font-normal py-0 h-5">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground">@{user.username}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {user.badges.map((badge, index) => {
                  const Icon = badge.icon
                  return (
                    <Badge key={index} variant="outline" className={`${badge.color} border-current/20 bg-current/10`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {badge.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-2">
              {user.isCurrentUser ? (
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  {user.isFriend ? (
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Friends
                    </Button>
                  ) : (
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </Button>
                  )}
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6 justify-between">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{user.stats.posts}</span>
                <span className="text-sm text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{user.stats.friends}</span>
                <span className="text-sm text-muted-foreground">Friends</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{user.stats.photos}</span>
                <span className="text-sm text-muted-foreground">Photos</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="mb-4">{user.bio}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.occupation && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <span>{user.occupation}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/10">
                      <MapPin className="h-4 w-4 text-secondary" />
                    </div>
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                      <LinkIcon className="h-4 w-4 text-accent" />
                    </div>
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-warning/10">
                    <Calendar className="h-4 w-4 text-warning" />
                  </div>
                  <span>Joined {user.joinDate}</span>
                </div>
                {user.email && user.isCurrentUser && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10">
                      <Mail className="h-4 w-4 text-destructive" />
                    </div>
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts">
          <div className="flex items-center justify-between mb-2">
            <TabsList className="h-11">
              <TabsTrigger
                value="posts"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Photos
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <ListFilter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="posts" className="space-y-4 mt-2">
            {/* Posts will be rendered here */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 pb-0 flex flex-row items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0)}
                    {user.name.split(" ")[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {user.name}
                        {user.isVerified && (
                          <Badge variant="outline" className="ml-2 text-xs font-normal py-0 h-5">
                            <Sparkles className="h-3 w-3 mr-1 text-primary" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">Yesterday at 3:45 PM</p>
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
                  Just finished my latest UI design project! Really happy with how the dashboard turned out.
                </p>
                <div className="rounded-xl overflow-hidden mb-2">
                  <img src="/placeholder.svg" alt="Post image" className="w-full h-auto" />
                </div>
              </CardContent>
              <div className="px-4 pb-4 flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Heart className="h-4 w-4" />
                    <span>87</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>14</span>
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">About {user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Bio
                  </h4>
                  <p>{user.bio}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                    Work
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">Senior UI Designer</div>
                      <div className="text-sm text-muted-foreground">Creative Agency • 2020 - Present</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">UI/UX Designer</div>
                      <div className="text-sm text-muted-foreground">Tech Solutions Inc. • 2018 - 2020</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-primary" />
                    Education
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">Master's in Interaction Design</div>
                      <div className="text-sm text-muted-foreground">Design University • 2016 - 2018</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">Bachelor's in Graphic Design</div>
                      <div className="text-sm text-muted-foreground">Art Institute • 2012 - 2016</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends" className="mt-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Friends</CardTitle>
                <p className="text-muted-foreground">{user.stats.friends} friends</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src="/placeholder-user.jpg" alt={`Friend ${i + 1}`} />
                        <AvatarFallback>F{i + 1}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="font-medium">Friend {i + 1}</div>
                        <div className="text-xs text-muted-foreground">42 mutual friends</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Friends
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="mt-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Photos</CardTitle>
                <p className="text-muted-foreground">{user.stats.photos} photos</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden"
                    >
                      <img src="/placeholder.svg" alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Photos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FuturisticLayout>
  )
}


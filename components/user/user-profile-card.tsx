import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Briefcase,
  Calendar,
  LinkIcon,
  Mail,
  Globe,
  Users,
  ImageIcon,
  Edit,
  UserPlus,
  MessageSquare,
} from "lucide-react"

interface UserProfileCardProps {
  user: {
    id: string
    name: string
    username: string
    avatar: string
    coverImage: string
    bio: string
    location?: string
    website?: string
    occupation?: string
    joinDate: string
    email?: string
    isVerified?: boolean
    isCurrentUser?: boolean
    isFriend?: boolean
    mutualFriends?: number
    stats: {
      posts: number
      friends: number
      photos: number
    }
  }
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-muted overflow-hidden rounded-t-lg">
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
          {user.isCurrentUser && (
            <Button size="icon" className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Change cover</span>
            </Button>
          )}
        </div>
        <div className="absolute -bottom-16 left-4 flex items-end">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0)}
                {user.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user.isCurrentUser && (
              <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary">
                <Edit className="h-4 w-4 text-primary-foreground" />
                <span className="sr-only">Change avatar</span>
              </Button>
            )}
            {user.isVerified && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <Card className="mt-16">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {user.name}
              {user.isVerified && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-primary rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>
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
          <div className="flex flex-wrap gap-4 justify-between">
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

          <div className="pt-4 border-t">
            <p className="mb-4">{user.bio}</p>
            <div className="space-y-2">
              {user.occupation && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{user.occupation}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user.joinDate}</span>
              </div>
              {user.email && user.isCurrentUser && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>Public Profile</span>
          </div>
          {!user.isCurrentUser && user.mutualFriends && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{user.mutualFriends} mutual friends</span>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4 mt-6">
          {/* Posts will be rendered here */}
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No posts to show yet</p>
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About {user.name}</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p>{user.bio}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Work</h4>
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
                <h4 className="font-medium mb-2">Education</h4>
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
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="friends" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Friends</h3>
              <p className="text-muted-foreground">{user.stats.friends} friends</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-user.jpg" alt={`Friend ${i + 1}`} />
                      <AvatarFallback>F{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="mt-2 text-center">
                      <div className="font-medium">Friend {i + 1}</div>
                      <div className="text-xs text-muted-foreground">42 mutual friends</div>
                    </div>
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
              <h3 className="text-lg font-semibold">Photos</h3>
              <p className="text-muted-foreground">{user.stats.photos} photos</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden"
                  >
                    <img src="/placeholder.svg" alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
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
  )
}


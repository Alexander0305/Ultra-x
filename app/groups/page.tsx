import MainLayout from "@/components/layout/main-layout"
import GroupCard from "@/components/groups/group-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search } from "lucide-react"

// Sample data
const groups = [
  {
    id: "group1",
    name: "UI/UX Designers",
    description: "A community for UI/UX designers to share work, get feedback, and discuss design trends.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 3200,
    privacy: "public" as const,
    category: "Design",
    isJoined: false,
  },
  {
    id: "group2",
    name: "JavaScript Developers",
    description: "For JavaScript developers to share knowledge, ask questions, and collaborate on projects.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 5700,
    privacy: "public" as const,
    category: "Programming",
    isJoined: false,
  },
  {
    id: "group3",
    name: "Digital Marketing Pros",
    description: "A private group for marketing professionals to discuss strategies, tools, and industry trends.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 1800,
    privacy: "private" as const,
    category: "Marketing",
    isJoined: false,
  },
  {
    id: "group4",
    name: "Photography Enthusiasts",
    description: "Share your photography, get feedback, and learn new techniques from fellow photographers.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 4300,
    privacy: "public" as const,
    category: "Photography",
    isJoined: true,
  },
]

const myGroups = [
  {
    id: "mygroup1",
    name: "Design Community",
    description: "A community for designers to share work, get feedback, and discuss design trends.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 1200,
    privacy: "public" as const,
    category: "Design",
    isJoined: true,
  },
  {
    id: "mygroup2",
    name: "Tech Enthusiasts",
    description: "Discuss the latest tech news, gadgets, and innovations with fellow tech enthusiasts.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 3500,
    privacy: "public" as const,
    category: "Technology",
    isJoined: true,
  },
  {
    id: "mygroup3",
    name: "Photography Club",
    description: "Share your photography, get feedback, and learn new techniques from fellow photographers.",
    avatar: "/placeholder-user.jpg",
    coverImage: "/placeholder.svg",
    memberCount: 845,
    privacy: "private" as const,
    category: "Photography",
    isJoined: true,
  },
]

export default function GroupsPage() {
  return (
    <MainLayout showRightSidebar={false}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search groups..." className="pl-8" />
      </div>

      <Tabs defaultValue="discover" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
        <TabsContent value="discover" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          <Button variant="outline" className="w-full">
            Load More Groups
          </Button>
        </TabsContent>
        <TabsContent value="my-groups" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="invites" className="mt-6">
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-rose-100 flex items-center justify-center">
                  <span className="text-rose-600 font-bold text-lg">FM</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">Fitness Motivation</h3>
                      <p className="text-sm text-muted-foreground">Invited by Sarah Johnson • 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Accept</Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    A group dedicated to fitness motivation, workout tips, and healthy lifestyle choices.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">2.4k members • 15 posts/day</div>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">BD</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">Book Discussion Club</h3>
                      <p className="text-sm text-muted-foreground">Invited by Alex Chen • 1 week ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Accept</Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    A group for book lovers to discuss their favorite reads, share recommendations, and explore new
                    genres.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">1.8k members • 8 posts/day</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}


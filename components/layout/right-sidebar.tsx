import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">#WebDevelopment</div>
            <div className="text-sm font-medium">1.2K posts</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">#AITechnology</div>
            <div className="text-sm font-medium">856 posts</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">#DigitalNomad</div>
            <div className="text-sm font-medium">643 posts</div>
          </div>
        </CardContent>
      </Card>

      {/* Friend Suggestions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">People You May Know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Alex Chen" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Alex Chen</div>
                <div className="text-sm text-muted-foreground">5 mutual friends</div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Maria Garcia" />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Maria Garcia</div>
                <div className="text-sm text-muted-foreground">3 mutual friends</div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="James Wilson" />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">James Wilson</div>
                <div className="text-sm text-muted-foreground">8 mutual friends</div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full">
            See More
          </Button>
        </CardFooter>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="font-medium">Web Development Workshop</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>Tomorrow, 6:00 PM</span>
            </div>
          </div>
          <div>
            <div className="font-medium">Design Meetup</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>March 18, 7:30 PM</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full">
            View All Events
          </Button>
        </CardFooter>
      </Card>

      {/* Active Now */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Now</CardTitle>
          <CardDescription>Friends currently online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Sarah Johnson" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
            </div>
            <div>
              <div className="font-medium">Sarah Johnson</div>
              <div className="text-xs text-muted-foreground">Active now</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="David Kim" />
                <AvatarFallback>DK</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
            </div>
            <div>
              <div className="font-medium">David Kim</div>
              <div className="text-xs text-muted-foreground">Active now</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Emily Davis" />
                <AvatarFallback>ED</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
            </div>
            <div>
              <div className="font-medium">Emily Davis</div>
              <div className="text-xs text-muted-foreground">Active now</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}


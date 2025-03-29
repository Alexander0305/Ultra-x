import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  ShoppingBag,
  Calendar,
  Video,
  ImageIcon,
  PlusCircle,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col gap-4 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pb-6">
      <div className="flex flex-col gap-1">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="font-medium">John Doe</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/friends" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Users className="h-5 w-5" />
          <span>Friends</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Link>
        <Link href="/notifications" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </Link>
        <Link href="/bookmarks" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Bookmark className="h-5 w-5" />
          <span>Bookmarks</span>
        </Link>
        <Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <ShoppingBag className="h-5 w-5" />
          <span>Marketplace</span>
        </Link>
        <Link href="/events" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Calendar className="h-5 w-5" />
          <span>Events</span>
        </Link>
        <Link href="/videos" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <Video className="h-5 w-5" />
          <span>Videos</span>
        </Link>
        <Link href="/photos" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
          <ImageIcon className="h-5 w-5" />
          <span>Photos</span>
        </Link>
      </div>

      <div className="border-t pt-4 mt-2">
        <h3 className="font-semibold mb-2 px-2">Your Groups</h3>
        <div className="flex flex-col gap-1">
          <Link href="/groups/design" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">D</span>
            </div>
            <span>Design Community</span>
          </Link>
          <Link href="/groups/tech" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-medium text-sm">T</span>
            </div>
            <span>Tech Enthusiasts</span>
          </Link>
          <Link href="/groups/photography" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-medium text-sm">P</span>
            </div>
            <span>Photography Club</span>
          </Link>
          <Link href="/groups/all" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-primary">
            <PlusCircle className="h-5 w-5" />
            <span>Discover More Groups</span>
          </Link>
        </div>
      </div>

      <div className="border-t pt-4 mt-2">
        <h3 className="font-semibold mb-2 px-2">Your Pages</h3>
        <div className="flex flex-col gap-1">
          <Link href="/pages/business" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-medium text-sm">B</span>
            </div>
            <span>Business Solutions</span>
          </Link>
          <Link href="/pages/creative" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-medium text-sm">C</span>
            </div>
            <span>Creative Studio</span>
          </Link>
          <Link href="/pages/create" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-primary">
            <PlusCircle className="h-5 w-5" />
            <span>Create New Page</span>
          </Link>
        </div>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="flex flex-col gap-1">
          <Link href="/settings" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link href="/help" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>
          <Link href="/auth/login" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
        <div className="text-xs text-muted-foreground mt-4 px-2">
          <div className="flex flex-wrap gap-x-2">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/advertising" className="hover:underline">
              Advertising
            </Link>
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
          </div>
          <p className="mt-2">© 2024 SocialNet. All rights reserved.</p>
        </div>
      </div>
    </aside>
  )
}


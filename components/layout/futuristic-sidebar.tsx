"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import {
  Home,
  Users,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Bell,
  Bookmark,
  ChevronRight,
  PanelLeft,
  Sparkles,
  Zap,
  Trophy,
  Heart,
  Star,
  Compass,
  TrendingUp,
  Video,
  Music,
  Image,
  FileText,
  Hash,
} from "lucide-react"
import { motion } from "framer-motion"

interface FuturisticSidebarProps {
  className?: string
}

export function FuturisticSidebar({ className }: FuturisticSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const mainNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { icon: Bell },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    {
      name: "Events",
      href: "/events",
      icon: Calendar,
    },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  ]

  const exploreNavItems = [
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Music", href: "/music", icon: Music },
    { name: "Photos", href: "/photos", icon: Image },
    { name: "Articles", href: "/articles", icon: FileText },
    { name: "Hashtags", href: "/hashtags", icon: Hash },
  ]

  const groupsNavItems = [
    { name: "Tech Enthusiasts", href: "/groups/tech", image: "/placeholder-user.jpg" },
    { name: "Digital Artists", href: "/groups/art", image: "/placeholder-user.jpg" },
    { name: "Travel Addicts", href: "/groups/travel", image: "/placeholder-user.jpg" },
    { name: "Fitness Motivation", href: "/groups/fitness", image: "/placeholder-user.jpg" },
    { name: "Book Club", href: "/groups/books", image: "/placeholder-user.jpg" },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[280px]",
        "pt-20", // Space for header
        className,
      )}
    >
      <div className="absolute right-0 top-24 -mr-3">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full border border-border bg-background"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        {session && !collapsed && (
          <div className="mb-6 mt-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
            >
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={session.user?.image as string} alt={session.user?.name as string} />
                <AvatarFallback className="bg-primary/10 text-primary">{session.user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground">View your profile</span>
              </div>
            </Link>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className={cn("px-3 text-xs font-semibold text-muted-foreground mb-2", collapsed && "sr-only")}>
              Main
            </h3>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {!collapsed && <span className="font-medium">{item.name}</span>}
                    {!collapsed && isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="ml-auto h-2 w-2 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {!collapsed && (
            <div>
              <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2">Explore</h3>
              <nav className="space-y-1">
                {exploreNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator-explore"
                          className="ml-auto h-2 w-2 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}

          {!collapsed && (
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground">Your Groups</h3>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <nav className="space-y-1">
                {groupsNavItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator-groups"
                          className="ml-auto h-2 w-2 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}

          {!collapsed && (
            <div className="px-3 py-4">
              <div className="rounded-lg border border-border/50 bg-card p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Premium Features</h4>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlock advanced features and get more out of your social experience.
                </p>
                <Button size="sm" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-border/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground">Your Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Trophy className="h-4 w-4 text-warning mb-1" />
              <span className="text-xs font-medium">Level 5</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Heart className="h-4 w-4 text-destructive mb-1" />
              <span className="text-xs font-medium">142</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Star className="h-4 w-4 text-warning mb-1" />
              <span className="text-xs font-medium">23</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


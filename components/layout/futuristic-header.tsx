"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import {
  Search,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Bell,
  MessageSquare,
  Menu,
  X,
  Home,
  Users,
  ShoppingBag,
  Calendar,
  Sparkles,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface FuturisticHeaderProps {
  className?: string
}

export function FuturisticHeader({ className }: FuturisticHeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [messageCount, setMessageCount] = useState(2)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Groups", href: "/groups", icon: Users },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-2" : "bg-transparent py-4",
        className,
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-glow"></div>
              <div className="absolute inset-[2px] bg-background rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </div>
            <span className="font-heading text-xl font-bold gradient-text">SocialNet</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, posts, groups..."
              className="pl-10 pr-4 bg-muted/50 border-muted focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/messages">
              <MessageSquare className="h-5 w-5" />
              {messageCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {messageCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Dark Mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={session?.user?.image as string} alt={session?.user?.name as string} />
                    <AvatarFallback className="bg-primary/10 text-primary">{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image as string} alt={session?.user?.name as string} />
                    <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm p-4">
          <div className="flex flex-col space-y-4">
            <div className="relative w-full mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, posts, groups..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "p-3 rounded-lg flex items-center gap-3",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}


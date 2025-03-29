"use client"

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
import { Search, Plus, Settings, LogOut, User, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className={cn("bg-background sticky top-0 z-50 w-full border-b", className)}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="hidden font-bold sm:block">
          SocialNet
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, posts, groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace/sell">
              <Plus className="h-4 w-4 mr-2" />
              Sell
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Dark Mode"
            onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Dark Mode</span>
          </Button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image as string} alt={session?.user?.name as string} />
                    <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut()
                  }}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


"use client"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Book, LayoutDashboard, Lock, Settings, User, Users, Zap, FileCode2, KeyRound } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/content",
      label: "Content",
      icon: Book,
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: BarChart,
    },
    {
      href: "/admin/api",
      label: "API Management",
      icon: Zap,
    },
    {
      href: "/admin/settings/site",
      label: "Site Settings",
      icon: Settings,
    },
    {
      href: "/admin/settings/users",
      label: "User Settings",
      icon: User,
    },
    {
      href: "/admin/settings/profile",
      label: "Profile Settings",
      icon: Lock,
    },
    {
      href: "/admin/settings/config",
      label: "Configuration",
      icon: FileCode2,
    },
    {
      href: "/admin/settings/variables",
      label: "API & Variables",
      icon: KeyRound,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart,
    },
    {
      href: "/admin/integrations",
      label: "Integrations",
      icon: Zap,
    },
  ]

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {routes.map((route) => (
        <Button
          key={route.href}
          variant="ghost"
          className={cn(
            "justify-start pl-6 font-normal",
            pathname === route.href ? "bg-secondary text-primary" : "text-muted-foreground",
            "hover:text-primary hover:bg-secondary",
          )}
          onClick={() => router.push(route.href)}
        >
          <route.icon className="mr-2 h-4 w-4" />
          {route.label}
        </Button>
      ))}
    </div>
  )
}


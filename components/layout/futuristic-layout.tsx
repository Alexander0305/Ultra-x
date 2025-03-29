import type React from "react"
import { FuturisticHeader } from "@/components/layout/futuristic-header"
import { FuturisticSidebar } from "@/components/layout/futuristic-sidebar"
import { cn } from "@/lib/utils"

interface FuturisticLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showRightSidebar?: boolean
  className?: string
}

export default function FuturisticLayout({
  children,
  showSidebar = true,
  showRightSidebar = true,
  className,
}: FuturisticLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FuturisticHeader />

      <div className="flex">
        {showSidebar && <FuturisticSidebar />}

        <main
          className={cn(
            "flex-1 pt-20 transition-all duration-300",
            showSidebar && "md:pl-[280px]",
            showRightSidebar && "md:pr-[320px]",
            className,
          )}
        >
          <div className="container py-6">{children}</div>
        </main>

        {showRightSidebar && (
          <div className="fixed top-0 right-0 bottom-0 w-[320px] border-l border-border/50 bg-background/80 backdrop-blur-md pt-20 hidden md:block">
            <div className="p-4">
              {/* Right sidebar content will go here */}
              <h3 className="text-lg font-semibold mb-4">Trending</h3>
              {/* Trending content */}

              <h3 className="text-lg font-semibold mt-6 mb-4">Suggested Friends</h3>
              {/* Suggested friends */}

              <h3 className="text-lg font-semibold mt-6 mb-4">Upcoming Events</h3>
              {/* Upcoming events */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


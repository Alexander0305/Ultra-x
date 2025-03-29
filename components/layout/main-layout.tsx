import type { ReactNode } from "react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import RightSidebar from "@/components/layout/right-sidebar"

interface MainLayoutProps {
  children: ReactNode
  showRightSidebar?: boolean
}

export default function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_300px] gap-6 py-6">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="space-y-6">{children}</div>

        {/* Right Sidebar */}
        {showRightSidebar && <RightSidebar />}
      </main>
    </div>
  )
}


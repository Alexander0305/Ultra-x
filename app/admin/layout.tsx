import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin role
  if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
    redirect("/auth/login?callbackUrl=/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}


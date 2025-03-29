import { notFound } from "next/navigation"
import prisma from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUserProfile from "@/components/admin/admin-user-profile"
import AdminUserActivity from "@/components/admin/admin-user-activity"
import AdminUserSecurity from "@/components/admin/admin-user-security"
import AdminUserActions from "@/components/admin/admin-user-actions"

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const userId = params.id

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
          likes: true,
          friends: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Get user's recent activity
  const recentPosts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const recentComments = await prisma.comment.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      post: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  })

  // Get security logs
  const securityLogs = await prisma.securityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Details</h1>
        <AdminUserActions user={user} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminUserProfile user={user} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <AdminUserActivity posts={recentPosts} comments={recentComments} counts={user._count} />
              </TabsContent>
              <TabsContent value="security" className="mt-4">
                <AdminUserSecurity user={user} securityLogs={securityLogs} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


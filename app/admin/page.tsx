import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminDashboardStats from "@/components/admin/admin-dashboard-stats"
import AdminUserGrowthChart from "@/components/admin/admin-user-growth-chart"
import AdminContentEngagementChart from "@/components/admin/admin-content-engagement-chart"
import AdminRecentActivityTable from "@/components/admin/admin-recent-activity-table"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // Get dashboard stats
  const userCount = await prisma.user.count()
  const postCount = await prisma.post.count()
  const commentCount = await prisma.comment.count()
  const reportCount = await prisma.report.count({
    where: { status: "PENDING" },
  })

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { joinedAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
      joinedAt: true,
    },
  })

  // Get recent posts
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  })

  // Get recent reports
  const recentReports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">Welcome back, {session?.user?.name}</div>
      </div>

      <AdminDashboardStats
        userCount={userCount}
        postCount={postCount}
        commentCount={commentCount}
        reportCount={reportCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminUserGrowthChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminContentEngagementChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <AdminRecentActivityTable type="users" data={recentUsers} />
            </TabsContent>
            <TabsContent value="posts" className="mt-4">
              <AdminRecentActivityTable type="posts" data={recentPosts} />
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <AdminRecentActivityTable type="reports" data={recentReports} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUserAnalytics from "@/components/admin/admin-user-analytics"
import AdminContentAnalytics from "@/components/admin/admin-content-analytics"
import AdminEngagementAnalytics from "@/components/admin/admin-engagement-analytics"
import AdminPerformanceAnalytics from "@/components/admin/admin-performance-analytics"

export default function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: {
    period?: string
    startDate?: string
    endDate?: string
  }
}) {
  const period = searchParams.period || "30d"
  const startDate = searchParams.startDate ? new Date(searchParams.startDate) : undefined
  const endDate = searchParams.endDate ? new Date(searchParams.endDate) : undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <AdminUserAnalytics period={period} startDate={startDate} endDate={endDate} />
            </TabsContent>
            <TabsContent value="content" className="mt-4">
              <AdminContentAnalytics period={period} startDate={startDate} endDate={endDate} />
            </TabsContent>
            <TabsContent value="engagement" className="mt-4">
              <AdminEngagementAnalytics period={period} startDate={startDate} endDate={endDate} />
            </TabsContent>
            <TabsContent value="performance" className="mt-4">
              <AdminPerformanceAnalytics period={period} startDate={startDate} endDate={endDate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


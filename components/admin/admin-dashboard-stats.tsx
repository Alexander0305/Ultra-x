import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, MessageSquare, Flag } from "lucide-react"

interface AdminDashboardStatsProps {
  userCount: number
  postCount: number
  commentCount: number
  reportCount: number
}

export default function AdminDashboardStats({
  userCount,
  postCount,
  commentCount,
  reportCount,
}: AdminDashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{userCount.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <FileText className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
            <h3 className="text-2xl font-bold">{postCount.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
            <h3 className="text-2xl font-bold">{commentCount.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
            <Flag className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
            <h3 className="text-2xl font-bold">{reportCount.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


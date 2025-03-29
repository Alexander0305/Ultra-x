import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminReportTable from "@/components/admin/admin-report-table"
import AdminReportTableSkeleton from "@/components/admin/admin-report-table-skeleton"

export default function AdminReportsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    status?: string
    type?: string
  }
}) {
  const page = Number(searchParams.page) || 1
  const status = searchParams.status || "PENDING"
  const type = searchParams.type

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Report Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={status}>
            <TabsList>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              <TabsTrigger value="ALL">All</TabsTrigger>
            </TabsList>
            <TabsContent value={status} className="mt-4">
              <Suspense fallback={<AdminReportTableSkeleton />}>
                <AdminReportTable page={page} status={status === "ALL" ? undefined : status} type={type} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


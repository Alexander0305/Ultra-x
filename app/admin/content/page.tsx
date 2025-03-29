import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminContentSearch from "@/components/admin/admin-content-search"
import AdminPostTable from "@/components/admin/admin-post-table"
import AdminCommentTable from "@/components/admin/admin-comment-table"
import AdminMediaTable from "@/components/admin/admin-media-table"
import AdminContentTableSkeleton from "@/components/admin/admin-content-table-skeleton"

export default function AdminContentPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    page?: string
    type?: string
    status?: string
    reportStatus?: string
  }
}) {
  const query = searchParams.q || ""
  const page = Number(searchParams.page) || 1
  const type = searchParams.type || "posts"
  const status = searchParams.status
  const reportStatus = searchParams.reportStatus

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminContentSearch />

          <Tabs defaultValue={type} className="mt-4">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-4">
              <Suspense fallback={<AdminContentTableSkeleton />}>
                <AdminPostTable query={query} page={page} status={status} reportStatus={reportStatus} />
              </Suspense>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <Suspense fallback={<AdminContentTableSkeleton />}>
                <AdminCommentTable query={query} page={page} status={status} reportStatus={reportStatus} />
              </Suspense>
            </TabsContent>
            <TabsContent value="media" className="mt-4">
              <Suspense fallback={<AdminContentTableSkeleton />}>
                <AdminMediaTable query={query} page={page} status={status} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


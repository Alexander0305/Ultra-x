import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminConfigVariables from "@/components/admin/config/admin-config-variables"
import AdminConfigAuditLog from "@/components/admin/config/admin-config-audit-log"
import AdminConfigSkeleton from "@/components/admin/config/admin-config-skeleton"

export default function AdminConfigPage({
  searchParams,
}: {
  searchParams: {
    tab?: string
    category?: string
  }
}) {
  const tab = searchParams.tab || "variables"
  const category = searchParams.category || "all"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Environment Variables</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Manage environment variables and configuration settings for your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={tab}>
            <TabsList>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            <TabsContent value="variables" className="mt-4">
              <Tabs defaultValue={category}>
                <TabsList className="flex flex-wrap">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="auth">Authentication</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value={category} className="mt-4">
                  <Suspense fallback={<AdminConfigSkeleton />}>
                    <AdminConfigVariables category={category === "all" ? undefined : category} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="audit" className="mt-4">
              <Suspense fallback={<AdminConfigSkeleton />}>
                <AdminConfigAuditLog />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


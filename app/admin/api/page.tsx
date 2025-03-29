import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminConfigVariables from "@/components/admin/config/admin-config-variables"
import AdminConfigSkeleton from "@/components/admin/config/admin-config-skeleton"
import AdminApiEndpoints from "@/components/admin/api/admin-api-endpoints"
import AdminApiKeys from "@/components/admin/api/admin-api-keys"

export const metadata = {
  title: "API Management - SocialNet Admin",
  description: "Manage API endpoints, keys, and settings for your social network",
}

export default function AdminApiPage({
  searchParams,
}: {
  searchParams: {
    tab?: string
    category?: string
  }
}) {
  const tab = searchParams.tab || "endpoints"
  const category = searchParams.category || "api"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">API Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Manage API endpoints, keys, and settings for your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={tab}>
            <TabsList>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="settings">API Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="endpoints" className="mt-4">
              <Suspense fallback={<AdminConfigSkeleton />}>
                <AdminApiEndpoints />
              </Suspense>
            </TabsContent>
            <TabsContent value="keys" className="mt-4">
              <Suspense fallback={<AdminConfigSkeleton />}>
                <AdminApiKeys />
              </Suspense>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <Suspense fallback={<AdminConfigSkeleton />}>
                <AdminConfigVariables category="api" />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


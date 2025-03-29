import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminFeatureFlags from "@/components/admin/config/admin-feature-flags"
import AdminConfigSkeleton from "@/components/admin/config/admin-config-skeleton"

export default function AdminFeaturesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feature Flags</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Management</CardTitle>
          <CardDescription>Enable or disable features across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AdminConfigSkeleton />}>
            <AdminFeatureFlags />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}


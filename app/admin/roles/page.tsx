import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminRolesPermissions from "@/components/admin/users/admin-roles-permissions"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Roles & Permissions - Admin Dashboard",
  description: "Manage user roles and permissions",
}

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<RolesSkeleton />}>
            <AdminRolesPermissions />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function RolesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}


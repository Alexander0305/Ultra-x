import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminConfigVariables from "@/components/admin/config/admin-config-variables"

export const metadata: Metadata = {
  title: "API & Environment Variables",
  description: "Manage API keys and environment variables for your application",
}

export default function AdminVariablesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API & Environment Variables</h1>
          <p className="text-muted-foreground">Manage API keys and environment variables for your application.</p>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Variables</CardTitle>
              <CardDescription>Add, edit, or remove API keys and environment variables.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminConfigVariables />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


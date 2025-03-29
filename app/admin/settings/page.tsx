import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminGeneralSettings from "@/components/admin/admin-general-settings"
import AdminSecuritySettings from "@/components/admin/admin-security-settings"
import AdminContentSettings from "@/components/admin/admin-content-settings"
import AdminNotificationSettings from "@/components/admin/admin-notification-settings"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Configure platform-wide settings and policies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <AdminGeneralSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              <AdminSecuritySettings />
            </TabsContent>
            <TabsContent value="content" className="mt-4">
              <AdminContentSettings />
            </TabsContent>
            <TabsContent value="notifications" className="mt-4">
              <AdminNotificationSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


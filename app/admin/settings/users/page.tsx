import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserRegistrationSettings from "@/components/admin/settings/user-registration-settings"
import UserLoginSettings from "@/components/admin/settings/user-login-settings"
import UserProfileSettings from "@/components/admin/settings/user-profile-settings"
import UserSettingsSkeleton from "@/components/admin/settings/user-settings-skeleton"

export default function UserSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Configure how users register, log in, and manage their profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="registration">
            <TabsList className="mb-4">
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="registration">
              <Suspense fallback={<UserSettingsSkeleton />}>
                <UserRegistrationSettings />
              </Suspense>
            </TabsContent>

            <TabsContent value="login">
              <Suspense fallback={<UserSettingsSkeleton />}>
                <UserLoginSettings />
              </Suspense>
            </TabsContent>

            <TabsContent value="profile">
              <Suspense fallback={<UserSettingsSkeleton />}>
                <UserProfileSettings />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


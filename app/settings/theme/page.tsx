import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"

export const metadata: Metadata = {
  title: "Theme Settings",
  description: "Customize your theme and appearance settings",
}

export default function ThemeSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
          <p className="text-muted-foreground">Customize the appearance of your social network experience.</p>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the social network looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <ThemeCustomizer />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Your theme preferences will be saved to your account and applied across all your devices.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


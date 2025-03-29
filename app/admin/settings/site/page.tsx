import { getEnvVariables } from "@/lib/config"
import SiteSettingsForm from "@/components/admin/settings/site-settings-form"

export const metadata = {
  title: "Site Settings - SocialNet Admin",
  description: "Customize your social network appearance and behavior",
}

export default async function SiteSettingsPage() {
  // Get current site settings
  const generalSettings = await getEnvVariables("general")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
        <p className="text-muted-foreground">Customize your social network's appearance and behavior</p>
      </div>

      <SiteSettingsForm initialSettings={generalSettings} />
    </div>
  )
}


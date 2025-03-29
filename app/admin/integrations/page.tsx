import { getEnvVariables } from "@/lib/config"
import AdminIntegrations from "@/components/admin/integrations/admin-integrations"

export const metadata = {
  title: "Manage Integrations - SocialNet Admin",
  description: "Manage third-party integrations for your social network",
}

export default async function AdminIntegrationsPage() {
  // Get current integrations
  const integrationVars = await getEnvVariables("integrations")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect your social network with third-party services</p>
      </div>

      <AdminIntegrations initialIntegrations={integrationVars} />
    </div>
  )
}


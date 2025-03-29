"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import IntegrationDialog from "./integration-dialog"
import SocialIntegrationCard from "./social-integration-card"
import StorageIntegrationCard from "./storage-integration-card"
import AnalyticsIntegrationCard from "./analytics-integration-card"
import EmailIntegrationCard from "./email-integration-card"
import PaymentIntegrationCard from "./payment-integration-card"
import AiIntegrationCard from "./ai-integration-card"

type EnvVariable = {
  key: string
  value: string
  description?: string
  isSecret: boolean
  category: string
}

interface AdminIntegrationsProps {
  initialIntegrations: EnvVariable[]
}

export default function AdminIntegrations({ initialIntegrations }: AdminIntegrationsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [integrations, setIntegrations] = useState<EnvVariable[]>(initialIntegrations)

  // Group integrations by service
  const integrationsByService = integrations.reduce(
    (acc, integration) => {
      const serviceName = integration.key.split("_")[0].toLowerCase()
      if (!acc[serviceName]) {
        acc[serviceName] = []
      }
      acc[serviceName].push(integration)
      return acc
    },
    {} as Record<string, EnvVariable[]>,
  )

  // Handle integration update
  const handleUpdateIntegration = async (updatedIntegration: EnvVariable) => {
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: updatedIntegration.key,
          value: updatedIntegration.value,
          description: updatedIntegration.description,
          isSecret: updatedIntegration.isSecret,
          category: updatedIntegration.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update integration")
      }

      setIntegrations((current) =>
        current.map((integration) => (integration.key === updatedIntegration.key ? updatedIntegration : integration)),
      )
    } catch (error) {
      console.error("Error updating integration:", error)
    }
  }

  // Handle integration creation
  const handleAddIntegration = async (newIntegration: EnvVariable) => {
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: newIntegration.key,
          value: newIntegration.value,
          description: newIntegration.description,
          isSecret: newIntegration.isSecret,
          category: newIntegration.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add integration")
      }

      setIntegrations((current) => [...current, newIntegration])
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding integration:", error)
    }
  }

  return (
    <>
      <Tabs defaultValue="social" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="mb-4">
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Authentication</CardTitle>
              <CardDescription>Allow users to sign in with social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <SocialIntegrationCard
                provider="google"
                integrations={integrationsByService.google || []}
                onUpdate={handleUpdateIntegration}
              />
              <SocialIntegrationCard
                provider="facebook"
                integrations={integrationsByService.facebook || []}
                onUpdate={handleUpdateIntegration}
              />
              <SocialIntegrationCard
                provider="twitter"
                integrations={integrationsByService.twitter || []}
                onUpdate={handleUpdateIntegration}
              />
              <SocialIntegrationCard
                provider="github"
                integrations={integrationsByService.github || []}
                onUpdate={handleUpdateIntegration}
              />
              <SocialIntegrationCard
                provider="discord"
                integrations={integrationsByService.discord || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Providers</CardTitle>
              <CardDescription>Configure cloud storage for user uploads</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StorageIntegrationCard
                provider="s3"
                integrations={integrationsByService.s3 || []}
                onUpdate={handleUpdateIntegration}
              />
              <StorageIntegrationCard
                provider="cloudinary"
                integrations={integrationsByService.cloudinary || []}
                onUpdate={handleUpdateIntegration}
              />
              <StorageIntegrationCard
                provider="uploadcare"
                integrations={integrationsByService.uploadcare || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Providers</CardTitle>
              <CardDescription>Track user engagement and site performance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnalyticsIntegrationCard
                provider="google"
                integrations={integrationsByService.googleanalytics || []}
                onUpdate={handleUpdateIntegration}
              />
              <AnalyticsIntegrationCard
                provider="plausible"
                integrations={integrationsByService.plausible || []}
                onUpdate={handleUpdateIntegration}
              />
              <AnalyticsIntegrationCard
                provider="mixpanel"
                integrations={integrationsByService.mixpanel || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Providers</CardTitle>
              <CardDescription>Configure email delivery services</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <EmailIntegrationCard
                provider="sendgrid"
                integrations={integrationsByService.sendgrid || []}
                onUpdate={handleUpdateIntegration}
              />
              <EmailIntegrationCard
                provider="mailchimp"
                integrations={integrationsByService.mailchimp || []}
                onUpdate={handleUpdateIntegration}
              />
              <EmailIntegrationCard
                provider="smtp"
                integrations={integrationsByService.smtp || []}
                onUpdate={handleUpdateIntegration}
              />
              <EmailIntegrationCard
                provider="resend"
                integrations={integrationsByService.resend || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Providers</CardTitle>
              <CardDescription>Process payments for premium features or marketplace transactions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <PaymentIntegrationCard
                provider="stripe"
                integrations={integrationsByService.stripe || []}
                onUpdate={handleUpdateIntegration}
              />
              <PaymentIntegrationCard
                provider="paypal"
                integrations={integrationsByService.paypal || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Providers</CardTitle>
              <CardDescription>Enable AI-powered features</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AiIntegrationCard
                provider="openai"
                integrations={integrationsByService.openai || []}
                onUpdate={handleUpdateIntegration}
              />
              <AiIntegrationCard
                provider="huggingface"
                integrations={integrationsByService.huggingface || []}
                onUpdate={handleUpdateIntegration}
              />
              <AiIntegrationCard
                provider="anthropic"
                integrations={integrationsByService.anthropic || []}
                onUpdate={handleUpdateIntegration}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <IntegrationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddIntegration}
        category={selectedCategory}
      />
    </>
  )
}


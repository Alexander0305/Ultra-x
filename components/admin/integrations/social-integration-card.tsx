"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, GitlabIcon as GitHub, Twitter, AlertCircle, Check, Edit, Trash, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define the providers we support
const SOCIAL_PROVIDERS = {
  google: {
    name: "Google",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    fields: [
      { key: "GOOGLE_CLIENT_ID", label: "Client ID", isSecret: false },
      { key: "GOOGLE_CLIENT_SECRET", label: "Client Secret", isSecret: true },
    ],
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    fields: [
      { key: "FACEBOOK_CLIENT_ID", label: "App ID", isSecret: false },
      { key: "FACEBOOK_CLIENT_SECRET", label: "App Secret", isSecret: true },
    ],
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    fields: [
      { key: "TWITTER_CLIENT_ID", label: "API Key", isSecret: false },
      { key: "TWITTER_CLIENT_SECRET", label: "API Secret", isSecret: true },
    ],
  },
  github: {
    name: "GitHub",
    icon: GitHub,
    fields: [
      { key: "GITHUB_CLIENT_ID", label: "Client ID", isSecret: false },
      { key: "GITHUB_CLIENT_SECRET", label: "Client Secret", isSecret: true },
    ],
  },
  discord: {
    name: "Discord",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path
          fill="currentColor"
          d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
        />
      </svg>
    ),
    fields: [
      { key: "DISCORD_CLIENT_ID", label: "Client ID", isSecret: false },
      { key: "DISCORD_CLIENT_SECRET", label: "Client Secret", isSecret: true },
    ],
  },
}

type EnvVariable = {
  key: string
  value: string
  description?: string
  isSecret: boolean
  category: string
}

interface SocialIntegrationCardProps {
  provider: keyof typeof SOCIAL_PROVIDERS
  integrations: EnvVariable[]
  onUpdate: (integration: EnvVariable) => Promise<void>
}

export default function SocialIntegrationCard({ provider, integrations, onUpdate }: SocialIntegrationCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const providerInfo = SOCIAL_PROVIDERS[provider]
  const Icon = providerInfo.icon

  // Check if the integration is configured
  const isConfigured = providerInfo.fields.every((field) => {
    const integration = integrations.find((i) => i.key === field.key)
    return integration && integration.value && integration.value.length > 0
  })

  // Initialize form values
  const initFormValues = () => {
    const initialValues: Record<string, string> = {}
    providerInfo.fields.forEach((field) => {
      const integration = integrations.find((i) => i.key === field.key)
      initialValues[field.key] = integration?.value || ""
    })
    setValues(initialValues)
  }

  // Handle edit button click
  const handleEdit = () => {
    initFormValues()
    setIsEditing(true)
  }

  // Handle save button click
  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Update each field
      for (const field of providerInfo.fields) {
        const existingIntegration = integrations.find((i) => i.key === field.key)

        if (existingIntegration) {
          // Update existing integration
          await onUpdate({
            ...existingIntegration,
            value: values[field.key],
          })
        } else {
          // Create new integration
          await onUpdate({
            key: field.key,
            value: values[field.key],
            description: `${providerInfo.name} ${field.label} for authentication`,
            isSecret: field.isSecret,
            category: "integrations",
          })
        }
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update integration:", error)
      setError("Failed to update integration settings")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change
  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {typeof Icon === "function" ? <Icon /> : <Icon className="h-6 w-6" />}
            <CardTitle>{providerInfo.name}</CardTitle>
          </div>
          {isConfigured && (
            <Badge variant="default" className="bg-green-500">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
        <CardDescription>Allow users to sign in with {providerInfo.name}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            {providerInfo.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium">
                  {field.label}
                </label>
                <Input
                  id={field.key}
                  type={field.isSecret ? "password" : "text"}
                  value={values[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  className="mt-1"
                />
              </div>
            ))}

            {error && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-sm">
            {isConfigured ? (
              <p>This integration is properly configured and active.</p>
            ) : (
              <p>This integration is not configured yet.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Configure
            </Button>

            {isConfigured && (
              <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove {providerInfo.name} Integration</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this integration? Users will no longer be able to sign in with{" "}
                      {providerInfo.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleting(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        // Handle deletion
                        setIsDeleting(false)
                      }}
                    >
                      Remove Integration
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}


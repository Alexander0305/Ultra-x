"use client"

import type React from "react"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Check, AlertTriangle, InfoIcon } from "lucide-react"

type SetupFinalStepProps = {
  onNext: (data: any) => void
  data: any
}

export default function SetupFinalStep({ onNext, data }: SetupFinalStepProps) {
  const [validating, setValidating] = useState(false)

  // For the final step, we just need to submit the form to continue
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({})
  }

  // Format the settings to display in a user-friendly way
  const formatConfig = (section: string, configData: any) => {
    if (!configData) return []

    return Object.entries(configData).map(([key, value]) => {
      // Skip sensitive fields
      if (key === "password" || key === "confirmPassword") {
        return { key, displayKey: key, value: "••••••••", sensitive: true }
      }

      // Format booleans
      if (typeof value === "boolean") {
        return { key, displayKey: key, value: value ? "Enabled" : "Disabled" }
      }

      // Format arrays
      if (Array.isArray(value)) {
        return { key, displayKey: key, value: value.join(", ") }
      }

      // Skip empty strings or null values
      if (value === "" || value === null) {
        return { key, displayKey: key, value: "Not set", missing: true }
      }

      // Format other values
      return {
        key,
        displayKey: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        value,
      }
    })
  }

  return (
    <form id="setup-form-finish" onSubmit={handleSubmit}>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Ready to complete setup</AlertTitle>
        <AlertDescription>
          Please review your settings before completing the setup process. This will create your database schema, admin
          account, and configure your social network.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Configuration</CardTitle>
            <CardDescription>Your database connection settings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {formatConfig("database", data.database).map((item) => (
                  <div key={item.key}>
                    <div className="text-sm font-medium">{item.displayKey}</div>
                    <div
                      className={`text-sm ${item.missing ? "text-yellow-500" : ""} ${item.sensitive ? "text-muted-foreground" : ""}`}
                    >
                      {item.value}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Account</CardTitle>
            <CardDescription>Your administrator account details</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {formatConfig("admin", data.admin).map((item) => (
                  <div key={item.key}>
                    <div className="text-sm font-medium">{item.displayKey}</div>
                    <div
                      className={`text-sm ${item.missing ? "text-yellow-500" : ""} ${item.sensitive ? "text-muted-foreground" : ""}`}
                    >
                      {item.value}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
            <CardDescription>Your site configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {formatConfig("settings", data.settings).map((item) => (
                  <div key={item.key}>
                    <div className="text-sm font-medium">{item.displayKey}</div>
                    <div className={`text-sm ${item.missing ? "text-yellow-500" : ""}`}>{item.value}</div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Enabled and disabled features</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {formatConfig("features", data.features).map((item) => (
                  <div key={item.key}>
                    <div className="text-sm font-medium">
                      {item.displayKey}
                      {item.value === "Enabled" ? (
                        <Check className="inline h-4 w-4 ml-2 text-green-500" />
                      ) : (
                        <AlertTriangle className="inline h-4 w-4 ml-2 text-yellow-500" />
                      )}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This will initialize your database and create configuration settings. Make sure you have a backup of any
          existing data.
        </AlertDescription>
      </Alert>
    </form>
  )
}


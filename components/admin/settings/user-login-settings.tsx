"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define the schema for login settings
const loginSettingsSchema = z.object({
  // General settings
  LOGIN_USERNAME_ENABLED: z.enum(["true", "false"]).default("true"),
  LOGIN_EMAIL_ENABLED: z.enum(["true", "false"]).default("true"),
  LOGIN_PHONE_ENABLED: z.enum(["true", "false"]).default("false"),
  LOGIN_SOCIAL_ENABLED: z.enum(["true", "false"]).default("true"),
  LOGIN_PASSWORDLESS_ENABLED: z.enum(["true", "false"]).default("false"),

  // Security settings
  LOGIN_2FA_ENABLED: z.enum(["true", "false"]).default("false"),
  LOGIN_2FA_REQUIRED: z.enum(["true", "false"]).default("false"),
  LOGIN_MAX_ATTEMPTS: z.string().default("5"),
  LOGIN_LOCKOUT_DURATION: z.string().default("30"),
  LOGIN_SESSION_DURATION: z.string().default("1440"),
  LOGIN_REMEMBER_ME_ENABLED: z.enum(["true", "false"]).default("true"),
  LOGIN_IP_TRACKING: z.enum(["true", "false"]).default("true"),

  // SSO settings
  LOGIN_SSO_ENABLED: z.enum(["true", "false"]).default("false"),
  LOGIN_OAUTH_ENABLED: z.enum(["true", "false"]).default("true"),
  LOGIN_OPENID_ENABLED: z.enum(["true", "false"]).default("false"),

  // Page customization
  LOGIN_PAGE_TITLE: z.string().default("Log In"),
  LOGIN_PAGE_DESCRIPTION: z.string().default("Log in to your account"),
  LOGIN_REDIRECT_URL: z.string().default("/"),
})

export default function UserLoginSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Create form
  const form = useForm<z.infer<typeof loginSettingsSchema>>({
    resolver: zodResolver(loginSettingsSchema),
    defaultValues: {
      LOGIN_USERNAME_ENABLED: "true",
      LOGIN_EMAIL_ENABLED: "true",
      LOGIN_PHONE_ENABLED: "false",
      LOGIN_SOCIAL_ENABLED: "true",
      LOGIN_PASSWORDLESS_ENABLED: "false",
      LOGIN_2FA_ENABLED: "false",
      LOGIN_2FA_REQUIRED: "false",
      LOGIN_MAX_ATTEMPTS: "5",
      LOGIN_LOCKOUT_DURATION: "30",
      LOGIN_SESSION_DURATION: "1440",
      LOGIN_REMEMBER_ME_ENABLED: "true",
      LOGIN_IP_TRACKING: "true",
      LOGIN_SSO_ENABLED: "false",
      LOGIN_OAUTH_ENABLED: "true",
      LOGIN_OPENID_ENABLED: "false",
      LOGIN_PAGE_TITLE: "Log In",
      LOGIN_PAGE_DESCRIPTION: "Log in to your account",
      LOGIN_REDIRECT_URL: "/",
    },
  })

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/config?category=login")

        if (response.ok) {
          const data = await response.json()

          // Update form values
          const formValues: Record<string, any> = {}
          data.forEach((setting: any) => {
            formValues[setting.key] = setting.value
          })

          form.reset(formValues)
        }
      } catch (error) {
        console.error("Failed to load login settings:", error)
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: "An error occurred while loading login settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [form, toast])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof loginSettingsSchema>) => {
    setIsLoading(true)

    try {
      // Convert values to array of settings
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || "",
        category: "login",
      }))

      // Update settings
      const response = await fetch("/api/admin/config/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to update login settings")
      }

      toast({
        title: "Settings updated",
        description: "Login settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: error instanceof Error ? error.message : "An error occurred while updating settings.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sso">SSO & OAuth</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Login Options</CardTitle>
                <CardDescription>Configure how users can log in to your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="LOGIN_USERNAME_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Username Login</FormLabel>
                        <FormDescription>Allow users to log in with their username</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_EMAIL_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Login</FormLabel>
                        <FormDescription>Allow users to log in with their email address</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_PHONE_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Phone Number Login</FormLabel>
                        <FormDescription>Allow users to log in with their phone number</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_SOCIAL_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Social Media Login</FormLabel>
                        <FormDescription>Allow users to log in using their social media accounts</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_PASSWORDLESS_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Passwordless Login</FormLabel>
                        <FormDescription>
                          Allow users to log in without a password using email or SMS verification
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_REMEMBER_ME_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Remember Me Option</FormLabel>
                        <FormDescription>Allow users to stay logged in between sessions</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security settings for user login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="LOGIN_2FA_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                        <FormDescription>
                          Allow users to enable two-factor authentication for their accounts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_2FA_REQUIRED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Two-Factor Authentication</FormLabel>
                        <FormDescription>Require all users to set up two-factor authentication</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                          disabled={form.watch("LOGIN_2FA_ENABLED") !== "true"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_MAX_ATTEMPTS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Login Attempts</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of failed login attempts before account is temporarily locked
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_LOCKOUT_DURATION"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Lockout Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Duration in minutes that an account remains locked after too many failed login attempts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_SESSION_DURATION"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Duration in minutes that a user session remains active before requiring re-login (1440 = 24
                        hours)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_IP_TRACKING"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">IP Address Tracking</FormLabel>
                        <FormDescription>Track IP addresses used for login attempts</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Single Sign-On & OAuth</CardTitle>
                <CardDescription>Configure single sign-on and OAuth integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="LOGIN_SSO_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Single Sign-On (SSO)</FormLabel>
                        <FormDescription>
                          Allow users to access the platform with a single set of login credentials
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_OAUTH_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">OAuth Integration</FormLabel>
                        <FormDescription>Allow users to authorize access to their accounts using OAuth</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_OPENID_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">OpenID Connect Integration</FormLabel>
                        <FormDescription>
                          Allow users to authenticate with their existing accounts using OpenID Connect
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "true"}
                          onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Login Page Appearance</CardTitle>
                <CardDescription>Customize the look and content of your login page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="LOGIN_PAGE_TITLE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Title displayed on the login page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_PAGE_DESCRIPTION"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Description text displayed on the login page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="LOGIN_REDIRECT_URL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Redirect URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>URL to redirect users to after successful login</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}


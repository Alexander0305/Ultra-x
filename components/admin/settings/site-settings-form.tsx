"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define the settings schema
const siteSettingsSchema = z.object({
  SITE_NAME: z.string().min(1, "Site name is required"),
  SITE_DESCRIPTION: z.string().max(160, "Description must be less than 160 characters"),
  SITE_URL: z.string().url("Please enter a valid URL"),
  SITE_LOGO: z.string().optional(),
  SITE_FAVICON: z.string().optional(),
  SITE_THEME: z.enum(["light", "dark", "system"]).default("system"),
  DEFAULT_TIMEZONE: z.string().default("UTC"),
  ADMIN_EMAIL: z.string().email("Please enter a valid email address"),
  COMPANY_NAME: z.string().optional(),
  COPYRIGHT_TEXT: z.string().optional(),
  SUPPORT_EMAIL: z.string().email("Please enter a valid email address").optional(),
  PRIVACY_POLICY_URL: z.string().url("Please enter a valid URL").optional(),
  TERMS_URL: z.string().url("Please enter a valid URL").optional(),
  COOKIE_CONSENT_ENABLED: z.enum(["true", "false"]).default("true"),
  ENABLE_PWA: z.enum(["true", "false"]).default("false"),
})

type EnvVariable = {
  key: string
  value: string
  description?: string
  isSecret: boolean
  category: string
}

interface SiteSettingsFormProps {
  initialSettings: EnvVariable[]
}

export default function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const { toast } = useToast()

  // Create form
  const form = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialSettings.reduce(
      (acc, setting) => {
        return {
          ...acc,
          [setting.key]: setting.value,
        }
      },
      {
        SITE_NAME: "SocialNet",
        SITE_DESCRIPTION: "A comprehensive social networking platform",
        SITE_URL: "http://localhost:3000",
        SITE_LOGO: "",
        SITE_FAVICON: "",
        SITE_THEME: "system",
        DEFAULT_TIMEZONE: "UTC",
        ADMIN_EMAIL: "admin@example.com",
        COMPANY_NAME: "",
        COPYRIGHT_TEXT: "",
        SUPPORT_EMAIL: "",
        PRIVACY_POLICY_URL: "",
        TERMS_URL: "",
        COOKIE_CONSENT_ENABLED: "true",
        ENABLE_PWA: "false",
      },
    ),
  })

  // Set up previews for logo and favicon
  useState(() => {
    const logo = initialSettings.find((s) => s.key === "SITE_LOGO")?.value
    const favicon = initialSettings.find((s) => s.key === "SITE_FAVICON")?.value

    if (logo) setLogoPreview(logo)
    if (favicon) setFaviconPreview(favicon)
  })

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "SITE_LOGO" | "SITE_FAVICON") => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      form.setError(type, { message: "File is too large. Maximum size is 2MB." })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      form.setError(type, { message: "Only image files are allowed." })
      return
    }

    // Create file preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === "SITE_LOGO") {
        setLogoPreview(e.target?.result as string)
      } else {
        setFaviconPreview(e.target?.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(type)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type.toLowerCase().replace("site_", ""))

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload ${type}`)
      }

      const data = await response.json()
      form.setValue(type, data.url)
    } catch (error) {
      console.error(`${type} upload error:`, error)
      form.setError(type, {
        message: error instanceof Error ? error.message : `Failed to upload ${type}`,
      })
      if (type === "SITE_LOGO") {
        setLogoPreview(null)
      } else {
        setFaviconPreview(null)
      }
    } finally {
      setUploading(null)
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof siteSettingsSchema>) => {
    setIsLoading(true)

    try {
      // Convert values to array of settings
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || "",
        category: "general",
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
        throw new Error("Failed to update site settings")
      }

      toast({
        title: "Settings updated",
        description: "Your site settings have been updated successfully.",
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
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="legal">Legal & Support</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic information about your social network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="SITE_NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>The name of your social network</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="SITE_DESCRIPTION"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>A brief description of your platform (used for SEO)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="SITE_URL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>The full URL of your website</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="COMPANY_NAME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Company or organization name (for legal documents)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="COPYRIGHT_TEXT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Copyright Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="© 2024 Your Company" />
                        </FormControl>
                        <FormDescription>Copyright text to show in the footer</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ADMIN_EMAIL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>Main administrator email address</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="DEFAULT_TIMEZONE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a default timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                            <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                            <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="SITE_LOGO"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <div className="flex items-center gap-4">
                          {logoPreview && (
                            <div className="h-16 flex items-center">
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo Preview"
                                className="max-h-16 max-w-32 object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <Input
                              type="file"
                              id="logo-upload"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e, "SITE_LOGO")}
                              accept="image/*"
                              disabled={!!uploading}
                            />
                            <Button type="button" variant="outline" size="sm" asChild>
                              <label htmlFor="logo-upload" className="cursor-pointer">
                                {uploading === "SITE_LOGO" ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4 mr-2" />
                                )}
                                Upload Logo
                              </label>
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="SITE_FAVICON"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon</FormLabel>
                        <div className="flex items-center gap-4">
                          {faviconPreview && (
                            <div className="h-16 flex items-center">
                              <img
                                src={faviconPreview || "/placeholder.svg"}
                                alt="Favicon Preview"
                                className="h-8 w-8 object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <Input
                              type="file"
                              id="favicon-upload"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e, "SITE_FAVICON")}
                              accept="image/*"
                              disabled={!!uploading}
                            />
                            <Button type="button" variant="outline" size="sm" asChild>
                              <label htmlFor="favicon-upload" className="cursor-pointer">
                                {uploading === "SITE_FAVICON" ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4 mr-2" />
                                )}
                                Upload Favicon
                              </label>
                            </Button>
                          </div>
                        </div>
                        <FormDescription>A small icon for browser tabs (ideally 32x32px)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="SITE_THEME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a default theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Default theme for all users (they can change it later)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Support</CardTitle>
                <CardDescription>Configure legal pages and support information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="SUPPORT_EMAIL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormDescription>Email address for user support inquiries</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="PRIVACY_POLICY_URL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Privacy Policy URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Link to your privacy policy page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="TERMS_URL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms of Service URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Link to your terms of service page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="COOKIE_CONSENT_ENABLED"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cookie Consent</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Enable cookie consent banner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Show cookie consent banner to users</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="ENABLE_PWA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progressive Web App</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Enable PWA support" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Allow users to install your platform as a mobile/desktop app</FormDescription>
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
                <Check className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}


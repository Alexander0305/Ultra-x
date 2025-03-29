"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Define the schema for basic settings
const basicSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().max(160, "Description must be less than 160 characters"),
  siteUrl: z.string().url("Please enter a valid URL"),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  allowRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  defaultTimezone: z.string().default("UTC"),
})

type SetupBasicSettingsStepProps = {
  onNext: (data: any) => void
  initialData: any
}

export default function SetupBasicSettingsStep({ onNext, initialData }: SetupBasicSettingsStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(initialData?.favicon || null)
  const [uploading, setUploading] = useState<string | null>(null)

  // Create form
  const form = useForm<z.infer<typeof basicSettingsSchema>>({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: initialData || {
      siteName: "SocialNet",
      siteDescription: "A comprehensive social networking platform",
      siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
      logo: "",
      favicon: "",
      theme: "system",
      allowRegistration: true,
      requireEmailVerification: true,
      defaultTimezone: "UTC",
    },
  })

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
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
      if (type === "logo") {
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
      formData.append("type", type)

      const response = await fetch("/api/setup/upload", {
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
      if (type === "logo") {
        setLogoPreview(null)
      } else {
        setFaviconPreview(null)
      }
    } finally {
      setUploading(null)
    }
  }

  // Submit the form
  const onSubmit = (values: z.infer<typeof basicSettingsSchema>) => {
    onNext(values)
  }

  return (
    <Form {...form}>
      <form id="setup-form-settings" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteName"
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
          name="siteDescription"
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
          name="siteUrl"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="logo"
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
                      onChange={(e) => handleFileUpload(e, "logo")}
                      accept="image/*"
                      disabled={!!uploading}
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {uploading === "logo" ? (
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
            name="favicon"
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
                      onChange={(e) => handleFileUpload(e, "favicon")}
                      accept="image/*"
                      disabled={!!uploading}
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="favicon-upload" className="cursor-pointer">
                        {uploading === "favicon" ? (
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
          name="theme"
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
              <FormDescription>Users can always change their preferred theme</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="allowRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Open Registration</FormLabel>
                  <FormDescription>Allow new users to register</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requireEmailVerification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Verification</FormLabel>
                  <FormDescription>Require email verification for new accounts</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="defaultTimezone"
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
      </form>
    </Form>
  )
}


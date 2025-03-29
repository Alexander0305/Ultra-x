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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"

// Define the schema for profile settings
const profileSettingsSchema = z.object({
  // General settings
  PROFILE_BIO_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_BIO_MAX_LENGTH: z.string().default("500"),
  PROFILE_LOCATION_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_WEBSITE_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_SOCIAL_LINKS_ENABLED: z.enum(["true", "false"]).default("true"),

  // Media settings
  PROFILE_AVATAR_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_AVATAR_MAX_SIZE: z.string().default("2"),
  PROFILE_COVER_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_COVER_MAX_SIZE: z.string().default("5"),

  // Privacy settings
  PROFILE_PRIVACY_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_DEFAULT_PRIVACY: z.enum(["public", "friends", "private"]).default("public"),
  PROFILE_ACTIVITY_TRACKING: z.enum(["true", "false"]).default("true"),

  // Custom fields
  PROFILE_CUSTOM_FIELDS: z.string().default("[]"),

  // Layout settings
  PROFILE_CUSTOM_SECTIONS_ENABLED: z.enum(["true", "false"]).default("false"),
  PROFILE_CUSTOM_LAYOUT_ENABLED: z.enum(["true", "false"]).default("false"),

  // Security settings
  PROFILE_FIELD_ENCRYPTION_ENABLED: z.enum(["true", "false"]).default("false"),

  // Analytics and Reporting
  PROFILE_ANALYTICS_ENABLED: z.enum(["true", "false"]).default("true"),
  PROFILE_REPORTING_ENABLED: z.enum(["true", "false"]).default("true"),

  // Integration
  PROFILE_INTEGRATION_ENABLED: z.enum(["true", "false"]).default("false"),

  // Compliance
  PROFILE_COMPLIANCE_ENABLED: z.enum(["true", "false"]).default("false"),

  // Customization
  PROFILE_CUSTOM_CSS_ENABLED: z.enum(["true", "false"]).default("false"),
  PROFILE_CUSTOM_JS_ENABLED: z.enum(["true", "false"]).default("false"),
  PROFILE_CUSTOM_HTML_ENABLED: z.enum(["true", "false"]).default("false"),

  // Versioning
  PROFILE_VERSIONING_ENABLED: z.enum(["true", "false"]).default("false"),
})

// Define the type for custom fields
type CustomField = {
  id: string
  name: string
  label: string
  type: string
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
  privacy?: boolean
}

export default function UserProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
    privacy: true,
  })
  const { toast } = useToast()

  // Create form
  const form = useForm<z.infer<typeof profileSettingsSchema>>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      PROFILE_BIO_ENABLED: "true",
      PROFILE_BIO_MAX_LENGTH: "500",
      PROFILE_LOCATION_ENABLED: "true",
      PROFILE_WEBSITE_ENABLED: "true",
      PROFILE_SOCIAL_LINKS_ENABLED: "true",
      PROFILE_AVATAR_ENABLED: "true",
      PROFILE_AVATAR_MAX_SIZE: "2",
      PROFILE_COVER_ENABLED: "true",
      PROFILE_COVER_MAX_SIZE: "5",
      PROFILE_PRIVACY_ENABLED: "true",
      PROFILE_DEFAULT_PRIVACY: "public",
      PROFILE_ACTIVITY_TRACKING: "true",
      PROFILE_CUSTOM_FIELDS: "[]",
      PROFILE_CUSTOM_SECTIONS_ENABLED: "false",
      PROFILE_CUSTOM_LAYOUT_ENABLED: "false",
      PROFILE_FIELD_ENCRYPTION_ENABLED: "false",
      PROFILE_ANALYTICS_ENABLED: "true",
      PROFILE_REPORTING_ENABLED: "true",
      PROFILE_INTEGRATION_ENABLED: "false",
      PROFILE_COMPLIANCE_ENABLED: "false",
      PROFILE_CUSTOM_CSS_ENABLED: "false",
      PROFILE_CUSTOM_JS_ENABLED: "false",
      PROFILE_CUSTOM_HTML_ENABLED: "false",
      PROFILE_VERSIONING_ENABLED: "false",
    },
  })

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/config?category=profile")

        if (response.ok) {
          const data = await response.json()

          // Update form values
          const formValues: Record<string, any> = {}
          data.forEach((setting: any) => {
            formValues[setting.key] = setting.value
          })

          // Parse custom fields
          const customFieldsStr = formValues.PROFILE_CUSTOM_FIELDS || "[]"
          try {
            const parsedFields = JSON.parse(customFieldsStr)
            setCustomFields(parsedFields)
          } catch (e) {
            console.error("Failed to parse custom fields:", e)
            setCustomFields([])
          }

          form.reset(formValues)
        }
      } catch (error) {
        console.error("Failed to load profile settings:", error)
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: "An error occurred while loading profile settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [form, toast])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileSettingsSchema>) => {
    setIsLoading(true)

    try {
      // Update custom fields in form values
      values.PROFILE_CUSTOM_FIELDS = JSON.stringify(customFields)

      // Convert values to array of settings
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || "",
        category: "profile",
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
        throw new Error("Failed to update profile settings")
      }

      toast({
        title: "Settings updated",
        description: "Profile settings have been updated successfully.",
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

  // Handle adding a new custom field
  const handleAddCustomField = () => {
    if (!newField.name || !newField.label || !newField.type) {
      toast({
        variant: "destructive",
        title: "Invalid field",
        description: "Please provide a name, label, and type for the custom field.",
      })
      return
    }

    // Generate a unique ID
    const id = `field_${Date.now()}`

    // Add the new field
    setCustomFields([...customFields, { id, ...(newField as CustomField) }])

    // Reset the new field form
    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
      privacy: true,
    })
  }

  // Handle removing a custom field
  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(customFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCustomFields(items)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="customFields">Custom Fields</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Profile Settings</CardTitle>
                <CardDescription>Configure basic profile options for your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="PROFILE_BIO_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bio/About Section</FormLabel>
                        <FormDescription>Allow users to add a bio or about section to their profile</FormDescription>
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
                  name="PROFILE_BIO_MAX_LENGTH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Bio Length</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          disabled={form.watch("PROFILE_BIO_ENABLED") !== "true"}
                        />
                      </FormControl>
                      <FormDescription>Maximum number of characters allowed in the bio section</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PROFILE_LOCATION_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Location Field</FormLabel>
                        <FormDescription>Allow users to add their location to their profile</FormDescription>
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
                  name="PROFILE_WEBSITE_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Website Field</FormLabel>
                        <FormDescription>Allow users to add their website to their profile</FormDescription>
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
                  name="PROFILE_SOCIAL_LINKS_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Social Media Links</FormLabel>
                        <FormDescription>Allow users to add links to their social media profiles</FormDescription>
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

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Media Settings</CardTitle>
                <CardDescription>Configure profile picture and cover photo options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="PROFILE_AVATAR_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Profile Pictures</FormLabel>
                        <FormDescription>Allow users to upload profile pictures</FormDescription>
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
                  name="PROFILE_AVATAR_MAX_SIZE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Profile Picture Size (MB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          {...field}
                          disabled={form.watch("PROFILE_AVATAR_ENABLED") !== "true"}
                        />
                      </FormControl>
                      <FormDescription>Maximum file size for profile pictures in megabytes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PROFILE_COVER_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Cover Photos</FormLabel>
                        <FormDescription>Allow users to upload cover photos for their profiles</FormDescription>
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
                  name="PROFILE_COVER_MAX_SIZE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Cover Photo Size (MB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          {...field}
                          disabled={form.watch("PROFILE_COVER_ENABLED") !== "true"}
                        />
                      </FormControl>
                      <FormDescription>Maximum file size for cover photos in megabytes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Privacy Settings</CardTitle>
                <CardDescription>Configure privacy options for user profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="PROFILE_PRIVACY_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Profile Privacy Controls</FormLabel>
                        <FormDescription>
                          Allow users to control the privacy of their profile information
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
                  name="PROFILE_DEFAULT_PRIVACY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Profile Privacy</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={form.watch("PROFILE_PRIVACY_ENABLED") !== "true"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select default privacy level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Default privacy level for new user profiles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PROFILE_ACTIVITY_TRACKING"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activity Tracking</FormLabel>
                        <FormDescription>
                          Track and display user activity on their profile (e.g., recent posts, comments)
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

          <TabsContent value="customFields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Profile Fields</CardTitle>
                <CardDescription>Create custom fields for user profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Field Name</label>
                      <Input
                        placeholder="occupation"
                        value={newField.name || ""}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Internal field name (no spaces, lowercase)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Field Label</label>
                      <Input
                        placeholder="Occupation"
                        value={newField.label || ""}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Label shown to users</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Field Type</label>
                      <Select
                        value={newField.type || "text"}
                        onValueChange={(value) => setNewField({ ...newField, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="radio">Radio Buttons</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Type of input field</p>
                    </div>

                    <div className="flex flex-col space-y-2 mt-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newField.required || false}
                          onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                        />
                        <label className="text-sm font-medium">Required Field</label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newField.privacy || false}
                          onCheckedChange={(checked) => setNewField({ ...newField, privacy: checked })}
                        />
                        <label className="text-sm font-medium">Allow Privacy Control</label>
                      </div>
                    </div>
                  </div>

                  {(newField.type === "select" || newField.type === "radio") && (
                    <div>
                      <label className="text-sm font-medium">Options</label>
                      <Textarea
                        placeholder="Option 1, Option 2, Option 3"
                        value={newField.options?.join(", ") || ""}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            options: e.target.value.split(",").map((opt) => opt.trim()),
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">Comma-separated list of options</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Placeholder</label>
                      <Input
                        placeholder="Enter your occupation"
                        value={newField.placeholder || ""}
                        onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Your current job or profession"
                        value={newField.description || ""}
                        onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={handleAddCustomField} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Custom Fields</h3>

                  {customFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No custom fields added yet.</p>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="custom-fields">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {customFields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center justify-between p-3 border rounded-md bg-background"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center flex-wrap gap-2">
                                        <span className="font-medium">{field.label}</span>
                                        {field.required && <Badge variant="outline">Required</Badge>}
                                        <Badge>{field.type}</Badge>
                                        {field.privacy && <Badge variant="secondary">Privacy Control</Badge>}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Field name: {field.name}
                                        {field.description && ` • ${field.description}`}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveCustomField(field.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </div>
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


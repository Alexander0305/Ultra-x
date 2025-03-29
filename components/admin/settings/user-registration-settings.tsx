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

// Define the schema for registration settings
const registrationSettingsSchema = z.object({
  // General settings
  REGISTRATION_ENABLED: z.enum(["true", "false"]).default("true"),
  REGISTRATION_APPROVAL_REQUIRED: z.enum(["true", "false"]).default("false"),
  REGISTRATION_EMAIL_VERIFICATION: z.enum(["true", "false"]).default("true"),
  REGISTRATION_PHONE_VERIFICATION: z.enum(["true", "false"]).default("false"),
  REGISTRATION_SOCIAL_ENABLED: z.enum(["true", "false"]).default("true"),
  REGISTRATION_CAPTCHA_ENABLED: z.enum(["true", "false"]).default("true"),
  REGISTRATION_INVITATION_ONLY: z.enum(["true", "false"]).default("false"),

  // Limits
  REGISTRATION_MAX_PER_IP: z.string().default("10"),
  REGISTRATION_MAX_PER_DAY: z.string().default("100"),
  REGISTRATION_BLOCKED_DOMAINS: z.string().default(""),
  REGISTRATION_ALLOWED_DOMAINS: z.string().default(""),

  // Notifications
  REGISTRATION_ADMIN_NOTIFICATION: z.enum(["true", "false"]).default("true"),
  REGISTRATION_WELCOME_EMAIL: z.enum(["true", "false"]).default("true"),
  REGISTRATION_WELCOME_EMAIL_TEMPLATE: z.string().default(""),

  // Custom fields
  REGISTRATION_CUSTOM_FIELDS: z.string().default("[]"),

  // Page customization
  REGISTRATION_PAGE_TITLE: z.string().default("Create an Account"),
  REGISTRATION_PAGE_DESCRIPTION: z.string().default("Join our community by creating an account"),
  REGISTRATION_TERMS_ENABLED: z.enum(["true", "false"]).default("true"),
  REGISTRATION_TERMS_TEXT: z.string().default("I agree to the Terms of Service and Privacy Policy"),
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
}

export default function UserRegistrationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
  })
  const { toast } = useToast()

  // Create form
  const form = useForm<z.infer<typeof registrationSettingsSchema>>({
    resolver: zodResolver(registrationSettingsSchema),
    defaultValues: {
      REGISTRATION_ENABLED: "true",
      REGISTRATION_APPROVAL_REQUIRED: "false",
      REGISTRATION_EMAIL_VERIFICATION: "true",
      REGISTRATION_PHONE_VERIFICATION: "false",
      REGISTRATION_SOCIAL_ENABLED: "true",
      REGISTRATION_CAPTCHA_ENABLED: "true",
      REGISTRATION_INVITATION_ONLY: "false",
      REGISTRATION_MAX_PER_IP: "10",
      REGISTRATION_MAX_PER_DAY: "100",
      REGISTRATION_BLOCKED_DOMAINS: "",
      REGISTRATION_ALLOWED_DOMAINS: "",
      REGISTRATION_ADMIN_NOTIFICATION: "true",
      REGISTRATION_WELCOME_EMAIL: "true",
      REGISTRATION_WELCOME_EMAIL_TEMPLATE: "",
      REGISTRATION_CUSTOM_FIELDS: "[]",
      REGISTRATION_PAGE_TITLE: "Create an Account",
      REGISTRATION_PAGE_DESCRIPTION: "Join our community by creating an account",
      REGISTRATION_TERMS_ENABLED: "true",
      REGISTRATION_TERMS_TEXT: "I agree to the Terms of Service and Privacy Policy",
    },
  })

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/config?category=registration")

        if (response.ok) {
          const data = await response.json()

          // Update form values
          const formValues: Record<string, any> = {}
          data.forEach((setting: any) => {
            formValues[setting.key] = setting.value
          })

          // Parse custom fields
          const customFieldsStr = formValues.REGISTRATION_CUSTOM_FIELDS || "[]"
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
        console.error("Failed to load registration settings:", error)
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: "An error occurred while loading registration settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [form, toast])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof registrationSettingsSchema>) => {
    setIsLoading(true)

    try {
      // Update custom fields in form values
      values.REGISTRATION_CUSTOM_FIELDS = JSON.stringify(customFields)

      // Convert values to array of settings
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || "",
        category: "registration",
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
        throw new Error("Failed to update registration settings")
      }

      toast({
        title: "Settings updated",
        description: "Registration settings have been updated successfully.",
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
            <TabsTrigger value="security">Security & Limits</TabsTrigger>
            <TabsTrigger value="customFields">Custom Fields</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Registration Settings</CardTitle>
                <CardDescription>Configure basic registration options for your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="REGISTRATION_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Registration</FormLabel>
                        <FormDescription>Allow new users to register on your platform</FormDescription>
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
                  name="REGISTRATION_APPROVAL_REQUIRED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Admin Approval</FormLabel>
                        <FormDescription>
                          New registrations require admin approval before accounts are activated
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
                  name="REGISTRATION_EMAIL_VERIFICATION"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Verification</FormLabel>
                        <FormDescription>
                          Require users to verify their email address during registration
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
                  name="REGISTRATION_PHONE_VERIFICATION"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Phone Verification</FormLabel>
                        <FormDescription>
                          Require users to verify their phone number during registration
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
                  name="REGISTRATION_SOCIAL_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Social Media Registration</FormLabel>
                        <FormDescription>Allow users to register using their social media accounts</FormDescription>
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
                  name="REGISTRATION_INVITATION_ONLY"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Invitation-Only Registration</FormLabel>
                        <FormDescription>Only allow users with invitation codes to register</FormDescription>
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
                <CardTitle>Security & Limits</CardTitle>
                <CardDescription>Configure security settings and registration limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="REGISTRATION_CAPTCHA_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable CAPTCHA</FormLabel>
                        <FormDescription>
                          Require CAPTCHA verification during registration to prevent spam
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
                  name="REGISTRATION_MAX_PER_IP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Registrations per IP</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Limit the number of accounts that can be created from a single IP address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="REGISTRATION_MAX_PER_DAY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Registrations per Day</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>Limit the total number of new registrations per day</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="REGISTRATION_BLOCKED_DOMAINS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blocked Email Domains</FormLabel>
                      <FormControl>
                        <Textarea placeholder="example.com, spam.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of email domains that are not allowed to register
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="REGISTRATION_ALLOWED_DOMAINS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed Email Domains</FormLabel>
                      <FormControl>
                        <Textarea placeholder="company.com, school.edu" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of email domains that are allowed to register (leave empty to allow all
                        domains except blocked ones)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customFields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Registration Fields</CardTitle>
                <CardDescription>
                  Create custom fields to collect additional information during registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Field Name</label>
                      <Input
                        placeholder="username"
                        value={newField.name || ""}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Internal field name (no spaces, lowercase)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Field Label</label>
                      <Input
                        placeholder="Username"
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

                    <div className="flex items-center space-x-2 mt-8">
                      <Switch
                        checked={newField.required || false}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                      />
                      <label className="text-sm font-medium">Required Field</label>
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
                        placeholder="Enter your username"
                        value={newField.placeholder || ""}
                        onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Choose a unique username"
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
                                      <div className="flex items-center">
                                        <span className="font-medium">{field.label}</span>
                                        {field.required && (
                                          <Badge variant="outline" className="ml-2">
                                            Required
                                          </Badge>
                                        )}
                                        <Badge className="ml-2">{field.type}</Badge>
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

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure email notifications for user registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="REGISTRATION_ADMIN_NOTIFICATION"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Admin Notifications</FormLabel>
                        <FormDescription>
                          Send email notifications to administrators when new users register
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
                  name="REGISTRATION_WELCOME_EMAIL"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Welcome Email</FormLabel>
                        <FormDescription>Send a welcome email to new users after registration</FormDescription>
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
                  name="REGISTRATION_WELCOME_EMAIL_TEMPLATE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Email Template</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Welcome to our platform, {{name}}!"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Template for welcome emails. You can use variables like {{ name }}, {{ email }}, and{" "}
                        {{ username }}.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration Page Appearance</CardTitle>
                <CardDescription>Customize the look and content of your registration page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="REGISTRATION_PAGE_TITLE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Title displayed on the registration page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="REGISTRATION_PAGE_DESCRIPTION"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Description text displayed on the registration page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="REGISTRATION_TERMS_ENABLED"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Terms & Conditions Checkbox</FormLabel>
                        <FormDescription>
                          Require users to accept terms and conditions during registration
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
                  name="REGISTRATION_TERMS_TEXT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Text displayed next to the terms and conditions checkbox</FormDescription>
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


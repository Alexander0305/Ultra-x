"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import HCaptcha from "@hcaptcha/react-hcaptcha"

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

// Define the type for registration settings
type RegistrationSettings = {
  REGISTRATION_ENABLED: string
  REGISTRATION_APPROVAL_REQUIRED: string
  REGISTRATION_EMAIL_VERIFICATION: string
  REGISTRATION_PHONE_VERIFICATION: string
  REGISTRATION_SOCIAL_ENABLED: string
  REGISTRATION_CAPTCHA_ENABLED: string
  REGISTRATION_INVITATION_ONLY: string
  REGISTRATION_CUSTOM_FIELDS: string
  REGISTRATION_PAGE_TITLE: string
  REGISTRATION_PAGE_DESCRIPTION: string
  REGISTRATION_TERMS_ENABLED: string
  REGISTRATION_TERMS_TEXT: string
  [key: string]: string
}

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<RegistrationSettings | null>(null)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Load registration settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings/registration")

        if (response.ok) {
          const data = await response.json()
          setSettings(data)

          // Parse custom fields
          try {
            const customFieldsData = JSON.parse(data.REGISTRATION_CUSTOM_FIELDS || "[]")
            setCustomFields(customFieldsData)
          } catch (e) {
            console.error("Failed to parse custom fields:", e)
          }
        }
      } catch (error) {
        console.error("Failed to load registration settings:", error)
      }
    }

    loadSettings()
  }, [])

  // Dynamically build the form schema based on custom fields
  const buildFormSchema = () => {
    const baseSchema = {
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
      invitationCode:
        settings?.REGISTRATION_INVITATION_ONLY === "true"
          ? z.string().min(1, "Invitation code is required")
          : z.string().optional(),
      terms:
        settings?.REGISTRATION_TERMS_ENABLED === "true"
          ? z.boolean().refine((val) => val === true, {
              message: "You must accept the terms and conditions",
            })
          : z.boolean().optional(),
    }

    // Add custom fields to schema
    const customSchema: Record<string, any> = {}

    customFields.forEach((field) => {
      let fieldSchema

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email(`Please enter a valid ${field.label.toLowerCase()}`)
          break
        case "tel":
          fieldSchema = z.string().regex(/^\+?[0-9\s\-$$$$]+$/, `Please enter a valid ${field.label.toLowerCase()}`)
          break
        case "number":
          fieldSchema = z.string().regex(/^[0-9]+$/, `Please enter a valid number for ${field.label.toLowerCase()}`)
          break
        case "date":
          fieldSchema = z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, `Please enter a valid date for ${field.label.toLowerCase()}`)
          break
        case "checkbox":
          fieldSchema = z.boolean()
          break
        case "select":
        case "radio":
          fieldSchema = z.string().min(1, `Please select a ${field.label.toLowerCase()}`)
          break
        case "textarea":
        case "text":
        default:
          fieldSchema = z.string()
          break
      }

      // Make field required if specified
      if (field.required) {
        if (field.type === "checkbox") {
          fieldSchema = fieldSchema.refine((val) => val === true, {
            message: `${field.label} is required`,
          })
        } else {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`)
        }
      } else {
        fieldSchema = fieldSchema.optional()
      }

      customSchema[field.name] = fieldSchema
    })

    // Add password confirmation validation
    const schema = z
      .object({
        ...baseSchema,
        ...customSchema,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })

    // Add captcha validation if enabled
    if (settings?.REGISTRATION_CAPTCHA_ENABLED === "true") {
      return schema.refine((data) => !!captchaToken, {
        message: "Please complete the CAPTCHA",
        path: ["captcha"],
      })
    }

    return schema
  }

  // Create form with dynamic schema
  const form = useForm<any>({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      invitationCode: "",
      terms: false,
      // Custom fields will be added dynamically
    },
  })

  // Handle form submission
  const onSubmit = async (values: any) => {
    setIsLoading(true)

    try {
      // Add captcha token if enabled
      if (settings?.REGISTRATION_CAPTCHA_ENABLED === "true") {
        values.captchaToken = captchaToken
      }

      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message
        toast({
          title: "Registration successful",
          description:
            settings?.REGISTRATION_APPROVAL_REQUIRED === "true"
              ? "Your account is pending approval. You will be notified when it is approved."
              : "Your account has been created successfully.",
        })

        // If email verification is required, redirect to verification page
        if (settings?.REGISTRATION_EMAIL_VERIFICATION === "true") {
          router.push("/auth/verify-email")
        }
        // If phone verification is required, redirect to verification page
        else if (settings?.REGISTRATION_PHONE_VERIFICATION === "true") {
          router.push("/auth/verify-phone")
        }
        // If approval is required, redirect to pending page
        else if (settings?.REGISTRATION_APPROVAL_REQUIRED === "true") {
          router.push("/auth/pending-approval")
        }
        // Otherwise, sign in and redirect to onboarding
        else {
          await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          })

          router.push("/onboarding")
        }
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle captcha verification
  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
  }

  // If settings are still loading, show loading state
  if (!settings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If registration is disabled, show message
  if (settings.REGISTRATION_ENABLED !== "true") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Registration is currently disabled. Please contact the administrator for more information.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{settings.REGISTRATION_PAGE_TITLE || "Create an Account"}</h1>
        <p className="text-muted-foreground">
          {settings.REGISTRATION_PAGE_DESCRIPTION || "Fill out the form below to create your account"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Render invitation code field if invitation-only registration is enabled */}
          {settings.REGISTRATION_INVITATION_ONLY === "true" && (
            <FormField
              control={form.control}
              name="invitationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your invitation code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Render custom fields */}
          {customFields.map((customField) => (
            <FormField
              key={customField.id}
              control={form.control}
              name={customField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{customField.label}</FormLabel>
                  <FormControl>
                    {customField.type === "text" && <Input placeholder={customField.placeholder} {...field} />}
                    {customField.type === "email" && (
                      <Input type="email" placeholder={customField.placeholder} {...field} />
                    )}
                    {customField.type === "tel" && (
                      <Input type="tel" placeholder={customField.placeholder} {...field} />
                    )}
                    {customField.type === "number" && (
                      <Input type="number" placeholder={customField.placeholder} {...field} />
                    )}
                    {customField.type === "date" && <Input type="date" {...field} />}
                    {customField.type === "textarea" && <Textarea placeholder={customField.placeholder} {...field} />}
                    {customField.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm text-muted-foreground">{customField.description}</span>
                      </div>
                    )}
                    {customField.type === "select" && (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={customField.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {customField.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {customField.type === "radio" && (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {customField.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${customField.name}-${option}`} />
                            <label htmlFor={`${customField.name}-${option}`} className="text-sm">
                              {option}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </FormControl>
                  {customField.description && customField.type !== "checkbox" && (
                    <FormDescription>{customField.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Render terms and conditions checkbox if enabled */}
          {settings.REGISTRATION_TERMS_ENABLED === "true" && (
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {settings.REGISTRATION_TERMS_TEXT || "I agree to the Terms of Service and Privacy Policy"}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Render CAPTCHA if enabled */}
          {settings.REGISTRATION_CAPTCHA_ENABLED === "true" && (
            <div className="space-y-2">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                onVerify={handleCaptchaVerify}
              />
              {form.formState.errors.captcha && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.captcha.message as string}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}


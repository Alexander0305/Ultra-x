"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, Mail, Key, Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Define the type for login settings
type LoginSettings = {
  LOGIN_USERNAME_ENABLED: string
  LOGIN_EMAIL_ENABLED: string
  LOGIN_PHONE_ENABLED: string
  LOGIN_SOCIAL_ENABLED: string
  LOGIN_PASSWORDLESS_ENABLED: string
  LOGIN_2FA_ENABLED: string
  LOGIN_MAX_ATTEMPTS: string
  LOGIN_REMEMBER_ME_ENABLED: string
  LOGIN_PAGE_TITLE: string
  LOGIN_PAGE_DESCRIPTION: string
  LOGIN_REDIRECT_URL: string
  [key: string]: string
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<LoginSettings | null>(null)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | "username">("email")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || settings?.LOGIN_REDIRECT_URL || "/"
  const error = searchParams.get("error")
  const { toast } = useToast()

  // Load login settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings/login")

        if (response.ok) {
          const data = await response.json()
          setSettings(data)

          // Set default login method based on settings
          if (data.LOGIN_EMAIL_ENABLED === "true") {
            setLoginMethod("email")
          } else if (data.LOGIN_USERNAME_ENABLED === "true") {
            setLoginMethod("username")
          } else if (data.LOGIN_PHONE_ENABLED === "true") {
            setLoginMethod("phone")
          }
        }
      } catch (error) {
        console.error("Failed to load login settings:", error)
      }
    }

    loadSettings()
  }, [])

  // Build form schema based on login method
  const buildFormSchema = () => {
    let identifierSchema

    switch (loginMethod) {
      case "email":
        identifierSchema = z.string().email("Please enter a valid email address")
        break
      case "phone":
        identifierSchema = z.string().regex(/^\+?[0-9\s\-$$$$]+$/, "Please enter a valid phone number")
        break
      case "username":
        identifierSchema = z.string().min(3, "Username must be at least 3 characters")
        break
      default:
        identifierSchema = z.string().min(1, "This field is required")
    }

    const schema = z.object({
      identifier: identifierSchema,
      password: z.string().min(1, "Password is required"),
      rememberMe: z.boolean().optional(),
    })

    return schema
  }

  // Create form with dynamic schema\
  const form = useForm<z.infer<typeof buildFormSchema()>>({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    }
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof buildFormSchema()>) => {
    setIsLoading(true)
    
    try {
      // Determine the identifier type
      const identifierType = loginMethod
      
      // Sign in
      const response = await signIn("credentials", {
        redirect: false,
        [identifierType]: values.identifier,
        password: values.password,
        callbackUrl,
      })
      
      if (response?.error) {
        // Check if the error is due to too many attempts
        if (response.error === "TooManyAttempts") {
          toast({
            variant: "destructive",
            title: "Account locked",
            description: "Too many failed login attempts. Please try again later.",
          })
        } 
        // Check if 2FA is required
        else if (response.error === "2FARequired") {
          // Store the identifier in session storage for the 2FA page
          sessionStorage.setItem("2fa_identifier", values.identifier)
          router.push("/auth/2fa")
        }
        // Handle other errors
        else {
          // Get remaining attempts if available
          const attemptsMatch = response.error.match(/Remaining attempts: (\d+)/)
          if (attemptsMatch && attemptsMatch[1]) {
            setRemainingAttempts(Number.parseInt(attemptsMatch[1]))
          }
          
          form.setError("root", { 
            message: "Invalid credentials. Please check your information and try again." 
          })
        }
      } else {
        // Successful login
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      form.setError("root", { 
        message: "An unexpected error occurred. Please try again." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle passwordless login
  const handlePasswordlessLogin = async () => {
    setIsLoading(true)

    try {
      const identifier = form.getValues("identifier")

      if (!identifier) {
        form.setError("identifier", { message: "Please enter your email or phone number" })
        return
      }

      // Send passwordless login link/code
      const response = await fetch("/api/auth/passwordless", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          type: loginMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Check your inbox",
          description:
            loginMethod === "phone"
              ? "We've sent a verification code to your phone number."
              : "We've sent a login link to your email address.",
        })

        // Redirect to verification page
        if (loginMethod === "phone") {
          router.push(`/auth/verify-code?identifier=${encodeURIComponent(identifier)}`)
        } else {
          router.push("/auth/check-email")
        }
      } else {
        throw new Error(data.error || "Failed to send login link/code")
      }
    } catch (error) {
      console.error("Passwordless login error:", error)
      toast({
        variant: "destructive",
        title: "Failed to send login link/code",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true)
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`${provider} login error:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // If settings are still loading, show loading state
  if (!settings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{settings.LOGIN_PAGE_TITLE || "Log In"}</h1>
        <p className="text-muted-foreground">{settings.LOGIN_PAGE_DESCRIPTION || "Log in to your account"}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error === "CredentialsSignin" ? "Invalid email or password" : "An error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Login method tabs */}
      {(settings.LOGIN_EMAIL_ENABLED === "true" ||
        settings.LOGIN_USERNAME_ENABLED === "true" ||
        settings.LOGIN_PHONE_ENABLED === "true") && (
        <Tabs
          value={loginMethod}
          onValueChange={(value) => setLoginMethod(value as "email" | "phone" | "username")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            {settings.LOGIN_EMAIL_ENABLED === "true" && (
              <TabsTrigger value="email" disabled={isLoading}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
            )}
            {settings.LOGIN_USERNAME_ENABLED === "true" && (
              <TabsTrigger value="username" disabled={isLoading}>
                <span className="h-4 w-4 mr-2">@</span>
                Username
              </TabsTrigger>
            )}
            {settings.LOGIN_PHONE_ENABLED === "true" && (
              <TabsTrigger value="phone" disabled={isLoading}>
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {loginMethod === "email" ? "Email" : loginMethod === "phone" ? "Phone Number" : "Username"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      loginMethod === "email"
                        ? "name@example.com"
                        : loginMethod === "phone"
                          ? "+1 (555) 123-4567"
                          : "johndoe"
                    }
                    type={loginMethod === "email" ? "email" : "text"}
                    {...field}
                  />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {settings.LOGIN_REMEMBER_ME_ENABLED === "true" && (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                    <FormDescription>Stay logged in on this device</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}

          {remainingAttempts !== null && (
            <p className="text-sm text-amber-600">Remaining login attempts: {remainingAttempts}</p>
          )}

          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Log in
                </>
              )}
            </Button>

            {settings.LOGIN_PASSWORDLESS_ENABLED === "true" && (loginMethod === "email" || loginMethod === "phone") && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePasswordlessLogin}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {loginMethod === "email" ? "Email me a login link" : "Text me a login code"}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {settings.LOGIN_SOCIAL_ENABLED === "true" && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" type="button" onClick={() => handleSocialLogin("google")} disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
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
              Google
            </Button>
            <Button variant="outline" type="button" onClick={() => handleSocialLogin("facebook")} disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4 text-blue-600">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  fill="currentColor"
                />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  )
}


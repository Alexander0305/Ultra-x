"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Loader2, Upload } from "lucide-react"

// Define the schema for admin user
const adminUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SetupAdminUserStepProps = {
  onNext: (data: any) => void
  initialData: any
}

export default function SetupAdminUserStep({ onNext, initialData }: SetupAdminUserStepProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null)
  const [uploading, setUploading] = useState(false)

  // Create form
  const form = useForm<z.infer<typeof adminUserSchema>>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: initialData || {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  })

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError("avatar", { message: "File is too large. Maximum size is 5MB." })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      form.setError("avatar", { message: "Only image files are allowed." })
      return
    }

    // Create file preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/setup/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload avatar")
      }

      const data = await response.json()
      form.setValue("avatar", data.url)
    } catch (error) {
      console.error("Avatar upload error:", error)
      form.setError("avatar", {
        message: error instanceof Error ? error.message : "Failed to upload avatar",
      })
      setAvatarPreview(null)
    } finally {
      setUploading(false)
    }
  }

  // Submit the form
  const onSubmit = (values: z.infer<typeof adminUserSchema>) => {
    // Remove confirmPassword before passing to next step
    const { confirmPassword, ...adminData } = values
    onNext(adminData)
  }

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Form {...form}>
      <form id="setup-form-admin" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatarPreview || ""} />
            <AvatarFallback className="text-2xl">{getInitials(form.watch("name") || "A")}</AvatarFallback>
          </Avatar>

          <div className="relative">
            <Input
              type="file"
              id="avatar-upload"
              className="sr-only"
              onChange={handleAvatarUpload}
              accept="image/*"
              disabled={uploading}
            />
            <Button type="button" variant="outline" size="sm" asChild>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                Upload Avatar
              </label>
            </Button>
          </div>
          {form.formState.errors.avatar && (
            <p className="text-destructive text-sm mt-2">{form.formState.errors.avatar.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormDescription>This will be your login username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormDescription>This will be used for account recovery and notifications</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>At least 8 characters</FormDescription>
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}


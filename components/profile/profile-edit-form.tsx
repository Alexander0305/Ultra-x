"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

// Define the type for profile settings
type ProfileSettings = {
  PROFILE_BIO_ENABLED: string
  PROFILE_BIO_MAX_LENGTH: string
  PROFILE_LOCATION_ENABLED: string
  PROFILE_WEBSITE_ENABLED: string
  PROFILE_SOCIAL_LINKS_ENABLED: string
  PROFILE_AVATAR_ENABLED: string
  PROFILE_AVATAR_MAX_SIZE: string
  PROFILE_COVER_ENABLED: string
  PROFILE_COVER_MAX_SIZE: string
  PROFILE_PRIVACY_ENABLED: string
  PROFILE_DEFAULT_PRIVACY: string
  PROFILE_ACTIVITY_TRACKING: string
  PROFILE_CUSTOM_FIELDS: string
  [key: string]: string
}

// Define the type for user profile
type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  bio?: string
  location?: string
  website?: string
  occupation?: string
  avatar?: string
  coverImage?: string
  customFields?: Record<string, any>
  privacy?: Record<string, string>
}

export default function ProfileEditForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ProfileSettings | null>(null)
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Load profile settings and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load profile settings
        const settingsResponse = await fetch("/api/settings/profile")
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
          
          // Parse custom fields
          try {
            const customFieldsData = JSON.parse(settingsData.PROFILE_CUSTOM_FIELDS || "[]")
            setCustomFields(customFieldsData)
          } catch (e) {
            console.error("Failed to parse custom fields:", e)
          }
        }
        
        // Load user profile
        const userResponse = await fetch(`/api/user/profile/${userId}`)
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
          
          // Set avatar and cover previews
          if (userData.avatar) {
            setAvatarPreview(userData.avatar)
          }
          
          if (userData.coverImage) {
            setCoverPreview(userData.coverImage)
          }
        }
      } catch (error) {
        console.error("Failed to load profile data:", error)
        toast({
          variant: "destructive",
          title: "Failed to load profile data",
          description: "An error occurred while loading your profile data.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [userId, toast])
  
  // Dynamically build the form schema based on settings and custom fields
  const buildFormSchema = () => {
    const baseSchema: Record<string, any> = {
      name: z.string().min(2, "Name must be at least 2 characters"),
      username: z.string().min(3, "Username must be at least 3 characters"),
    }
    
    // Add bio field if enabled
    if (settings?.PROFILE_BIO_ENABLED === "true") {
      const maxLength = Number.parseInt(settings.PROFILE_BIO_MAX_LENGTH || "500")
      baseSchema.bio = z.string().max(maxLength, `Bio must be less than ${maxLength} characters`).optional()
    }
    
    // Add location field if enabled
    if (settings?.PROFILE_LOCATION_ENABLED === "true") {
      baseSchema.location = z.string().optional()
    }
    
    // Add website field if enabled
    if (settings?.PROFILE_WEBSITE_ENABLED === "true") {
      baseSchema.website = z.string().url("Please enter a valid URL").optional().or(z.literal(""))
    }
    
    // Add social links fields if enabled
    if (settings?.PROFILE_SOCIAL_LINKS_ENABLED === "true") {
      baseSchema.socialLinks = z.object({
        twitter: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      }).optional()
    }
    
    // Add custom fields to schema
    customFields.forEach(field => {
      let fieldSchema
      
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email(`Please enter a valid ${field.label.toLowerCase()}`).optional().or(z.literal(""))
          break
        case 'tel':
          fieldSchema = z.string().regex(/^\+?[0-9\s\-$$$$]+$/, `Please enter a valid ${field.label.toLowerCase()}`).optional().or(z.literal(""))
          break
        case 'number':
          fieldSchema = z.string().regex(/^[0-9]*$/, `Please enter a valid number for ${field.label.toLowerCase()}`).optional().or(z.literal(""))
          break
        case 'date':
          fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, `Please enter a valid date for ${field.label.toLowerCase()}`).optional().or(z.literal(""))
          break
        case 'checkbox':
          fieldSchema = z.boolean().optional()
          break
        case 'select':
        case 'radio':
          fieldSchema = z.string().optional()
          break
        case 'textarea':
        case 'text':
        default:
          fieldSchema = z.string().optional()
          break
      }
      
      // Make field required if specified
      if (field.required) {
        if (field.type === 'checkbox') {
          fieldSchema = z.boolean().refine(val => val === true, {
            message: `${field.label} is required`,
          })
        } else {
          fieldSchema = z.string().min(1, `${field.label} is required`)
        }
      }
      
      // Add to schema
      baseSchema[`custom_${field.name}`] = fieldSchema
      
      // Add privacy control if enabled
      if (field.privacy && settings?.PROFILE_PRIVACY_ENABLED === "true") {
        baseSchema[`privacy_${field.name}`] = z.enum(["public", "friends", "private"]).default("public")
      }
    })
    
    // Add privacy controls for standard fields if enabled
    if (settings?.PROFILE_PRIVACY_ENABLED === "true") {
      baseSchema.privacyBio = z.enum(["public", "friends", "private"]).default("public")
      baseSchema.privacyLocation = z.enum(["public", "friends", "private"]).default("public")
      baseSchema.privacyWebsite = z.enum(["public", "friends", "private"]).default("public")
      baseSchema.privacySocialLinks = z.enum(["public", "friends", "private"]).default("public")
    }
    
    return z.object(baseSchema)
  }
  
  // Create form with dynamic schema
  const form = useForm<any>({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      socialLinks: {
        twitter: user?.customFields?.twitter || "",
        facebook: user?.customFields?.facebook || "",
        instagram: user?.customFields?.instagram || "",
        linkedin: user?.customFields?.linkedin || "",
        github: user?.customFields?.github || "",
      },
      // Custom fields and privacy settings will be set when user data is loaded
    }
  })
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      // Set basic fields
      form.setValue("name", user.name)
      form.setValue("username", user.username)
      form.setValue("bio", user.bio || "")
      form.setValue("location", user.location || "")
      form.setValue("website", user.website || "")
      
      // Set social links
      if (user.customFields) {
        form.setValue("socialLinks.twitter", user.customFields.twitter || "")
        form.setValue("socialLinks.facebook", user.customFields.facebook || "")
        form.setValue("socialLinks.instagram", user.customFields.instagram || "")
        form.setValue("socialLinks.linkedin", user.customFields.linkedin || "")
        form.setValue("socialLinks.github", user.customFields.github || "")
      }
      
      // Set custom fields
      customFields.forEach(field => {
        if (user.customFields && user.customFields[field.name] !== undefined) {
          form.setValue(`custom_${field.name}`, user.customFields[field.name])
        }
      })
      
      // Set privacy settings
      if (user.privacy && settings?.PROFILE_PRIVACY_ENABLED === "true") {
        form.setValue("privacyBio", user.privacy.bio || "public")
        form.setValue("privacyLocation", user.privacy.location || "public")
        form.setValue("privacyWebsite", user.privacy.website || "public")
        form.setValue("privacySocialLinks", user.privacy.socialLinks || "public")
        
        // Set custom field privacy
        customFields.forEach(field => {
          if (field.privacy && user.privacy && user.privacy[field.name] !== undefined) {
            form.setValue(`privacy_${field.name}`, user.privacy[field.name])
          }
        })
      }
    }
  }, [user, customFields, form, settings])
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Check file size
    const maxSize = Number.parseInt(settings?.PROFILE_AVATAR_MAX_SIZE || "2") * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Avatar image must be less than ${settings?.PROFILE_AVATAR_MAX_SIZE || "2"}MB`,
      })
      return
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      })
      return
    }
    
    // Create file preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Upload file
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "avatar")
      
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload avatar")
      }
      
      const data = await response.json()
      form.setValue("avatar", data.url)
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully",
      })
    } catch (error) {
      console.error("Avatar upload error:", error)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
      })
      setAvatarPreview(user?.avatar || null)
    }
  }
  
  // Handle cover photo upload
  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Check file size
    const maxSize = Number.parseInt(settings?.PROFILE_COVER_MAX_SIZE || "5") * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Cover image must be less than ${settings?.PROFILE_COVER_MAX_SIZE || "5"}MB`,
      })
      return
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      })
      return
    }
    
    // Create file preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    // Upload file
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "cover")
      
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload cover photo")
      }
      
      const data = await response.json()
      form.setValue("coverImage", data.url)
      
      toast({
        title: "Cover photo uploaded",
        description: "Your cover photo has been uploaded successfully",
      })
    } catch (error) {
      console.error("Cover upload error:", error)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload cover photo",
      })
      setCoverPreview(user?.coverImage || null)
    }
  }
  
  // Handle form submission
  const onSubmit = async (values: any) => {
    setIsLoading(true)
    
    try {
      // Prepare custom fields data
      const customFieldsData: Record<string, any> = {}
      
      customFields.forEach(field => {
        customFieldsData[field.name] = values[`custom_${field.name}`]
      })
      
      // Add social links to custom fields
      if (settings?.PROFILE_SOCIAL_LINKS_ENABLED === "true") {
        customFieldsData.twitter = values.socialLinks?.twitter
        customFieldsData.facebook = values.socialLinks?.facebook
        customFieldsData.instagram = values.socialLinks?.instagram
        customFieldsData.linkedin = values.socialLinks?.linkedin
        customFieldsData.github = values.socialLinks?.github
      }
      
      // Prepare privacy settings
      const privacySettings: Record<string, string> = {}
      
      if (settings?.PROFILE_PRIVACY_ENABLED === "true") {
        privacySettings.bio = values.privacyBio
        privacySettings.location = values.privacyLocation
        privacySettings.website = values.privacyWebsite
        privacySettings.socialLinks = values.privacySocialLinks
        
        // Add custom field privacy settings
        customFields.forEach(field => {
          if (field.privacy) {
            privacySettings[field.name] = values[`privacy_${field.name}`]
          }
        })
      }
      
      // Prepare profile data
      const profileData = {
        name: values.name,
        username: values.username,
        bio: values.bio,
        location: values.location,
        website: values.website,
        avatar: values.avatar,
        coverImage: values.coverImage,
        customFields: customFieldsData,
        privacy: privacySettings,
      }
      
      // Update profile
      const response = await fetch(`/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // If settings are still loading, show loading state
  if (!settings || !user) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            {settings.PROFILE_AVATAR_ENABLED === "true" && (
              <TabsTrigger value="media">Profile Media</TabsTrigger>
            )}
            {customFields.length > 0 && (
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            )}
            {settings.PROFILE_SOCIAL_LINKS_ENABLED === "true" && (
              <TabsTrigger value="social">Social Links</TabsTrigger>
            )}
            {settings.PROFILE_PRIVACY_ENABLED === "true" && (
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Your full name as it will appear on your profile
                      </FormDescription>
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Your unique username for your profile URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {settings.PROFILE_BIO_ENABLED === "true" && (
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell us about yourself"
                            maxLength={Number.parseInt(settings.PROFILE_BIO_MAX_LENGTH || "500")}
                          />
                        </FormControl>
                        <FormDescription>
                          {`A brief description about yourself (max ${settings.PROFILE_BIO_MAX_LENGTH || "500"} characters)`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {settings.PROFILE_LOCATION_ENABLED === "true" && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City, Country" />
                        </FormControl>
                        <FormDescription>
                          Your current location
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {settings.PROFILE_WEBSITE_ENABLED === "true" && (
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com" />
                        </FormControl>
                        <FormDescription>
                          Your personal or professional website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {settings.PROFILE_AVATAR_ENABLED === "true" && (
            <TabsContent value="media" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Media</CardTitle>
                  <CardDescription>
                    Update your profile picture and cover photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || "/placeholder-user.jpg"} alt="Profile picture" />
                        <AvatarFallback>{user?.name}</AvatarFallback>\


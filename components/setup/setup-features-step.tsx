"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Image, Ban, Bot, Bell } from "lucide-react"

// Define the schema for features
const featuresSchema = z.object({
  // Social Features
  enableGroups: z.boolean().default(true),
  enableEvents: z.boolean().default(true),
  enableMarketplace: z.boolean().default(true),
  enableStories: z.boolean().default(true),
  enableMessaging: z.boolean().default(true),
  enableVideoChat: z.boolean().default(false),

  // Media Features
  enablePhotoUploads: z.boolean().default(true),
  enableVideoUploads: z.boolean().default(true),
  enableAudioUploads: z.boolean().default(true),
  enableDocumentUploads: z.boolean().default(true),

  // Moderation Features
  enableContentModeration: z.boolean().default(true),
  enableUserReports: z.boolean().default(true),
  enableProfanityFilter: z.boolean().default(true),
  enableSpamDetection: z.boolean().default(true),

  // AI Features
  enableAIContentRecommendations: z.boolean().default(false),
  enableAIImageGeneration: z.boolean().default(false),
  enableAIContentModeration: z.boolean().default(false),
  enableAIAssistant: z.boolean().default(false),

  // Notification Features
  enableEmailNotifications: z.boolean().default(true),
  enablePushNotifications: z.boolean().default(true),
  enableInAppNotifications: z.boolean().default(true),
})

type SetupFeaturesStepProps = {
  onNext: (data: any) => void
  initialData: any
}

export default function SetupFeaturesStep({ onNext, initialData }: SetupFeaturesStepProps) {
  // Create form
  const form = useForm<z.infer<typeof featuresSchema>>({
    resolver: zodResolver(featuresSchema),
    defaultValues: initialData || {
      // Social Features
      enableGroups: true,
      enableEvents: true,
      enableMarketplace: true,
      enableStories: true,
      enableMessaging: true,
      enableVideoChat: false,

      // Media Features
      enablePhotoUploads: true,
      enableVideoUploads: true,
      enableAudioUploads: true,
      enableDocumentUploads: true,

      // Moderation Features
      enableContentModeration: true,
      enableUserReports: true,
      enableProfanityFilter: true,
      enableSpamDetection: true,

      // AI Features
      enableAIContentRecommendations: false,
      enableAIImageGeneration: false,
      enableAIContentModeration: false,
      enableAIAssistant: false,

      // Notification Features
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableInAppNotifications: true,
    },
  })

  // Submit the form
  const onSubmit = (values: z.infer<typeof featuresSchema>) => {
    onNext(values)
  }

  const FeatureSwitch = ({ name, label, description }: { name: any; label: string; description: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form id="setup-form-features" onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="social">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="media">
              <Image className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Ban className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Features</CardTitle>
                <CardDescription>Enable or disable core social networking features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureSwitch name="enableGroups" label="Groups" description="Allow users to create and join groups" />
                <FeatureSwitch
                  name="enableEvents"
                  label="Events"
                  description="Allow users to create and RSVP to events"
                />
                <FeatureSwitch
                  name="enableMarketplace"
                  label="Marketplace"
                  description="Allow users to buy and sell items"
                />
                <FeatureSwitch
                  name="enableStories"
                  label="Stories"
                  description="Enable ephemeral content that disappears after 24 hours"
                />
                <FeatureSwitch
                  name="enableMessaging"
                  label="Messaging"
                  description="Allow users to send private messages to each other"
                />
                <FeatureSwitch
                  name="enableVideoChat"
                  label="Video Chat"
                  description="Enable real-time video calls between users"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media Features</CardTitle>
                <CardDescription>Control which types of media users can upload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureSwitch
                  name="enablePhotoUploads"
                  label="Photo Uploads"
                  description="Allow users to upload photos"
                />
                <FeatureSwitch
                  name="enableVideoUploads"
                  label="Video Uploads"
                  description="Allow users to upload videos"
                />
                <FeatureSwitch
                  name="enableAudioUploads"
                  label="Audio Uploads"
                  description="Allow users to upload audio files"
                />
                <FeatureSwitch
                  name="enableDocumentUploads"
                  label="Document Uploads"
                  description="Allow users to upload document files"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Features</CardTitle>
                <CardDescription>Tools to help maintain a safe community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureSwitch
                  name="enableContentModeration"
                  label="Content Moderation"
                  description="Review content before it's published"
                />
                <FeatureSwitch
                  name="enableUserReports"
                  label="User Reports"
                  description="Allow users to report inappropriate content"
                />
                <FeatureSwitch
                  name="enableProfanityFilter"
                  label="Profanity Filter"
                  description="Automatically filter offensive language"
                />
                <FeatureSwitch
                  name="enableSpamDetection"
                  label="Spam Detection"
                  description="Automatically detect and block spam content"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Features</CardTitle>
                <CardDescription>Advanced AI-powered features (requires additional configuration)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureSwitch
                  name="enableAIContentRecommendations"
                  label="Content Recommendations"
                  description="Use AI to recommend relevant content to users"
                />
                <FeatureSwitch
                  name="enableAIImageGeneration"
                  label="AI Image Generation"
                  description="Allow users to generate images with AI"
                />
                <FeatureSwitch
                  name="enableAIContentModeration"
                  label="AI Content Moderation"
                  description="Use AI to detect inappropriate content"
                />
                <FeatureSwitch
                  name="enableAIAssistant"
                  label="AI Assistant"
                  description="Provide an AI assistant to help users"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Features</CardTitle>
                <CardDescription>Configure how users receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureSwitch
                  name="enableEmailNotifications"
                  label="Email Notifications"
                  description="Send notifications via email"
                />
                <FeatureSwitch
                  name="enablePushNotifications"
                  label="Push Notifications"
                  description="Send browser and mobile push notifications"
                />
                <FeatureSwitch
                  name="enableInAppNotifications"
                  label="In-App Notifications"
                  description="Show notifications within the application"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Camera, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    location: "",
    website: "",
    occupation: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [interests, setInterests] = useState<string[]>([])
  const [interestInput, setInterestInput] = useState("")

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()])
      setInterestInput("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddInterest()
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Upload avatar if selected
      let avatarUrl = session?.user?.image || ""
      if (avatarFile) {
        const formData = new FormData()
        formData.append("file", avatarFile)
        formData.append("type", "avatar")

        const avatarResponse = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!avatarResponse.ok) {
          throw new Error("Failed to upload avatar")
        }

        const avatarData = await avatarResponse.json()
        avatarUrl = avatarData.url
      }

      // Upload cover if selected
      let coverUrl = ""
      if (coverFile) {
        const formData = new FormData()
        formData.append("file", coverFile)
        formData.append("type", "cover")

        const coverResponse = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!coverResponse.ok) {
          throw new Error("Failed to upload cover image")
        }

        const coverData = await coverResponse.json()
        coverUrl = coverData.url
      }

      // Update user profile
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          avatar: avatarUrl,
          coverImage: coverUrl,
          interests,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          image: avatarUrl,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Onboarding error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-primary-foreground">SN</span>
          </div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Let's set up your profile to get started</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step {step} of 3</CardTitle>
                <CardDescription>
                  {step === 1 && "Basic information"}
                  {step === 2 && "Profile pictures"}
                  {step === 3 && "Interests and preferences"}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                <div className={`h-2 w-10 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 w-10 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 w-10 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="johndoe"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">This will be your unique identifier on the platform.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself..."
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="San Francisco, CA"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    placeholder="Software Engineer"
                    value={profileData.occupation}
                    onChange={handleProfileChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarPreview || session?.user?.image || ""} alt="Avatar" />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="avatar-upload"
                        className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Choose file</span>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                          disabled={isLoading}
                        />
                      </Label>
                      {avatarPreview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAvatarFile(null)
                            setAvatarPreview(null)
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400px</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Cover Photo</Label>
                  <div className="relative aspect-[3/1] w-full overflow-hidden rounded-md border bg-muted">
                    {coverPreview ? (
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">No cover photo selected</p>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Label
                        htmlFor="cover-upload"
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-background px-4 py-2 shadow hover:bg-muted"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                        <Input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                          disabled={isLoading}
                        />
                      </Label>
                      {coverPreview && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background"
                          onClick={() => {
                            setCoverFile(null)
                            setCoverPreview(null)
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended: 1200x400px or larger</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="interests">Interests</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="interests"
                      placeholder="Add your interests (e.g., Photography, Travel)"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                    <Button type="button" onClick={handleAddInterest} disabled={!interestInput.trim() || isLoading}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="rounded-full p-1 hover:bg-muted-foreground/20"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {interest}</span>
                        </button>
                      </div>
                    ))}
                    {interests.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add some interests to help us personalize your experience
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Preferences</Label>
                  <Tabs defaultValue="privacy">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="privacy" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Profile Visibility</h4>
                            <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                          </div>
                          <select className="rounded-md border p-2" defaultValue="public" disabled={isLoading}>
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Search Engine Visibility</h4>
                            <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
                          </div>
                          <select className="rounded-md border p-2" defaultValue="yes" disabled={isLoading}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="notifications" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <select className="rounded-md border p-2" defaultValue="all" disabled={isLoading}>
                            <option value="all">All Notifications</option>
                            <option value="important">Important Only</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                          </div>
                          <select className="rounded-md border p-2" defaultValue="all" disabled={isLoading}>
                            <option value="all">All Notifications</option>
                            <option value="important">Important Only</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button onClick={nextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


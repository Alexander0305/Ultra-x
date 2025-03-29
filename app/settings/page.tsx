"use client"

import { useState } from "react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Lock, Bell, Globe, Shield, UserCog, Wallet, Users } from "lucide-react"

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState("/placeholder-user.jpg")
  const [coverImage, setCoverImage] = useState("/placeholder.svg")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 py-6">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile">
            <div className="flex overflow-x-auto pb-2">
              <TabsList className="inline-flex h-auto p-1">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* Profile Cover & Avatar */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="h-48 bg-muted overflow-hidden">
                      <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                      <Button size="icon" className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change cover</span>
                      </Button>
                    </div>
                    <div className="absolute -bottom-16 left-4 flex items-end">
                      <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-background">
                          <AvatarImage src={profileImage} alt="Profile" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary">
                          <Camera className="h-4 w-4 text-primary-foreground" />
                          <span className="sr-only">Change avatar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="mt-16">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue="UI/UX Designer and Frontend Developer passionate about creating beautiful and functional user experiences."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="San Francisco, CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://johndoe.design" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              {/* Work & Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Work & Education</CardTitle>
                  <CardDescription>Add your work and education history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Work Experience</Label>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border p-3 rounded-md">
                        <div>
                          <div className="font-medium">Senior UI Designer</div>
                          <div className="text-sm text-muted-foreground">Creative Agency • 2020 - Present</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <div className="flex justify-between items-start border p-3 rounded-md">
                        <div>
                          <div className="font-medium">UI/UX Designer</div>
                          <div className="text-sm text-muted-foreground">Tech Solutions Inc. • 2018 - 2020</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Work Experience
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border p-3 rounded-md">
                        <div>
                          <div className="font-medium">Master's in Interaction Design</div>
                          <div className="text-sm text-muted-foreground">Design University • 2016 - 2018</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <div className="flex justify-between items-start border p-3 rounded-md">
                        <div>
                          <div className="font-medium">Bachelor's in Graphic Design</div>
                          <div className="text-sm text-muted-foreground">Art Institute • 2012 - 2016</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Education
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your content and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Profile Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <p className="text-sm text-muted-foreground">Who can see your profile</p>
                        </div>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Friends Only</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="posts-visibility">Posts Visibility</Label>
                          <p className="text-sm text-muted-foreground">Who can see your posts</p>
                        </div>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Friends Only</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="friends-list">Friends List</Label>
                          <p className="text-sm text-muted-foreground">Who can see your friends list</p>
                        </div>
                        <Select defaultValue="friends">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Friends Only</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Contact Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Who can send you friend requests</Label>
                          <p className="text-sm text-muted-foreground">Control who can send you friend requests</p>
                        </div>
                        <Select defaultValue="everyone">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="friends-of-friends">Friends of Friends</SelectItem>
                            <SelectItem value="nobody">Nobody</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Who can message you</Label>
                          <p className="text-sm text-muted-foreground">Control who can send you messages</p>
                        </div>
                        <Select defaultValue="friends">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="nobody">Nobody</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Activity Status</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="active-status">Show Active Status</Label>
                        <p className="text-sm text-muted-foreground">Let people know when you're active</p>
                      </div>
                      <Switch id="active-status" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data & Personalization</CardTitle>
                  <CardDescription>Manage your data and personalization settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalized-ads">Personalized Ads</Label>
                      <p className="text-sm text-muted-foreground">Allow personalized ads based on your activity</p>
                    </div>
                    <Switch id="personalized-ads" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow collection of your usage data to improve services
                      </p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      Download Your Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-all">All Notifications</Label>
                          <p className="text-sm text-muted-foreground">Enable or disable all push notifications</p>
                        </div>
                        <Switch id="push-all" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-likes">Likes & Reactions</Label>
                          <p className="text-sm text-muted-foreground">When someone likes or reacts to your posts</p>
                        </div>
                        <Switch id="push-likes" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-comments">Comments</Label>
                          <p className="text-sm text-muted-foreground">When someone comments on your posts</p>
                        </div>
                        <Switch id="push-comments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-friend-requests">Friend Requests</Label>
                          <p className="text-sm text-muted-foreground">When someone sends you a friend request</p>
                        </div>
                        <Switch id="push-friend-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-messages">Messages</Label>
                          <p className="text-sm text-muted-foreground">When you receive a new message</p>
                        </div>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-events">Events</Label>
                          <p className="text-sm text-muted-foreground">Updates about events you're interested in</p>
                        </div>
                        <Switch id="push-events" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-all">All Emails</Label>
                          <p className="text-sm text-muted-foreground">Enable or disable all email notifications</p>
                        </div>
                        <Switch id="email-all" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-updates">Account Updates</Label>
                          <p className="text-sm text-muted-foreground">Important updates about your account</p>
                        </div>
                        <Switch id="email-updates" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-news">News & Updates</Label>
                          <p className="text-sm text-muted-foreground">News and updates about the platform</p>
                        </div>
                        <Switch id="email-news" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Promotional emails and special offers</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and login settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Change Password</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="two-factor" />
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        Set Up Two-Factor Authentication
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Login Sessions</h3>
                    <div className="space-y-3">
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Current Session</div>
                            <div className="text-sm text-muted-foreground">
                              <span className="text-green-500">●</span> Active now • Chrome on Windows
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">Your current session</div>
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Mobile App</div>
                            <div className="text-sm text-muted-foreground">Last active 2 hours ago • iPhone 13</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Log Out
                          </Button>
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Safari Browser</div>
                            <div className="text-sm text-muted-foreground">Last active yesterday • MacBook Pro</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Log Out
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Log Out of All Sessions
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Account Activity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="login-alerts">Login Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of new logins to your account</p>
                        </div>
                        <Switch id="login-alerts" defaultChecked />
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        View Account Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet & Payments</CardTitle>
                  <CardDescription>Manage your wallet, payment methods, and transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Your Balance</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold">$250.00</div>
                      <div className="text-sm text-muted-foreground">Available Balance</div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Add Funds</Button>
                      <Button variant="outline" className="flex-1">
                        Withdraw
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                              <span className="font-medium">Visa</span>
                            </div>
                            <div>
                              <div className="font-medium">Visa ending in 4242</div>
                              <div className="text-sm text-muted-foreground">Expires 12/25</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                              <span className="font-medium">PayPal</span>
                            </div>
                            <div>
                              <div className="font-medium">PayPal</div>
                              <div className="text-sm text-muted-foreground">john.doe@example.com</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Recent Transactions</h3>
                      <Button variant="link" className="p-0 h-auto">
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Premium Subscription</div>
                            <div className="text-sm text-muted-foreground">Mar 15, 2024</div>
                          </div>
                          <div className="font-medium">-$9.99</div>
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Marketplace Purchase</div>
                            <div className="text-sm text-muted-foreground">Mar 10, 2024</div>
                          </div>
                          <div className="font-medium">-$24.99</div>
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Added Funds</div>
                            <div className="text-sm text-muted-foreground">Mar 5, 2024</div>
                          </div>
                          <div className="font-medium text-green-600">+$100.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}


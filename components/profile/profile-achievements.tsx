"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Trophy, Star, Shield, Zap, Target, Crown, Medal, Gift, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  dateEarned?: string
  category: string
  points: number
}

interface Badge {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  isActive: boolean
  dateEarned?: string
  category: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export default function ProfileAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "post-10",
      title: "Content Creator",
      description: "Create 10 posts",
      icon: <Zap className="h-6 w-6" />,
      progress: 7,
      maxProgress: 10,
      category: "content",
      points: 50,
    },
    {
      id: "comment-25",
      title: "Conversation Starter",
      description: "Leave 25 comments",
      icon: <Target className="h-6 w-6" />,
      progress: 25,
      maxProgress: 25,
      dateEarned: "2023-05-15",
      category: "engagement",
      points: 75,
    },
    {
      id: "like-50",
      title: "Appreciator",
      description: "Like 50 posts",
      icon: <Star className="h-6 w-6" />,
      progress: 42,
      maxProgress: 50,
      category: "engagement",
      points: 100,
    },
    {
      id: "profile-complete",
      title: "Identity Established",
      description: "Complete your profile information",
      icon: <Shield className="h-6 w-6" />,
      progress: 100,
      maxProgress: 100,
      dateEarned: "2023-04-10",
      category: "profile",
      points: 50,
    },
    {
      id: "friend-10",
      title: "Social Butterfly",
      description: "Connect with 10 friends",
      icon: <Crown className="h-6 w-6" />,
      progress: 8,
      maxProgress: 10,
      category: "social",
      points: 75,
    },
    {
      id: "group-join",
      title: "Community Member",
      description: "Join 5 groups",
      icon: <Trophy className="h-6 w-6" />,
      progress: 3,
      maxProgress: 5,
      category: "social",
      points: 50,
    },
  ])

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "early-adopter",
      title: "Early Adopter",
      description: "Joined during the platform's first month",
      icon: <Award className="h-6 w-6" />,
      isActive: true,
      dateEarned: "2023-03-01",
      category: "special",
      rarity: "rare",
    },
    {
      id: "verified",
      title: "Verified User",
      description: "Identity has been verified",
      icon: <Shield className="h-6 w-6" />,
      isActive: true,
      dateEarned: "2023-04-15",
      category: "profile",
      rarity: "uncommon",
    },
    {
      id: "premium",
      title: "Premium Member",
      description: "Subscribed to premium membership",
      icon: <Crown className="h-6 w-6" />,
      isActive: false,
      category: "membership",
      rarity: "epic",
    },
    {
      id: "contributor",
      title: "Top Contributor",
      description: "One of the top 10% contributors this month",
      icon: <Star className="h-6 w-6" />,
      isActive: true,
      dateEarned: "2023-06-01",
      category: "engagement",
      rarity: "rare",
    },
    {
      id: "event-host",
      title: "Event Host",
      description: "Successfully hosted an event",
      icon: <Gift className="h-6 w-6" />,
      isActive: false,
      category: "events",
      rarity: "uncommon",
    },
    {
      id: "trendsetter",
      title: "Trendsetter",
      description: "Created a post that went viral",
      icon: <Zap className="h-6 w-6" />,
      isActive: false,
      category: "content",
      rarity: "legendary",
    },
  ])

  // Calculate reputation level and points
  const totalPoints = achievements.filter((a) => a.dateEarned).reduce((sum, achievement) => sum + achievement.points, 0)

  const activeBadgesCount = badges.filter((b) => b.isActive).length
  const reputationLevel = Math.floor(totalPoints / 100) + activeBadgesCount
  const pointsToNextLevel = (reputationLevel + 1) * 100 - totalPoints

  // Get badge color based on rarity
  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-slate-100 text-slate-800 border-slate-200"
      case "uncommon":
        return "bg-green-100 text-green-800 border-green-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Achievements & Reputation</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reputation Level</CardTitle>
          <CardDescription>Your standing in the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative w-24 h-24 flex items-center justify-center bg-muted rounded-full">
              <span className="text-3xl font-bold">{reputationLevel}</span>
              <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                style={{ transform: "rotate(-45deg)" }}
              ></div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Reputation Points: {totalPoints}</span>
                <span className="text-sm text-muted-foreground">{pointsToNextLevel} points to next level</span>
              </div>
              <Progress value={((totalPoints % 100) / 100) * 100} className="h-2" />

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm">{achievements.filter((a) => a.dateEarned).length} Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4 text-primary" />
                  <span className="text-sm">{badges.filter((b) => b.isActive).length} Badges</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.dateEarned ? "border-primary/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${achievement.dateEarned ? "bg-primary/10" : "bg-muted"}`}>
                        {achievement.icon}
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    </div>
                    <UIBadge variant="outline">{achievement.points} pts</UIBadge>
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Progress: {achievement.progress}/{achievement.maxProgress}
                      </span>
                      <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  </div>
                </CardContent>
                {achievement.dateEarned && (
                  <CardFooter className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                    </p>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id} className={`${badge.isActive ? "border-primary/50" : "opacity-70"}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${badge.isActive ? "bg-primary/10" : "bg-muted"}`}>
                        {badge.icon}
                      </div>
                      <CardTitle className="text-lg">{badge.title}</CardTitle>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <UIBadge className={getBadgeColor(badge.rarity)}>
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </UIBadge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rarity: {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription>{badge.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  {badge.isActive ? (
                    <p className="text-xs text-muted-foreground">
                      Earned on {new Date(badge.dateEarned!).toLocaleDateString()}
                    </p>
                  ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Info className="h-3 w-3 mr-1" />
                      <span>Not yet earned</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


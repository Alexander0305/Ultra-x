import ProfileAchievements from "@/components/profile/profile-achievements"

export const metadata = {
  title: "Achievements & Reputation - SocialNet",
  description: "View your achievements, badges, and reputation level",
}

export default function ProfileAchievementsPage() {
  return (
    <div className="container py-6">
      <ProfileAchievements />
    </div>
  )
}


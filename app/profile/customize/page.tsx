import ProfileCustomization from "@/components/profile/profile-customization"

export const metadata = {
  title: "Customize Profile - SocialNet",
  description: "Customize your profile layout, style, and settings",
}

export default function ProfileCustomizePage() {
  return (
    <div className="container py-6">
      <ProfileCustomization />
    </div>
  )
}


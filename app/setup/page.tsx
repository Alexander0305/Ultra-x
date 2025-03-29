import { redirect } from "next/navigation"
import { getEnvVariable } from "@/lib/config"
import SetupWizard from "@/components/setup/setup-wizard"

export default async function SetupPage() {
  // Check if setup has already been completed
  const setupComplete = await getEnvVariable("SETUP_COMPLETED")

  // If setup is complete, redirect to the homepage
  if (setupComplete === "true") {
    redirect("/")
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-3xl font-bold text-primary-foreground">SN</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome to SocialNet</h1>
        <p className="text-muted-foreground">Let's get everything set up for your new social network</p>
      </div>

      <SetupWizard />
    </div>
  )
}


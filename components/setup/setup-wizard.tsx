"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import SetupDatabaseStep from "./setup-database-step"
import SetupAdminUserStep from "./setup-admin-user-step"
import SetupBasicSettingsStep from "./setup-basic-settings-step"
import SetupFeaturesStep from "./setup-features-step"
import SetupFinalStep from "./setup-final-step"

// Define the steps of the wizard
const STEPS = [
  { id: "database", title: "Database" },
  { id: "admin", title: "Admin Account" },
  { id: "settings", title: "Basic Settings" },
  { id: "features", title: "Features" },
  { id: "finish", title: "Finish" },
]

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [allData, setAllData] = useState({
    database: {},
    admin: {},
    settings: {},
    features: {},
  })
  const [completed, setCompleted] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = async (stepData: any) => {
    try {
      setLoading(true)
      // Save the current step data
      const newAllData = { ...allData, [STEPS[currentStep].id]: stepData }
      setAllData(newAllData)

      // Mark this step as completed
      if (!completed.includes(STEPS[currentStep].id)) {
        setCompleted([...completed, STEPS[currentStep].id])
      }

      // If this is the final step, complete the setup
      if (currentStep === STEPS.length - 1) {
        const response = await fetch("/api/setup/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAllData),
        })

        if (!response.ok) {
          throw new Error("Failed to complete setup")
        }

        toast({
          title: "Setup Completed!",
          description: "Your social network is ready to use.",
        })

        // Redirect to the login page after a brief delay
        setTimeout(() => {
          router.push("/auth/login")
        }, 1500)

        return
      }

      // Move to the next step
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error("Setup error:", error)
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Render the current step
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "database":
        return <SetupDatabaseStep onNext={handleNext} initialData={allData.database} />
      case "admin":
        return <SetupAdminUserStep onNext={handleNext} initialData={allData.admin} />
      case "settings":
        return <SetupBasicSettingsStep onNext={handleNext} initialData={allData.settings} />
      case "features":
        return <SetupFeaturesStep onNext={handleNext} initialData={allData.features} />
      case "finish":
        return <SetupFinalStep onNext={handleNext} data={allData} />
      default:
        return null
    }
  }

  return (
    <Card className="shadow-lg">
      {/* Progress indicator */}
      <div className="p-4 border-b">
        <div className="flex justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm mb-1
                  ${
                    completed.includes(step.id)
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary/20 border-2 border-primary text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
              >
                {completed.includes(step.id) ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-2 transition-all duration-300 ease-in-out"
            style={{ width: `${(completed.length / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{STEPS[currentStep].title}</h2>
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between p-4 border-t">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || loading}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button form={`setup-form-${STEPS[currentStep].id}`} type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button form={`setup-form-${STEPS[currentStep].id}`} type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Setup
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}


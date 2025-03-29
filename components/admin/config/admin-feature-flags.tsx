"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FeatureFlag {
  key: string
  enabled: boolean
  description?: string
}

export default function AdminFeatureFlags() {
  const [features, setFeatures] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalFeatures, setOriginalFeatures] = useState<FeatureFlag[]>([])

  // Load feature flags
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/config/features")

        if (!response.ok) {
          throw new Error("Failed to fetch feature flags")
        }

        const data = await response.json()
        setFeatures(data)
        setOriginalFeatures(JSON.parse(JSON.stringify(data))) // Deep copy
      } catch (error) {
        console.error("Error fetching feature flags:", error)
        toast({
          title: "Error",
          description: "Failed to load feature flags",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  // Check for changes
  useEffect(() => {
    if (originalFeatures.length === 0) return

    const changed = features.some((feature, index) => feature.enabled !== originalFeatures[index]?.enabled)

    setHasChanges(changed)
  }, [features, originalFeatures])

  // Toggle feature
  const toggleFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures[index].enabled = !newFeatures[index].enabled
    setFeatures(newFeatures)
  }

  // Save changes
  const saveChanges = async () => {
    try {
      setSaving(true)

      const response = await fetch("/api/admin/config/features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      })

      if (!response.ok) {
        throw new Error("Failed to save feature flags")
      }

      const updatedFeatures = await response.json()
      setFeatures(updatedFeatures)
      setOriginalFeatures(JSON.parse(JSON.stringify(updatedFeatures))) // Deep copy
      setHasChanges(false)

      toast({
        title: "Success",
        description: "Feature flags updated successfully",
      })
    } catch (error) {
      console.error("Error saving feature flags:", error)
      toast({
        title: "Error",
        description: "Failed to save feature flags",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Reset changes
  const resetChanges = () => {
    setFeatures(JSON.parse(JSON.stringify(originalFeatures))) // Deep copy
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {hasChanges && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Unsaved Changes</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    You have unsaved changes to your feature flags. Click "Save Changes" to apply them.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Card key={feature.key}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{feature.key.replace("FEATURE_", "")}</CardTitle>
                    <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(index)} />
                  </div>
                  <CardDescription>{feature.description || "No description available"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-sm ${feature.enabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {feature.enabled ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Disabled</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {features.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No feature flags found</div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            {hasChanges && (
              <Button variant="outline" onClick={resetChanges} disabled={saving}>
                Reset
              </Button>
            )}
            <Button onClick={saveChanges} disabled={!hasChanges || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}


import type { Metadata } from "next"
import { ContentDiscovery } from "@/components/discovery/content-discovery"

export const metadata: Metadata = {
  title: "Discover Content",
  description: "Discover trending and personalized content",
}

export default function DiscoverPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          <p className="text-muted-foreground">Explore trending topics and content tailored to your interests.</p>
        </div>
        <ContentDiscovery />
      </div>
    </div>
  )
}


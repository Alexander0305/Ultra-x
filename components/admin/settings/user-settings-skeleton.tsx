import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function UserSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}

        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}


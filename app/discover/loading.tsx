import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function DiscoverLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-[90%] mb-2" />
                <Skeleton className="h-4 w-[80%] mb-6" />
                <Skeleton className="h-[200px] w-full rounded-md" />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


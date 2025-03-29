import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Lock } from "lucide-react"
import Link from "next/link"

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string
    avatar: string
    coverImage?: string
    memberCount: number
    privacy: "public" | "private"
    category?: string
    isJoined?: boolean
  }
  variant?: "default" | "compact"
}

export default function GroupCard({ group, variant = "default" }: GroupCardProps) {
  return (
    <Card className="overflow-hidden">
      {variant === "default" && group.coverImage && (
        <div className="aspect-video relative overflow-hidden">
          <img src={group.coverImage || "/placeholder.svg"} alt={group.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-1 text-sm">
              {group.privacy === "public" ? (
                <>
                  <Globe className="h-3 w-3" />
                  <span>Public Group</span>
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  <span>Private Group</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className={variant === "default" ? "h-12 w-12" : "h-10 w-10"}>
              <AvatarImage src={group.avatar} alt={group.name} />
              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className={variant === "default" ? "text-lg" : "text-base"}>
                <Link href={`/groups/${group.id}`} className="hover:underline">
                  {group.name}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {variant === "compact" && (
                  <>{group.privacy === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}</>
                )}
                <span>{group.memberCount} members</span>
              </div>
            </div>
          </div>
          <Button size="sm" variant={group.isJoined ? "outline" : "default"}>
            {group.isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </CardHeader>
      {variant === "default" && (
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
          <div className="mt-3 flex -space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Avatar key={i} className="border-2 border-background h-6 w-6">
                <AvatarImage src="/placeholder-user.jpg" alt={`Member ${i + 1}`} />
                <AvatarFallback>M{i + 1}</AvatarFallback>
              </Avatar>
            ))}
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-medium">
              +{group.memberCount - 5}
            </div>
          </div>
        </CardContent>
      )}
      {variant === "default" && (
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/groups/${group.id}`}>View Group</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}


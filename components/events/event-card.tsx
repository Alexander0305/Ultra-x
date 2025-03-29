import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface EventCardProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  attendees: number
  organizer: {
    name: string
    avatar: string
  }
  isAttending?: boolean
}

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  image,
  attendees,
  organizer,
  isAttending = false,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/events/${id}`}>
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/events/${id}`}>
          <h3 className="font-semibold line-clamp-1 hover:underline">{title}</h3>
        </Link>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={organizer.avatar} alt={organizer.name} />
            <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{organizer.name}</span>
        </div>
        <Button size="sm" variant={isAttending ? "outline" : "default"}>
          {isAttending ? "Attending" : "Attend"}
        </Button>
      </CardFooter>
    </Card>
  )
}


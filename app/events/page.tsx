import MainLayout from "@/components/layout/main-layout"
import EventCard from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, MapPin, Plus, Search } from "lucide-react"
import Link from "next/link"

// Sample data
const events = [
  {
    id: "event1",
    title: "Web Development Workshop",
    date: "Tomorrow",
    time: "6:00 PM",
    location: "Tech Hub, San Francisco",
    image: "/placeholder.svg",
    attendees: 42,
    organizer: {
      name: "Tech Community",
      avatar: "/placeholder-user.jpg",
    },
    isAttending: true,
  },
  {
    id: "event2",
    title: "Design Meetup",
    date: "Mar 18",
    time: "7:30 PM",
    location: "Design Studio, New York",
    image: "/placeholder.svg",
    attendees: 28,
    organizer: {
      name: "Design Alliance",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "event3",
    title: "Tech Conference 2024",
    date: "Apr 5-7",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Center, Chicago",
    image: "/placeholder.svg",
    attendees: 156,
    organizer: {
      name: "TechConf Inc.",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "event4",
    title: "Photography Exhibition",
    date: "Mar 22",
    time: "10:00 AM - 8:00 PM",
    location: "Art Gallery, Los Angeles",
    image: "/placeholder.svg",
    attendees: 64,
    organizer: {
      name: "Arts Council",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "event5",
    title: "Music Festival",
    date: "Apr 15",
    time: "4:00 PM - 11:00 PM",
    location: "Central Park, New York",
    image: "/placeholder.svg",
    attendees: 230,
    organizer: {
      name: "Music Collective",
      avatar: "/placeholder-user.jpg",
    },
  },
  {
    id: "event6",
    title: "Startup Networking Event",
    date: "Mar 25",
    time: "6:30 PM",
    location: "Startup Space, Austin",
    image: "/placeholder.svg",
    attendees: 35,
    organizer: {
      name: "Startup Network",
      avatar: "/placeholder-user.jpg",
    },
  },
]

export default function EventsPage() {
  return (
    <MainLayout showRightSidebar={false}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover events happening around you</p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search events..." className="pl-8" />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Location" className="pl-8" />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="date" className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekend">This Weekend</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="attending">Attending</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                image={event.image}
                attendees={event.attendees}
                organizer={event.organizer}
                isAttending={event.isAttending}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="today" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <EventCard
              id="today1"
              title="Lunch & Learn: AI Basics"
              date="Today"
              time="12:00 PM"
              location="Virtual Event"
              image="/placeholder.svg"
              attendees={24}
              organizer={{
                name: "Tech Learning Group",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <EventCard
              id="today2"
              title="Evening Networking Mixer"
              date="Today"
              time="6:30 PM"
              location="Downtown Lounge, Chicago"
              image="/placeholder.svg"
              attendees={38}
              organizer={{
                name: "Business Network",
                avatar: "/placeholder-user.jpg",
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="weekend" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <EventCard
              id="weekend1"
              title="Yoga in the Park"
              date="This Weekend"
              time="9:00 AM"
              location="City Park, Seattle"
              image="/placeholder.svg"
              attendees={18}
              organizer={{
                name: "Wellness Group",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <EventCard
              id="weekend2"
              title="Farmers Market"
              date="This Weekend"
              time="8:00 AM - 1:00 PM"
              location="Community Square, Portland"
              image="/placeholder.svg"
              attendees={120}
              organizer={{
                name: "Local Farmers Association",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <EventCard
              id="weekend3"
              title="Indie Film Screening"
              date="This Weekend"
              time="7:00 PM"
              location="Art House Cinema, Austin"
              image="/placeholder.svg"
              attendees={45}
              organizer={{
                name: "Film Enthusiasts",
                avatar: "/placeholder-user.jpg",
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="online" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <EventCard
              id="online1"
              title="Virtual Coding Workshop"
              date="Mar 20"
              time="5:00 PM"
              location="Online Event"
              image="/placeholder.svg"
              attendees={64}
              organizer={{
                name: "Code Academy",
                avatar: "/placeholder-user.jpg",
              }}
            />
            <EventCard
              id="online2"
              title="Digital Marketing Webinar"
              date="Mar 22"
              time="1:00 PM"
              location="Online Event"
              image="/placeholder.svg"
              attendees={86}
              organizer={{
                name: "Marketing Pros",
                avatar: "/placeholder-user.jpg",
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="attending" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events
              .filter((event) => event.isAttending)
              .map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  image={event.image}
                  attendees={event.attendees}
                  organizer={event.organizer}
                  isAttending={event.isAttending}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}


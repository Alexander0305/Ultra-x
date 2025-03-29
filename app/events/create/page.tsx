import MainLayout from "@/components/layout/main-layout"
import EventForm from "@/components/events/event-form"

export default function CreateEventPage() {
  return (
    <MainLayout showRightSidebar={false}>
      <h1 className="text-2xl font-bold mb-6">Create an Event</h1>
      <EventForm />
    </MainLayout>
  )
}


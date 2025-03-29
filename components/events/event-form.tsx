"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, MapPin, Globe, Lock, Upload, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function EventForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [isOnline, setIsOnline] = useState(false)
  const [onlineLink, setOnlineLink] = useState("")
  const [category, setCategory] = useState("")
  const [privacy, setPrivacy] = useState("public")
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    if (coverImage) {
      URL.revokeObjectURL(coverImage)
      setCoverImage(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      isOnline,
      onlineLink,
      category,
      privacy,
      coverImage,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cover-image">Cover Image</Label>
            {coverImage ? (
              <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                <img src={coverImage || "/placeholder.svg"} alt="Event cover" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80">
                <input id="cover-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <label
                  htmlFor="cover-image"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">Upload Cover Image</span>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Give your event a name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start-time"
                  type="time"
                  className="pl-8"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-time"
                  type="time"
                  className="pl-8"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="online-event">Online Event</Label>
              <Switch id="online-event" checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </div>

          {isOnline ? (
            <div className="space-y-2">
              <Label htmlFor="online-link">Event Link</Label>
              <Input
                id="online-link"
                placeholder="https://..."
                value={onlineLink}
                onChange={(e) => setOnlineLink(e.target.value)}
                required={isOnline}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Event location"
                  className="pl-8"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required={!isOnline}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event"
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy</Label>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {privacy === "public"
                ? "Anyone can see and join this event"
                : "Only invited people can see and join this event"}
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Create Event</Button>
      </CardFooter>
    </Card>
  )
}


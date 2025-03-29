"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, X, DollarSign, MapPin } from "lucide-react"

export default function ProductListingForm() {
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [location, setLocation] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index])
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      title,
      price,
      description,
      category,
      condition,
      location,
      images,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List an Item for Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="images">Photos</Label>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.length < 8 && (
                <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80">
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="images"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Add up to 8 photos. First photo will be the cover image.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What are you selling?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="toys">Toys & Games</SelectItem>
                  <SelectItem value="sports">Sports Equipment</SelectItem>
                  <SelectItem value="books">Books & Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail"
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Your location"
                className="pl-8"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>List Item</Button>
      </CardFooter>
    </Card>
  )
}


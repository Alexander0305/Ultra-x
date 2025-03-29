"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Plus, Trash2, Code, Palette, Layout, Eye, Settings, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ProfileSection {
  id: string
  title: string
  type: string
  isVisible: boolean
  content?: string
  order: number
}

export default function ProfileCustomization() {
  const [sections, setSections] = useState<ProfileSection[]>([
    {
      id: "about",
      title: "About Me",
      type: "text",
      isVisible: true,
      content: "This is my bio section where I tell you about myself.",
      order: 0,
    },
    {
      id: "interests",
      title: "Interests",
      type: "tags",
      isVisible: true,
      content: "technology,design,photography,travel",
      order: 1,
    },
    {
      id: "gallery",
      title: "Photo Gallery",
      type: "gallery",
      isVisible: true,
      order: 2,
    },
    {
      id: "links",
      title: "Social Links",
      type: "links",
      isVisible: true,
      content: "https://twitter.com/username,https://instagram.com/username",
      order: 3,
    },
  ])

  const [activeTab, setActiveTab] = useState("layout")
  const [editingSection, setEditingSection] = useState<ProfileSection | null>(null)
  const [customCSS, setCustomCSS] = useState("")
  const [customJS, setCustomJS] = useState("")
  const [themeColor, setThemeColor] = useState("#3b82f6")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [isPublic, setIsPublic] = useState(true)

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    setSections(updatedItems)
  }

  // Add a new section
  const handleAddSection = () => {
    const newSection: ProfileSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      type: "text",
      isVisible: true,
      content: "",
      order: sections.length,
    }

    setSections([...sections, newSection])
    setEditingSection(newSection)
  }

  // Delete a section
  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id))
    if (editingSection?.id === id) {
      setEditingSection(null)
    }
  }

  // Toggle section visibility
  const handleToggleVisibility = (id: string) => {
    setSections(
      sections.map((section) => (section.id === id ? { ...section, isVisible: !section.isVisible } : section)),
    )
  }

  // Update section properties
  const handleUpdateSection = (updatedSection: ProfileSection) => {
    setSections(sections.map((section) => (section.id === updatedSection.id ? updatedSection : section)))
    setEditingSection(null)
  }

  // Save all changes
  const handleSaveChanges = () => {
    // In a real app, this would save to the database
    toast({
      title: "Changes saved",
      description: "Your profile customization changes have been saved.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Profile Customization</h2>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="layout">
            <Layout className="mr-2 h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="style">
            <Palette className="mr-2 h-4 w-4" />
            Style
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="mr-2 h-4 w-4" />
            Custom Code
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Section Layout</CardTitle>
                  <CardDescription>
                    Drag and drop sections to reorder them. Click on a section to edit its content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {sections
                            .sort((a, b) => a.order - b.order)
                            .map((section, index) => (
                              <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-md p-3 ${
                                      section.isVisible ? "bg-background" : "bg-muted/50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <h3 className="font-medium">{section.title}</h3>
                                          <p className="text-sm text-muted-foreground">{section.type}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleToggleVisibility(section.id)}
                                        >
                                          <Eye
                                            className={`h-4 w-4 ${
                                              section.isVisible ? "text-primary" : "text-muted-foreground"
                                            }`}
                                          />
                                          <span className="sr-only">{section.isVisible ? "Hide" : "Show"}</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setEditingSection(section)}>
                                          <Settings className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteSection(section.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Button onClick={handleAddSection} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              {editingSection ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Section</CardTitle>
                    <CardDescription>Customize this section of your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="section-title">Title</Label>
                      <Input
                        id="section-title"
                        value={editingSection.title}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section-type">Type</Label>
                      <Select
                        value={editingSection.type}
                        onValueChange={(value) => setEditingSection({ ...editingSection, type: value })}
                      >
                        <SelectTrigger id="section-type">
                          <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="tags">Tags</SelectItem>
                          <SelectItem value="gallery">Gallery</SelectItem>
                          <SelectItem value="links">Links</SelectItem>
                          <SelectItem value="custom">Custom HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(editingSection.type === "text" ||
                      editingSection.type === "tags" ||
                      editingSection.type === "links" ||
                      editingSection.type === "custom") && (
                      <div className="space-y-2">
                        <Label htmlFor="section-content">Content</Label>
                        <Textarea
                          id="section-content"
                          value={editingSection.content || ""}
                          onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                          placeholder={
                            editingSection.type === "tags"
                              ? "Enter tags separated by commas"
                              : editingSection.type === "links"
                                ? "Enter links separated by commas"
                                : editingSection.type === "custom"
                                  ? "Enter custom HTML"
                                  : "Enter text content"
                          }
                          rows={5}
                        />
                        {editingSection.type === "tags" && (
                          <p className="text-xs text-muted-foreground">
                            Enter tags separated by commas (e.g., technology,design,photography)
                          </p>
                        )}
                        {editingSection.type === "links" && (
                          <p className="text-xs text-muted-foreground">
                            Enter links separated by commas (e.g., https://twitter.com/username)
                          </p>
                        )}
                        {editingSection.type === "custom" && (
                          <p className="text-xs text-muted-foreground">Enter custom HTML code. Use with caution.</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="section-visibility"
                        checked={editingSection.isVisible}
                        onCheckedChange={(checked) => setEditingSection({ ...editingSection, isVisible: checked })}
                      />
                      <Label htmlFor="section-visibility">Section is visible</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingSection(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleUpdateSection(editingSection)}>Save Section</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Section Details</CardTitle>
                    <CardDescription>Select a section to edit its details</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Settings className="h-12 w-12 mb-4" />
                    <p>Select a section from the list to edit its details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Style</CardTitle>
              <CardDescription>Customize the look and feel of your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme-color">Theme Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="theme-color"
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="border rounded-md p-6"
                  style={
                    {
                      fontFamily: fontFamily,
                      "--theme-color": themeColor,
                    } as React.CSSProperties
                  }
                >
                  <div className="mb-4 pb-4 border-b" style={{ color: themeColor }}>
                    <h3 className="text-2xl font-bold">Profile Preview</h3>
                    <p>This is how your profile styling will look</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: themeColor }}>
                        About Me
                      </h4>
                      <p>This is a sample bio section with your selected font and colors.</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: themeColor }}>
                        Interests
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Technology", "Design", "Photography"].map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: `${themeColor}20`,
                              color: themeColor,
                              border: `1px solid ${themeColor}40`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Code Tab */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Code</CardTitle>
              <CardDescription>Add custom CSS and JavaScript to your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  placeholder=".profile-container { background: linear-gradient(to right, #ff7e5f, #feb47b); }"
                  className="font-mono"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Add custom CSS to style your profile. This will override default styles.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-js">Custom JavaScript</Label>
                <Textarea
                  id="custom-js"
                  value={customJS}
                  onChange={(e) => setCustomJS(e.target.value)}
                  placeholder="document.addEventListener('DOMContentLoaded', function() { console.log('Profile loaded!'); });"
                  className="font-mono"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Add custom JavaScript to add interactivity to your profile. Use with caution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Configure general settings for your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="profile-visibility" checked={isPublic} onCheckedChange={setIsPublic} />
                <div>
                  <Label htmlFor="profile-visibility">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, your profile will be visible to everyone
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-url">Profile URL</Label>
                <div className="flex">
                  <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    example.com/profile/
                  </span>
                  <Input id="profile-url" className="rounded-l-none" placeholder="username" />
                </div>
                <p className="text-xs text-muted-foreground">Customize the URL for your profile page</p>
              </div>

              <div className="space-y-2">
                <Label>Profile Backup</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Export Profile</Button>
                  <Button variant="outline">Import Profile</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your profile settings to back them up or import from a backup
                </p>
              </div>

              <div className="space-y-2">
                <Label>Profile Version History</Label>
                <Select defaultValue="current">
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Version</SelectItem>
                    <SelectItem value="v2">Version 2 - 2 days ago</SelectItem>
                    <SelectItem value="v1">Version 1 - 1 week ago</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline">View Selected Version</Button>
                  <Button variant="outline">Restore Selected Version</Button>
                </div>
                <p className="text-xs text-muted-foreground">View and restore previous versions of your profile</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


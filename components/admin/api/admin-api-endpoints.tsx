"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Lock, Globe } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface ApiEndpoint {
  id: string
  path: string
  method: string
  description: string
  isActive: boolean
  requiresAuth: boolean
  rateLimit: number
  createdAt: string
  updatedAt: string
}

export default function AdminApiEndpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editEndpoint, setEditEndpoint] = useState<ApiEndpoint | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Form state
  const [formPath, setFormPath] = useState("")
  const [formMethod, setFormMethod] = useState("GET")
  const [formDescription, setFormDescription] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)
  const [formRequiresAuth, setFormRequiresAuth] = useState(false)
  const [formRateLimit, setFormRateLimit] = useState("100")

  // Load endpoints
  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        setLoading(true)
        // This would be a real API call in a production app
        // const response = await fetch("/api/admin/api/endpoints")
        // const data = await response.json()

        // For now, we'll use mock data
        const mockData: ApiEndpoint[] = [
          {
            id: "1",
            path: "/api/posts",
            method: "GET",
            description: "Retrieve all posts",
            isActive: true,
            requiresAuth: false,
            rateLimit: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            path: "/api/posts",
            method: "POST",
            description: "Create a new post",
            isActive: true,
            requiresAuth: true,
            rateLimit: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            path: "/api/posts/{id}",
            method: "GET",
            description: "Retrieve a specific post",
            isActive: true,
            requiresAuth: false,
            rateLimit: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "4",
            path: "/api/posts/{id}",
            method: "PUT",
            description: "Update a specific post",
            isActive: true,
            requiresAuth: true,
            rateLimit: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "5",
            path: "/api/posts/{id}",
            method: "DELETE",
            description: "Delete a specific post",
            isActive: true,
            requiresAuth: true,
            rateLimit: 20,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "6",
            path: "/api/users",
            method: "GET",
            description: "Retrieve all users",
            isActive: true,
            requiresAuth: true,
            rateLimit: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "7",
            path: "/api/users/{id}",
            method: "GET",
            description: "Retrieve a specific user",
            isActive: true,
            requiresAuth: true,
            rateLimit: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        setEndpoints(mockData)
      } catch (error) {
        console.error("Error fetching API endpoints:", error)
        toast({
          title: "Error",
          description: "Failed to load API endpoints",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEndpoints()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormPath("")
    setFormMethod("GET")
    setFormDescription("")
    setFormIsActive(true)
    setFormRequiresAuth(false)
    setFormRateLimit("100")
  }

  // Open edit dialog
  const handleEdit = (endpoint: ApiEndpoint) => {
    setEditEndpoint(endpoint)
    setFormPath(endpoint.path)
    setFormMethod(endpoint.method)
    setFormDescription(endpoint.description)
    setFormIsActive(endpoint.isActive)
    setFormRequiresAuth(endpoint.requiresAuth)
    setFormRateLimit(endpoint.rateLimit.toString())
    setShowAddDialog(true)
  }

  // Open delete dialog
  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  // Save endpoint
  const handleSave = async () => {
    try {
      // Validate form
      if (!formPath) {
        toast({
          title: "Validation Error",
          description: "Path is required",
          variant: "destructive",
        })
        return
      }

      if (!formPath.startsWith("/")) {
        toast({
          title: "Validation Error",
          description: "Path must start with /",
          variant: "destructive",
        })
        return
      }

      // Prepare data
      const data = {
        id: editEndpoint?.id || Date.now().toString(),
        path: formPath,
        method: formMethod,
        description: formDescription,
        isActive: formIsActive,
        requiresAuth: formRequiresAuth,
        rateLimit: Number.parseInt(formRateLimit),
        createdAt: editEndpoint?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // In a real app, this would be an API call
      // const response = await fetch("/api/admin/api/endpoints", {
      //   method: editEndpoint ? "PUT" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to save API endpoint")
      // }

      // Update local state
      if (editEndpoint) {
        setEndpoints(endpoints.map((e) => (e.id === data.id ? data : e)))
      } else {
        setEndpoints([...endpoints, data])
      }

      // Reset form and close dialog
      resetForm()
      setEditEndpoint(null)
      setShowAddDialog(false)

      toast({
        title: "Success",
        description: `API endpoint ${editEndpoint ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving API endpoint:", error)
      toast({
        title: "Error",
        description: "Failed to save API endpoint",
        variant: "destructive",
      })
    }
  }

  // Delete endpoint
  const handleConfirmDelete = async () => {
    if (!deleteId) return

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/admin/api/endpoints/${deleteId}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to delete API endpoint")
      // }

      // Update local state
      setEndpoints(endpoints.filter((e) => e.id !== deleteId))

      // Reset state and close dialog
      setDeleteId(null)
      setShowDeleteDialog(false)

      toast({
        title: "Success",
        description: "API endpoint deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting API endpoint:", error)
      toast({
        title: "Error",
        description: "Failed to delete API endpoint",
        variant: "destructive",
      })
    }
  }

  // Get method badge color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "POST":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "PUT":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "PATCH":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Filter endpoints by search query
  const filteredEndpoints = endpoints.filter((endpoint) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      endpoint.path.toLowerCase().includes(query) ||
      endpoint.method.toLowerCase().includes(query) ||
      endpoint.description.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery("")}
            >
              &times;
            </Button>
          )}
        </div>

        <Button
          onClick={() => {
            resetForm()
            setEditEndpoint(null)
            setShowAddDialog(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredEndpoints.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No matching API endpoints found" : "No API endpoints found"}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead className="w-[100px]">Method</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Auth</TableHead>
                <TableHead className="w-[100px]">Rate Limit</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEndpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell className="font-mono">{endpoint.path}</TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                  </TableCell>
                  <TableCell>{endpoint.description}</TableCell>
                  <TableCell>
                    {endpoint.isActive ? (
                      <Badge variant="default" className="bg-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {endpoint.requiresAuth ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{endpoint.rateLimit}/min</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(endpoint)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(endpoint.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editEndpoint ? "Edit API Endpoint" : "Add API Endpoint"}</DialogTitle>
            <DialogDescription>
              {editEndpoint ? "Update the details of this API endpoint" : "Add a new API endpoint to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="path">Path</Label>
              <Input
                id="path"
                value={formPath}
                onChange={(e) => setFormPath(e.target.value)}
                placeholder="/api/resource"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use path parameters with curly braces, e.g., /api/users/{"{id}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select value={formMethod} onValueChange={setFormMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="What this endpoint does"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
              <Input
                id="rateLimit"
                type="number"
                min="1"
                max="1000"
                value={formRateLimit}
                onChange={(e) => setFormRateLimit(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="is-active" checked={formIsActive} onCheckedChange={setFormIsActive} />
                <Label htmlFor="is-active">Endpoint is active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="requires-auth" checked={formRequiresAuth} onCheckedChange={setFormRequiresAuth} />
                <Label htmlFor="requires-auth">Requires authentication</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editEndpoint ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this API endpoint. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


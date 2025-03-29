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
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

interface ApiKey {
  id: string
  name: string
  key: string
  description: string
  isActive: boolean
  permissions: string[]
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  lastUsedAt: string | null
}

export default function AdminApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [editApiKey, setEditApiKey] = useState<ApiKey | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newApiKey, setNewApiKey] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)
  const [formPermissions, setFormPermissions] = useState<string[]>(["read"])
  const [formExpiration, setFormExpiration] = useState<string>("never")
  const [formExpirationDate, setFormExpirationDate] = useState<string>("")
  const [showSecretKey, setShowSecretKey] = useState(false)

  // Load API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true)
        // This would be a real API call in a production app
        // const response = await fetch("/api/admin/api/keys")
        // const data = await response.json()

        // For now, we'll use mock data
        const mockData: ApiKey[] = [
          {
            id: "1",
            name: "Web Client",
            key: "sk_live_web_client_12345",
            description: "API key for the web client application",
            isActive: true,
            permissions: ["read", "write"],
            expiresAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Mobile App",
            key: "sk_live_mobile_app_67890",
            description: "API key for the mobile application",
            isActive: true,
            permissions: ["read", "write"],
            expiresAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Analytics Service",
            key: "sk_live_analytics_12345",
            description: "API key for the analytics service",
            isActive: true,
            permissions: ["read"],
            expiresAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Partner Integration",
            key: "sk_live_partner_67890",
            description: "API key for partner integration",
            isActive: false,
            permissions: ["read", "write", "delete"],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: null,
          },
        ]

        setApiKeys(mockData)
      } catch (error) {
        console.error("Error fetching API keys:", error)
        toast({
          title: "Error",
          description: "Failed to load API keys",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApiKeys()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormIsActive(true)
    setFormPermissions(["read"])
    setFormExpiration("never")
    setFormExpirationDate("")
    setShowSecretKey(false)
  }

  // Open edit dialog
  const handleEdit = (apiKey: ApiKey) => {
    setEditApiKey(apiKey)
    setFormName(apiKey.name)
    setFormDescription(apiKey.description)
    setFormIsActive(apiKey.isActive)
    setFormPermissions(apiKey.permissions)
    setFormExpiration(apiKey.expiresAt ? "custom" : "never")
    setFormExpirationDate(apiKey.expiresAt ? new Date(apiKey.expiresAt).toISOString().split("T")[0] : "")
    setShowAddDialog(true)
  }

  // Open delete dialog
  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  // Generate a new API key
  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "sk_live_"
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Save API key
  const handleSave = async () => {
    try {
      // Validate form
      if (!formName) {
        toast({
          title: "Validation Error",
          description: "Name is required",
          variant: "destructive",
        })
        return
      }

      if (formPermissions.length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one permission is required",
          variant: "destructive",
        })
        return
      }

      if (formExpiration === "custom" && !formExpirationDate) {
        toast({
          title: "Validation Error",
          description: "Expiration date is required when custom expiration is selected",
          variant: "destructive",
        })
        return
      }

      // Generate a new key if creating a new API key
      const apiKey = editApiKey ? editApiKey.key : generateApiKey()

      // Prepare data
      const data: ApiKey = {
        id: editApiKey?.id || Date.now().toString(),
        name: formName,
        key: apiKey,
        description: formDescription,
        isActive: formIsActive,
        permissions: formPermissions,
        expiresAt: formExpiration === "never" ? null : new Date(formExpirationDate).toISOString(),
        createdAt: editApiKey?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsedAt: editApiKey?.lastUsedAt || null,
      }

      // In a real app, this would be an API call
      // const response = await fetch("/api/admin/api/keys", {
      //   method: editApiKey ? "PUT" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to save API key")
      // }

      // Update local state
      if (editApiKey) {
        setApiKeys(apiKeys.map((k) => (k.id === data.id ? data : k)))
      } else {
        setApiKeys([...apiKeys, data])
        setNewApiKey(apiKey)
        setShowKeyDialog(true)
      }

      // Reset form and close dialog
      resetForm()
      setEditApiKey(null)
      setShowAddDialog(false)

      if (editApiKey) {
        toast({
          title: "Success",
          description: "API key updated successfully",
        })
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      })
    }
  }

  // Delete API key
  const handleConfirmDelete = async () => {
    if (!deleteId) return

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/admin/api/keys/${deleteId}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to delete API key")
      // }

      // Update local state
      setApiKeys(apiKeys.filter((k) => k.id !== deleteId))

      // Reset state and close dialog
      setDeleteId(null)
      setShowDeleteDialog(false)

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting API key:", error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  // Regenerate API key
  const handleRegenerateKey = async (id: string) => {
    try {
      const newKey = generateApiKey()

      // In a real app, this would be an API call
      // const response = await fetch(`/api/admin/api/keys/${id}/regenerate`, {
      //   method: "POST",
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to regenerate API key")
      // }

      // Update local state
      setApiKeys(
        apiKeys.map((k) =>
          k.id === id
            ? {
                ...k,
                key: newKey,
                updatedAt: new Date().toISOString(),
              }
            : k,
        ),
      )

      setNewApiKey(newKey)
      setShowKeyDialog(true)

      toast({
        title: "Success",
        description: "API key regenerated successfully",
      })
    } catch (error) {
      console.error("Error regenerating API key:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate API key",
        variant: "destructive",
      })
    }
  }

  // Toggle API key status
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/admin/api/keys/${id}/status`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ isActive }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to update API key status")
      // }

      // Update local state
      setApiKeys(
        apiKeys.map((k) =>
          k.id === id
            ? {
                ...k,
                isActive,
                updatedAt: new Date().toISOString(),
              }
            : k,
        ),
      )

      toast({
        title: "Success",
        description: `API key ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating API key status:", error)
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      })
    }
  }

  // Copy API key to clipboard
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Filter API keys by search query
  const filteredApiKeys = apiKeys.filter((apiKey) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      apiKey.name.toLowerCase().includes(query) ||
      apiKey.description.toLowerCase().includes(query) ||
      apiKey.key.toLowerCase().includes(query)
    )
  })

  // Handle permission change
  const handlePermissionChange = (permission: string) => {
    if (formPermissions.includes(permission)) {
      setFormPermissions(formPermissions.filter((p) => p !== permission))
    } else {
      setFormPermissions([...formPermissions, permission])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search API keys..."
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
            setEditApiKey(null)
            setShowAddDialog(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredApiKeys.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No matching API keys found" : "No API keys found"}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Key</TableHead>
                <TableHead className="hidden md:table-cell">Permissions</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{apiKey.name}</div>
                      <div className="text-sm text-muted-foreground">{apiKey.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs truncate max-w-[150px]">{apiKey.key.substring(0, 10)}...</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(apiKey.expiresAt)}</TableCell>
                  <TableCell>
                    {apiKey.isActive ? (
                      <Badge variant="default" className="bg-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(apiKey)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(apiKey.id, !apiKey.isActive)}
                      >
                        {apiKey.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span className="sr-only">{apiKey.isActive ? "Deactivate" : "Activate"}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRegenerateKey(apiKey.id)}>
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Regenerate</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(apiKey.id)}>
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
            <DialogTitle>{editApiKey ? "Edit API Key" : "Create API Key"}</DialogTitle>
            <DialogDescription>
              {editApiKey ? "Update the details of this API key" : "Create a new API key for external applications"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Web Client"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="API key for the web client application"
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={formPermissions.includes("read") ? "default" : "outline"}
                  onClick={() => handlePermissionChange("read")}
                >
                  Read
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={formPermissions.includes("write") ? "default" : "outline"}
                  onClick={() => handlePermissionChange("write")}
                >
                  Write
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={formPermissions.includes("delete") ? "default" : "outline"}
                  onClick={() => handlePermissionChange("delete")}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={formPermissions.includes("admin") ? "default" : "outline"}
                  onClick={() => handlePermissionChange("admin")}
                >
                  Admin
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Expiration</Label>
              <Select value={formExpiration} onValueChange={setFormExpiration}>
                <SelectTrigger id="expiration">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="60days">60 days</SelectItem>
                  <SelectItem value="90days">90 days</SelectItem>
                  <SelectItem value="custom">Custom date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formExpiration === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formExpirationDate}
                  onChange={(e) => setFormExpirationDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch id="is-active" checked={formIsActive} onCheckedChange={setFormIsActive} />
              <Label htmlFor="is-active">API key is active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editApiKey ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this API key. Any applications using this key will no longer be able to
              access the API. This action cannot be undone.
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

      {/* New API Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              This is your API key. Please copy it now as you won't be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <div className="font-mono break-all">{showSecretKey ? newApiKey : newApiKey?.replace(/./g, "•")}</div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setShowSecretKey(!showSecretKey)}>
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => newApiKey && copyToClipboard(newApiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Make sure to store this API key securely. For security reasons, we won't show it again after you close
                this dialog.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowKeyDialog(false)}>I've Copied My API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


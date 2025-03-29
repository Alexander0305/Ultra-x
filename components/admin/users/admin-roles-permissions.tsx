"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Shield, Key, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Role, Permission, PermissionCategory } from "@/lib/types/roles"

export default function AdminRolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("roles")

  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false)
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false)
  const [showAddPermissionDialog, setShowAddPermissionDialog] = useState(false)
  const [showDeletePermissionDialog, setShowDeletePermissionDialog] = useState(false)

  const [editRole, setEditRole] = useState<Role | null>(null)
  const [editPermission, setEditPermission] = useState<Permission | null>(null)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
  const [deletePermissionId, setDeletePermissionId] = useState<string | null>(null)

  const [searchRoleQuery, setSearchRoleQuery] = useState("")
  const [searchPermissionQuery, setSearchPermissionQuery] = useState("")

  // Form state for roles
  const [formRoleName, setFormRoleName] = useState("")
  const [formRoleDescription, setFormRoleDescription] = useState("")
  const [formRolePermissions, setFormRolePermissions] = useState<string[]>([])

  // Form state for permissions
  const [formPermissionName, setFormPermissionName] = useState("")
  const [formPermissionId, setFormPermissionId] = useState("")
  const [formPermissionDescription, setFormPermissionDescription] = useState("")
  const [formPermissionCategory, setFormPermissionCategory] = useState<PermissionCategory>("custom")

  const { toast } = useToast()

  // Load roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch roles
        const rolesResponse = await fetch("/api/admin/roles")
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          setRoles(rolesData)
        } else {
          throw new Error("Failed to fetch roles")
        }

        // Fetch permissions
        const permissionsResponse = await fetch("/api/admin/permissions")
        if (permissionsResponse.ok) {
          const permissionsData = await permissionsResponse.json()
          setPermissions(permissionsData)
        } else {
          throw new Error("Failed to fetch permissions")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load roles and permissions",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Reset role form
  const resetRoleForm = () => {
    setFormRoleName("")
    setFormRoleDescription("")
    setFormRolePermissions([])
  }

  // Reset permission form
  const resetPermissionForm = () => {
    setFormPermissionName("")
    setFormPermissionId("")
    setFormPermissionDescription("")
    setFormPermissionCategory("custom")
  }

  // Open edit role dialog
  const handleEditRole = (role: Role) => {
    setEditRole(role)
    setFormRoleName(role.name)
    setFormRoleDescription(role.description)
    setFormRolePermissions([...role.permissions])
    setShowAddRoleDialog(true)
  }

  // Open delete role dialog
  const handleDeleteRole = (id: string) => {
    setDeleteRoleId(id)
    setShowDeleteRoleDialog(true)
  }

  // Open edit permission dialog
  const handleEditPermission = (permission: Permission) => {
    setEditPermission(permission)
    setFormPermissionName(permission.name)
    setFormPermissionId(permission.id)
    setFormPermissionDescription(permission.description)
    setFormPermissionCategory(permission.category as PermissionCategory)
    setShowAddPermissionDialog(true)
  }

  // Open delete permission dialog
  const handleDeletePermission = (id: string) => {
    setDeletePermissionId(id)
    setShowDeletePermissionDialog(true)
  }

  // Save role
  const handleSaveRole = async () => {
    try {
      // Validate form
      if (!formRoleName) {
        toast({
          title: "Validation Error",
          description: "Role name is required",
          variant: "destructive",
        })
        return
      }

      if (formRolePermissions.length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one permission is required",
          variant: "destructive",
        })
        return
      }

      // Prepare data
      const roleId = editRole?.id || formRoleName.toLowerCase().replace(/\s+/g, "_")
      const role = {
        id: roleId,
        name: formRoleName,
        description: formRoleDescription,
        permissions: formRolePermissions,
      }

      // Send request
      const response = await fetch(`/api/admin/roles${editRole ? `/${roleId}` : ""}`, {
        method: editRole ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(role),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save role")
      }

      // Update local state
      const savedRole = await response.json()
      if (editRole) {
        setRoles(roles.map((r) => (r.id === savedRole.id ? savedRole : r)))
      } else {
        setRoles([...roles, savedRole])
      }

      // Reset form and close dialog
      resetRoleForm()
      setEditRole(null)
      setShowAddRoleDialog(false)

      toast({
        title: "Success",
        description: `Role ${editRole ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save role",
        variant: "destructive",
      })
    }
  }

  // Delete role
  const handleConfirmDeleteRole = async () => {
    if (!deleteRoleId) return

    try {
      const response = await fetch(`/api/admin/roles/${deleteRoleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete role")
      }

      // Update local state
      setRoles(roles.filter((r) => r.id !== deleteRoleId))

      // Reset state and close dialog
      setDeleteRoleId(null)
      setShowDeleteRoleDialog(false)

      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  // Save permission
  const handleSavePermission = async () => {
    try {
      // Validate form
      if (!formPermissionName) {
        toast({
          title: "Validation Error",
          description: "Permission name is required",
          variant: "destructive",
        })
        return
      }

      if (!formPermissionId) {
        toast({
          title: "Validation Error",
          description: "Permission ID is required",
          variant: "destructive",
        })
        return
      }

      // Check if permission ID already exists (for new permissions)
      if (!editPermission && permissions.some((p) => p.id === formPermissionId)) {
        toast({
          title: "Validation Error",
          description: "Permission ID already exists",
          variant: "destructive",
        })
        return
      }

      // Prepare data
      const permission = {
        id: formPermissionId,
        name: formPermissionName,
        description: formPermissionDescription,
        category: formPermissionCategory,
      }

      // Send request
      const response = await fetch(`/api/admin/permissions${editPermission ? `/${formPermissionId}` : ""}`, {
        method: editPermission ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permission),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save permission")
      }

      // Update local state
      const savedPermission = await response.json()
      if (editPermission) {
        setPermissions(permissions.map((p) => (p.id === savedPermission.id ? savedPermission : p)))
      } else {
        setPermissions([...permissions, savedPermission])
      }

      // Reset form and close dialog
      resetPermissionForm()
      setEditPermission(null)
      setShowAddPermissionDialog(false)

      toast({
        title: "Success",
        description: `Permission ${editPermission ? "updated" : "created"} successfully`,
      })
    } catch (error) {
      console.error("Error saving permission:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save permission",
        variant: "destructive",
      })
    }
  }

  // Delete permission
  const handleConfirmDeletePermission = async () => {
    if (!deletePermissionId) return

    try {
      const response = await fetch(`/api/admin/permissions/${deletePermissionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete permission")
      }

      // Update local state
      setPermissions(permissions.filter((p) => p.id !== deletePermissionId))

      // Reset state and close dialog
      setDeletePermissionId(null)
      setShowDeletePermissionDialog(false)

      toast({
        title: "Success",
        description: "Permission deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting permission:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete permission",
        variant: "destructive",
      })
    }
  }

  // Toggle permission selection for role
  const handleTogglePermission = (permissionId: string) => {
    if (formRolePermissions.includes(permissionId)) {
      setFormRolePermissions(formRolePermissions.filter((id) => id !== permissionId))
    } else {
      setFormRolePermissions([...formRolePermissions, permissionId])
    }
  }

  // Filter roles by search query
  const filteredRoles = roles.filter((role) => {
    if (!searchRoleQuery) return true

    const query = searchRoleQuery.toLowerCase()
    return (
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query) ||
      role.id.toLowerCase().includes(query)
    )
  })

  // Filter permissions by search query
  const filteredPermissions = permissions.filter((permission) => {
    if (!searchPermissionQuery) return true

    const query = searchPermissionQuery.toLowerCase()
    return (
      permission.name.toLowerCase().includes(query) ||
      permission.description.toLowerCase().includes(query) ||
      permission.id.toLowerCase().includes(query) ||
      permission.category.toLowerCase().includes(query)
    )
  })

  // Get unique permission categories
  const permissionCategories = Array.from(new Set(permissions.map((p) => p.category)))

  // Get permissions by category
  const getPermissionsByCategory = (category: string) => {
    return permissions.filter((p) => p.category === category)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Input
                placeholder="Search roles..."
                value={searchRoleQuery}
                onChange={(e) => setSearchRoleQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              {searchRoleQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchRoleQuery("")}
                >
                  &times;
                </Button>
              )}
            </div>

            <Button
              onClick={() => {
                resetRoleForm()
                setEditRole(null)
                setShowAddRoleDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRoles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Shield className="h-12 w-12 mb-4" />
                <p>No roles found</p>
                {searchRoleQuery && <p className="mt-2">Try adjusting your search query</p>}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRoles.map((role) => (
                <Card key={role.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {role.name}
                          {role.isSystem && (
                            <Badge variant="secondary" className="ml-2">
                              System
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                          disabled={role.isSystem}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={role.isSystem}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">{role.userCount}</span> users with this role
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permId) => {
                        const perm = permissions.find((p) => p.id === permId)
                        return (
                          <Badge key={permId} variant="outline">
                            {perm ? perm.name : permId}
                          </Badge>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Input
                placeholder="Search permissions..."
                value={searchPermissionQuery}
                onChange={(e) => setSearchPermissionQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              {searchPermissionQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchPermissionQuery("")}
                >
                  &times;
                </Button>
              )}
            </div>

            <Button
              onClick={() => {
                resetPermissionForm()
                setEditPermission(null)
                setShowAddPermissionDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Card className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : filteredPermissions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Key className="h-12 w-12 mb-4" />
                <p>No permissions found</p>
                {searchPermissionQuery && <p className="mt-2">Try adjusting your search query</p>}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {permissionCategories.map((category) => {
                const categoryPermissions = filteredPermissions.filter((p) => p.category === category)
                if (categoryPermissions.length === 0) return null

                return (
                  <Card key={category}>
                    <CardHeader className="pb-2">
                      <CardTitle className="capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryPermissions.map((permission) => (
                            <TableRow key={permission.id}>
                              <TableCell className="font-medium">
                                {permission.name}
                                {permission.isSystem && (
                                  <Badge variant="secondary" className="ml-2">
                                    System
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs">{permission.id}</TableCell>
                              <TableCell>{permission.description}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditPermission(permission)}
                                    disabled={permission.isSystem}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeletePermission(permission.id)}
                                    disabled={permission.isSystem}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Role Dialog */}
      <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editRole ? "Edit Role" : "Add New Role"}</DialogTitle>
            <DialogDescription>
              {editRole ? "Update the role details and permissions." : "Create a new role with specific permissions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-name" className="text-right">
                Name
              </Label>
              <Input
                id="role-name"
                value={formRoleName}
                onChange={(e) => setFormRoleName(e.target.value)}
                className="col-span-3"
                placeholder="Admin, Editor, Moderator, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="role-description"
                value={formRoleDescription}
                onChange={(e) => setFormRoleDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe the role and its responsibilities"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3 border rounded-md p-4">
                <div className="mb-4">
                  <Input
                    placeholder="Search permissions..."
                    onChange={(e) => setSearchPermissionQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  {permissionCategories.map((category) => {
                    const categoryPermissions = filteredPermissions.filter((p) => p.category === category)
                    if (categoryPermissions.length === 0) return null

                    return (
                      <div key={category} className="mb-4">
                        <h4 className="mb-2 font-medium capitalize">{category}</h4>
                        <div className="space-y-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={formRolePermissions.includes(permission.id)}
                                onCheckedChange={() => handleTogglePermission(permission.id)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {permission.name}
                                </label>
                                {permission.description && (
                                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                      </div>
                    )
                  })}
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>{editRole ? "Update Role" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <AlertDialog open={showDeleteRoleDialog} onOpenChange={setShowDeleteRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              {deleteRoleId && roles.find((r) => r.id === deleteRoleId)?.userCount > 0 && (
                <span className="font-medium text-destructive">
                  {" "}
                  and remove it from {roles.find((r) => r.id === deleteRoleId)?.userCount} users
                </span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteRole} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Permission Dialog */}
      <Dialog open={showAddPermissionDialog} onOpenChange={setShowAddPermissionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editPermission ? "Edit Permission" : "Add New Permission"}</DialogTitle>
            <DialogDescription>
              {editPermission
                ? "Update the permission details."
                : "Create a new permission that can be assigned to roles."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-name" className="text-right">
                Name
              </Label>
              <Input
                id="permission-name"
                value={formPermissionName}
                onChange={(e) => setFormPermissionName(e.target.value)}
                className="col-span-3"
                placeholder="Create Posts, Edit Users, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-id" className="text-right">
                ID
              </Label>
              <Input
                id="permission-id"
                value={formPermissionId}
                onChange={(e) => setFormPermissionId(e.target.value)}
                className="col-span-3"
                placeholder="posts.create, users.edit, etc."
                disabled={!!editPermission}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="permission-description"
                value={formPermissionDescription}
                onChange={(e) => setFormPermissionDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe what this permission allows"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permission-category" className="text-right">
                Category
              </Label>
              <Select
                value={formPermissionCategory}
                onValueChange={(value) => setFormPermissionCategory(value as PermissionCategory)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="moderation">Moderation</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPermissionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermission}>{editPermission ? "Update Permission" : "Create Permission"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Confirmation Dialog */}
      <AlertDialog open={showDeletePermissionDialog} onOpenChange={setShowDeletePermissionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the permission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePermission}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending" | "banned"
  createdAt: string
  lastLogin: string
  avatar?: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function UserManagement() {
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active" as const,
  })

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers: User[] = Array.from({ length: 50 }).map((_, i) => ({
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i === 0 ? "admin" : i < 5 ? "moderator" : "user",
        status: i % 10 === 0 ? "inactive" : i % 15 === 0 ? "pending" : i % 20 === 0 ? "banned" : "active",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        lastLogin: i % 5 === 0 ? "Never" : new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        avatar: i % 3 === 0 ? "/placeholder-user.jpg" : undefined,
      }))

      const mockRoles: Role[] = [
        {
          id: "role-1",
          name: "Admin",
          description: "Full access to all features",
          permissions: ["manage_users", "manage_content", "manage_settings"],
        },
        {
          id: "role-2",
          name: "Moderator",
          description: "Can moderate content and users",
          permissions: ["manage_content"],
        },
        {
          id: "role-3",
          name: "User",
          description: "Standard user access",
          permissions: [],
        },
      ]

      setUsers(mockUsers)
      setRoles(mockRoles)
      setTotalPages(Math.ceil(mockUsers.length / 10))
      setLoading(false)
    }, 1000)
  }, [])

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === null || user.role === selectedRole
    const matchesStatus = selectedStatus === null || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  // Paginated users
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10)

  // Handlers
  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      // In a real app, you would call an API here
      setUsers(users.filter((user) => user.id !== userToDelete))
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      })
    }
    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleEditUser = (user: User) => {
    setUserToEdit(user)
    setIsEditDialogOpen(true)
  }

  const handleBulkAction = (action: string) => {
    // In a real app, you would call an API here
    if (action === "delete") {
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
      toast({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been deleted.`,
      })
    } else if (action === "activate") {
      setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "active" } : user)))
      toast({
        title: "Users activated",
        description: `${selectedUsers.length} users have been activated.`,
      })
    } else if (action === "deactivate") {
      setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "inactive" } : user)))
      toast({
        title: "Users deactivated",
        description: `${selectedUsers.length} users have been deactivated.`,
      })
    }
    setSelectedUsers([])
  }

  const handleCreateUser = () => {
    // In a real app, you would call an API here
    const newUserId = `user-${users.length + 1}`
    const createdUser: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: new Date().toISOString(),
      lastLogin: "Never",
    }

    setUsers([createdUser, ...users])
    setIsCreateDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
    })

    toast({
      title: "User created",
      description: "The user has been created successfully.",
    })
  }

  const handleSaveUser = () => {
    if (userToEdit) {
      // In a real app, you would call an API here
      setUsers(users.map((user) => (user.id === userToEdit.id ? userToEdit : user)))
      toast({
        title: "User updated",
        description: "The user has been updated successfully.",
      })
    }
    setIsEditDialogOpen(false)
    setUserToEdit(null)
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Never") return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted/20">
            Inactive
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Pending
          </Badge>
        )
      case "banned":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Banned
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary text-primary-foreground">Admin</Badge>
      case "moderator":
        return <Badge className="bg-secondary text-secondary-foreground">Moderator</Badge>
      case "user":
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger
            value="users"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value || null)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus || ""} onValueChange={(value) => setSelectedStatus(value || null)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedRole(null)
                      setSelectedStatus(null)
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {selectedUsers.length > 0 && (
                    <div className="bg-muted/50 p-2 rounded-lg mb-4 flex items-center justify-between">
                      <span className="text-sm">{selectedUsers.length} users selected</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("deactivate")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                              onCheckedChange={handleSelectAllUsers}
                            />
                          </TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedUsers.includes(user.id)}
                                  onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>{formatDate(user.createdAt)}</TableCell>
                              <TableCell>{formatDate(user.lastLogin)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {paginatedUsers.length} of {filteredUsers.length} users
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          const page = i + 1
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })}
                        {totalPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                isActive={currentPage === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage user roles and their permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="font-medium">{role.name}</div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.map((permission) => (
                                <Badge key={permission} variant="outline" className="bg-muted/50">
                                  {permission}
                                </Badge>
                              ))}
                              {role.permissions.length === 0 && (
                                <span className="text-xs text-muted-foreground">No permissions</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
        Content>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Make changes to the user's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={userToEdit?.name || ""}
                onChange={(e) => setUserToEdit(userToEdit ? { ...userToEdit, name: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={userToEdit?.email || ""}
                onChange={(e) => setUserToEdit(userToEdit ? { ...userToEdit, email: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={userToEdit?.role || ""}
                onValueChange={(value) => setUserToEdit(userToEdit ? { ...userToEdit, role: value } : null)}
              >
                <SelectTrigger id="edit-role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={userToEdit?.status || ""}
                onValueChange={(value: any) => setUserToEdit(userToEdit ? { ...userToEdit, status: value } : null)}
              >
                <SelectTrigger id="edit-status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-name" className="text-right">
                Name
              </Label>
              <Input
                id="create-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-email" className="text-right">
                Email
              </Label>
              <Input
                id="create-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-password" className="text-right">
                Password
              </Label>
              <Input
                id="create-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-role" className="text-right">
                Role
              </Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="create-role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-status" className="text-right">
                Status
              </Label>
              <Select value={newUser.status} onValueChange={(value: any) => setNewUser({ ...newUser, status: value })}>
                <SelectTrigger id="create-status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create user</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


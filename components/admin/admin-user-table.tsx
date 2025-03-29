import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, UserX, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import prisma from "@/lib/db/prisma"
import AdminPagination from "./admin-pagination"

interface AdminUserTableProps {
  query: string
  page: number
  role?: string
  status?: string
}

export default async function AdminUserTable({ query, page, role, status }: AdminUserTableProps) {
  const itemsPerPage = 10
  const skip = (page - 1) * itemsPerPage

  // Build filter conditions
  const where: any = {}

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { username: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ]
  }

  if (role) {
    where.role = role
  }

  if (status === "online") {
    where.isOnline = true
  } else if (status === "verified") {
    where.isVerified = true
  }

  // Get users with pagination
  const users = await prisma.user.findMany({
    where,
    orderBy: { joinedAt: "desc" },
    skip,
    take: itemsPerPage,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
      isVerified: true,
      isOnline: true,
      role: true,
      joinedAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  })

  // Get total count for pagination
  const totalUsers = await prisma.user.count({ where })
  const totalPages = Math.ceil(totalUsers / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || ""} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {user.name}
                          {user.isVerified && (
                            <span className="inline-flex items-center justify-center w-4 h-4 bg-primary rounded-full">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN" ? "destructive" : user.role === "MODERATOR" ? "default" : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-300"}`}></span>
                      <span>{user.isOnline ? "Online" : "Offline"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user._count.posts} posts</div>
                      <div>{user._count.comments} comments</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend User
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

      <AdminPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}


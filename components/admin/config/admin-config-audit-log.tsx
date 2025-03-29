"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import AdminPagination from "@/components/admin/admin-pagination"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  previousValue: string | null
  newValue: string | null
  userId: string
  timestamp: string
  ipAddress: string | null
  userAgent: string | null
}

export default function AdminConfigAuditLog() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
        })

        if (debouncedSearchQuery) {
          params.append("search", debouncedSearchQuery)
        }

        if (actionFilter !== "all") {
          params.append("action", actionFilter)
        }

        const response = await fetch(`/api/admin/config/audit?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch audit logs")
        }

        const data = await response.json()
        setAuditLogs(data.auditLogs)
        setTotalPages(data.pagination.totalPages)
      } catch (error) {
        console.error("Error fetching audit logs:", error)
        toast({
          title: "Error",
          description: "Failed to load audit logs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [page, debouncedSearchQuery, actionFilter])

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  // Get action badge color
  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "UPDATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search logs..."
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

        <div className="w-full sm:w-auto">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : auditLogs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery || actionFilter !== "all" ? "No matching audit logs found" : "No audit logs found"}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.entityType}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{log.entityId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{log.userId}</div>
                    {log.ipAddress && <div className="text-xs text-muted-foreground">{log.ipAddress}</div>}
                  </TableCell>
                  <TableCell>
                    {log.action === "DELETE" ? (
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">Deleted value:</div>
                        <div className="font-mono text-xs truncate max-w-[300px]">{log.previousValue}</div>
                      </div>
                    ) : log.action === "CREATE" ? (
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">Created with value:</div>
                        <div className="font-mono text-xs truncate max-w-[300px]">{log.newValue}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">From:</div>
                        <div className="font-mono text-xs truncate max-w-[300px]">{log.previousValue}</div>
                        <div className="font-medium mt-1">To:</div>
                        <div className="font-mono text-xs truncate max-w-[300px]">{log.newValue}</div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}


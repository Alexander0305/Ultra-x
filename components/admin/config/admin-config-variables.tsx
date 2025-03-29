"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"

interface Variable {
  id: string
  name: string
  value: string
  isSecret: boolean
}

export default function AdminConfigVariables() {
  const { toast } = useToast()
  const [variables, setVariables] = useState<Variable[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newVariable, setNewVariable] = useState({
    name: "",
    value: "",
    isSecret: false,
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [variableToEdit, setVariableToEdit] = useState<Variable | null>(null)
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockVariables: Variable[] = [
        {
          id: "var1",
          name: "API_KEY",
          value: "abcdef123456",
          isSecret: true,
        },
        {
          id: "var2",
          name: "DATABASE_URL",
          value: "postgres://user:password@host:port/database",
          isSecret: true,
        },
        {
          id: "var3",
          name: "NEXT_PUBLIC_SITE_URL",
          value: "https://example.com",
          isSecret: false,
        },
      ]
      setVariables(mockVariables)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateVariable = () => {
    // In a real app, you would call an API here
    const newVariableId = `var-${variables.length + 1}`
    const createdVariable: Variable = {
      id: newVariableId,
      name: newVariable.name,
      value: newVariable.value,
      isSecret: newVariable.isSecret,
    }

    setVariables([createdVariable, ...variables])
    setIsCreateDialogOpen(false)
    setNewVariable({
      name: "",
      value: "",
      isSecret: false,
    })

    toast({
      title: "Variable created",
      description: "The variable has been created successfully.",
    })
  }

  const handleSaveVariable = () => {
    if (variableToEdit) {
      // In a real app, you would call an API here
      setVariables(variables.map((variable) => (variable.id === variableToEdit.id ? variableToEdit : variable)))
      toast({
        title: "Variable updated",
        description: "The variable has been updated successfully.",
      })
    }
    setIsEditDialogOpen(false)
    setVariableToEdit(null)
  }

  const handleDeleteVariable = (id: string) => {
    // In a real app, you would call an API here
    setVariables(variables.filter((variable) => variable.id !== id))
    toast({
      title: "Variable deleted",
      description: "The variable has been deleted successfully.",
    })
  }

  const handleCopyVariable = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Variable copied",
      description: "The variable value has been copied to your clipboard.",
    })
  }

  const toggleShowSecret = (id: string) => {
    setShowSecret((prevShowSecret) => ({
      ...prevShowSecret,
      [id]: !(prevShowSecret[id] || false),
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add Variable</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">Loading variables...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Secret</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell className="font-medium">{variable.name}</TableCell>
                  <TableCell>
                    {variable.isSecret && !showSecret[variable.id] ? "****************" : variable.value}
                  </TableCell>
                  <TableCell>{variable.isSecret ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyVariable(variable.value)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy value
                        </DropdownMenuItem>
                        {variable.isSecret && (
                          <DropdownMenuItem onClick={() => toggleShowSecret(variable.id)}>
                            {showSecret[variable.id] ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide value
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show value
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setVariableToEdit(variable)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteVariable(variable.id)}
                          className="text-destructive"
                        >
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

      {/* Create Variable Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Variable</DialogTitle>
            <DialogDescription>Add a new API key or environment variable.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newVariable.name}
                onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                type="text"
                value={newVariable.value}
                onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isSecret" className="text-right">
                Secret
              </Label>
              <Input
                id="isSecret"
                type="checkbox"
                checked={newVariable.isSecret}
                onChange={(e) => setNewVariable({ ...newVariable, isSecret: e.target.checked })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVariable}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Variable Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Variable</DialogTitle>
            <DialogDescription>Make changes to the variable.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={variableToEdit?.name || ""}
                onChange={(e) =>
                  setVariableToEdit({
                    ...variableToEdit,
                    name: e.target.value,
                  } as Variable)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-value" className="text-right">
                Value
              </Label>
              <Input
                id="edit-value"
                type="text"
                value={variableToEdit?.value || ""}
                onChange={(e) =>
                  setVariableToEdit({
                    ...variableToEdit,
                    value: e.target.value,
                  } as Variable)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isSecret" className="text-right">
                Secret
              </Label>
              <Input
                id="edit-isSecret"
                type="checkbox"
                checked={variableToEdit?.isSecret || false}
                onChange={(e) =>
                  setVariableToEdit({
                    ...variableToEdit,
                    isSecret: e.target.checked,
                  } as Variable)
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVariable}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


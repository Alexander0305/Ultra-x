"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

// Define schema for integration
const integrationSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .refine((val) => /^[A-Za-z0-9_]+$/.test(val), {
      message: "Key can only contain letters, numbers, and underscores",
    }),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  isSecret: z.boolean().default(false),
  category: z.string().default("integrations"),
})

type FormData = z.infer<typeof integrationSchema>

interface IntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<void>
  category: string | null
}

export default function IntegrationDialog({ open, onOpenChange, onSave, category }: IntegrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Create form
  const form = useForm<FormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      key: "",
      value: "",
      description: "",
      isSecret: false,
      category: "integrations",
    },
  })

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await onSave(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save integration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Integration</DialogTitle>
          <DialogDescription>Add a new third-party service integration to your platform.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SERVICE_NAME_API_KEY" />
                  </FormControl>
                  <FormDescription>Environment variable name (e.g., SENDGRID_API_KEY)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Integration value or API key" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What this integration is used for" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="integrations">Integrations</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="ai">AI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSecret"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Sensitive Value</FormLabel>
                      <FormDescription>Mask this value in the UI and logs</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Integration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


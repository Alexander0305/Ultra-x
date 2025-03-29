"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the schema for database configuration
const databaseSchema = z.object({
  type: z.enum(["postgresql", "mysql", "sqlite"]),
  host: z.string().optional(),
  port: z.string().optional(),
  database: z.string().min(1, "Database name is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  connectionString: z.string().optional(),
  useConnectionString: z.boolean().default(false),
})

// Define the props for the component
type SetupDatabaseStepProps = {
  onNext: (data: any) => void
  initialData: any
}

export default function SetupDatabaseStep({ onNext, initialData }: SetupDatabaseStepProps) {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Create form
  const form = useForm<z.infer<typeof databaseSchema>>({
    resolver: zodResolver(databaseSchema),
    defaultValues: initialData || {
      type: "postgresql",
      host: "localhost",
      port: "",
      database: "",
      username: "",
      password: "",
      connectionString: "",
      useConnectionString: false,
    },
  })

  const useConnectionString = form.watch("useConnectionString")
  const databaseType = form.watch("type")

  // Default port based on database type
  const getDefaultPort = () => {
    switch (databaseType) {
      case "postgresql":
        return "5432"
      case "mysql":
        return "3306"
      default:
        return ""
    }
  }

  // Test the database connection
  const testConnection = async () => {
    try {
      setTesting(true)
      setTestResult(null)

      const values = form.getValues()

      const response = await fetch("/api/setup/test-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const result = await response.json()

      setTestResult({
        success: response.ok,
        message: result.message || (response.ok ? "Connection successful!" : "Connection failed."),
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setTesting(false)
    }
  }

  // Submit the form
  const onSubmit = async (values: z.infer<typeof databaseSchema>) => {
    // We'll test the connection one more time before proceeding
    setTesting(true)

    try {
      const response = await fetch("/api/setup/test-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const result = await response.json()
        setTestResult({
          success: false,
          message: result.message || "Database connection failed. Please check your settings.",
        })
        return
      }

      // Connection successful, proceed to next step
      onNext(values)
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Form {...form}>
      <form id="setup-form-database" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="postgresql" />
                  </FormControl>
                  <FormLabel className="font-normal">PostgreSQL</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mysql" />
                  </FormControl>
                  <FormLabel className="font-normal">MySQL</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="sqlite" />
                  </FormControl>
                  <FormLabel className="font-normal">SQLite (Development Only)</FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="useConnectionString"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4 mt-1" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use connection string</FormLabel>
                <FormDescription>Use a connection string instead of individual parameters</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {useConnectionString ? (
          <FormField
            control={form.control}
            name="connectionString"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection String</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      databaseType === "postgresql"
                        ? "postgresql://username:password@localhost:5432/database"
                        : databaseType === "mysql"
                          ? "mysql://username:password@localhost:3306/database"
                          : "file:./dev.db"
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription>The full connection string for your database</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            {databaseType !== "sqlite" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host</FormLabel>
                        <FormControl>
                          <Input placeholder="localhost" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input placeholder={getDefaultPort()} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder={databaseType === "sqlite" ? "./dev.db" : "socialnet"} {...field} />
                  </FormControl>
                  <FormDescription>
                    {databaseType === "sqlite" ? "The path to your SQLite database file" : "The name of your database"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={testConnection} disabled={testing} className="mr-4">
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </div>
      </form>
    </Form>
  )
}


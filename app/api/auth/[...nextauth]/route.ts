import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { initializeApp } from "@/lib/init-app"

// Initialize application on first request
let initialized = false

const handler = async (req: Request, context: any) => {
  // Initialize app if not already initialized
  if (!initialized) {
    await initializeApp()
    initialized = true
  }

  return NextAuth(authOptions)(req, context)
}

export { handler as GET, handler as POST }


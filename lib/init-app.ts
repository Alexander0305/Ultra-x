import { initializeDefaultEnvVariables } from "@/lib/config"

// Initialize application
export async function initializeApp() {
  console.log("Initializing application...")

  // Initialize default environment variables
  await initializeDefaultEnvVariables()

  console.log("Application initialized successfully")
}


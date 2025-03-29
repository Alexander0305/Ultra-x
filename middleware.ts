import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

import { isSetupComplete } from "@/lib/setup"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = request.nextUrl
  const req = request

  // Check if setup is complete
  const setupComplete = await isSetupComplete()

  // If setup is not complete, redirect to setup page
  if (!setupComplete && !url.pathname.startsWith("/setup")) {
    url.pathname = "/setup"
    return NextResponse.redirect(url)
  }

  // If setup is complete and user is on setup page, redirect to home page
  if (setupComplete && url.pathname.startsWith("/setup")) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Handle search queries
  if (url.pathname === "/") {
    const searchQuery = url.searchParams.get("q")
    if (searchQuery) {
      url.pathname = "/search"
      return NextResponse.redirect(url)
    }
  }

  // Add this to your middleware.ts file to check for role-based permissions

  // Example of checking for admin role
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // Check if user is authenticated and has admin role
    if (!token || token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  // Example of checking for specific permissions
  if (pathname.startsWith("/admin/roles")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // Check if user has the required permission
    if (!token || !token?.permissions?.includes("roles.manage")) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


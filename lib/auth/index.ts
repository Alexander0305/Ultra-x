import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db/prisma"
import { env } from "@/lib/config"

// Create auth options with dynamic config from database
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Update user's online status
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isOnline: true,
            lastSeen: new Date(),
          },
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
        }
      },
    }),
    // Dynamic providers loaded from database
    {
      id: "google",
      name: "Google",
      type: "oauth",
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      checks: ["pkce", "state"],
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
      clientId: await env("GOOGLE_CLIENT_ID", ""),
      clientSecret: await env("GOOGLE_CLIENT_SECRET", ""),
    },
    {
      id: "facebook",
      name: "Facebook",
      type: "oauth",
      authorization: "https://www.facebook.com/v11.0/dialog/oauth?scope=email",
      token: "https://graph.facebook.com/v11.0/oauth/access_token",
      userinfo: "https://graph.facebook.com/me?fields=id,name,email,picture",
      async profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        }
      },
      clientId: await env("FACEBOOK_CLIENT_ID", ""),
      clientSecret: await env("FACEBOOK_CLIENT_SECRET", ""),
    },
    {
      id: "twitter",
      name: "Twitter",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: { scope: "users.read tweet.read offline.access" },
      },
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo: "https://api.twitter.com/2/users/me",
      async profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null, // Twitter doesn't provide email by default
          image: profile.data.profile_image_url,
        }
      },
      clientId: await env("TWITTER_CLIENT_ID", ""),
      clientSecret: await env("TWITTER_CLIENT_SECRET", ""),
    },
    {
      id: "github",
      name: "GitHub",
      type: "oauth",
      authorization: { params: { scope: "read:user user:email" } },
      token: "https://github.com/login/oauth/access_token",
      userinfo: "https://api.github.com/user",
      async profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
      clientId: await env("GITHUB_CLIENT_ID", ""),
      clientSecret: await env("GITHUB_CLIENT_SECRET", ""),
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id

        // Get user role and permissions
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: true,
          },
        })

        if (userWithRole?.role) {
          token.role = userWithRole.role.id
          token.permissions = userWithRole.role.permissions
        } else {
          // Default role if none assigned
          token.role = "USER"
          token.permissions = ["profile.edit", "content.create", "content.view"]
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
    async signIn({ user, account }) {
      // Update user's online status when signing in
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isOnline: true,
            lastSeen: new Date(),
          },
        })
      }
      return true
    },
  },
  events: {
    async signOut({ token }) {
      // Update user's online status when signing out
      if (token.id) {
        await prisma.user.update({
          where: { id: token.id as string },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          },
        })
      }
    },
  },
  secret: await env("NEXTAUTH_SECRET", "your-secret-key"),
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
      coverImage: true,
      bio: true,
      location: true,
      website: true,
      occupation: true,
      joinedAt: true,
      isVerified: true,
      role: true,
      tier: true,
      isOnline: true,
      lastSeen: true,
    },
  })
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
      coverImage: true,
      bio: true,
      location: true,
      website: true,
      occupation: true,
      joinedAt: true,
      isVerified: true,
      role: true,
      tier: true,
      isOnline: true,
      lastSeen: true,
    },
  })
}

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
      coverImage: true,
      bio: true,
      location: true,
      website: true,
      occupation: true,
      joinedAt: true,
      isVerified: true,
      role: true,
      tier: true,
      isOnline: true,
      lastSeen: true,
    },
  })
}


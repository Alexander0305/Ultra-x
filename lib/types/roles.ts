export interface Permission {
  id: string
  name: string
  description: string
  category: string
  isSystem: boolean
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
}

export type PermissionCategory =
  | "system"
  | "content"
  | "users"
  | "moderation"
  | "profile"
  | "premium"
  | "contributor"
  | "custom"


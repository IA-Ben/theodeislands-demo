// Simple authentication for CMS
// In production, use NextAuth.js or similar

import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

// Simple user store (in production, use a database)
const ADMIN_USERS = [
  {
    id: 'admin-1',
    email: 'admin@odeislands.com',
    name: 'Admin User',
    // Password: 'admin123' (hashed)
    passwordHash: '$2a$12$LQv3c1yqBTVHDv8CJkJdcuRB8O9Rq.aaEqhU4rZ4V8EtCJQG.KuYy',
    role: 'admin' as const
  }
]

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

// Generate a simple session token
function generateSessionToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Authenticate user credentials
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = ADMIN_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return null

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}

// Create session
export async function createSession(user: AuthUser): Promise<string> {
  const token = generateSessionToken()
  const cookieStore = await cookies()

  // Store session token (in production, store in database with expiration)
  cookieStore.set('cms-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  // Store user data in another cookie (encrypted in production)
  cookieStore.set('cms-user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return token
}

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let userCookie: string | undefined

    if (request) {
      userCookie = request.cookies.get('cms-user')?.value
    } else {
      const cookieStore = await cookies()
      userCookie = cookieStore.get('cms-user')?.value
    }

    if (!userCookie) return null

    const user = JSON.parse(userCookie) as AuthUser
    return user
  } catch {
    return null
  }
}

// Logout user
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('cms-session')
  cookieStore.delete('cms-user')
}

// Check if user has permission
export function hasPermission(user: AuthUser | null, action: string): boolean {
  if (!user) return false

  switch (action) {
    case 'read':
      return ['admin', 'editor', 'viewer'].includes(user.role)
    case 'write':
      return ['admin', 'editor'].includes(user.role)
    case 'delete':
      return user.role === 'admin'
    case 'publish':
      return ['admin', 'editor'].includes(user.role)
    case 'export':
      return user.role === 'admin'
    default:
      return false
  }
}
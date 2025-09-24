import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect CMS routes
  if (request.nextUrl.pathname.startsWith('/cms')) {
    // Allow login page
    if (request.nextUrl.pathname === '/cms/login') {
      return NextResponse.next()
    }

    // Check if user is authenticated
    const sessionCookie = request.cookies.get('cms-session')
    const userCookie = request.cookies.get('cms-user')

    if (!sessionCookie || !userCookie) {
      return NextResponse.redirect(new URL('/cms/login', request.url))
    }
  }

  // Protect CMS API routes (except auth endpoints)
  if (request.nextUrl.pathname.startsWith('/api/cms') && 
      !request.nextUrl.pathname.startsWith('/api/cms/auth')) {
    
    const sessionCookie = request.cookies.get('cms-session')
    const userCookie = request.cookies.get('cms-user')

    if (!sessionCookie || !userCookie) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cms/:path*',
    '/api/cms/:path*'
  ]
}
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if route is protected (starts with /admin)
  if (pathname.startsWith('/admin')) {
    // Get token from headers
    // Note: In browser, token is in sessionStorage, so we need to check the Authorization header
    // For server-side operations, you can send token in Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify token
      verifyToken(token)
      return NextResponse.next()
    } catch (error) {
      // Token is invalid or expired, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

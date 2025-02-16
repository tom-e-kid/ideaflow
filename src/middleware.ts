import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Paths that don't require authentication
const publicPaths = ['/auth', '/api/auth']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  )

  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to signin page
  if (!isPublicPath && !token) {
    const url = new URL('/auth/signin', request.url)
    // Store the original path to redirect after signin
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: This needs to include /auth and /api/auth for the middleware to work
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 
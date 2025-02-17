import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const modifiedHeaders = new Headers(req.headers)
  modifiedHeaders.set('x-url', req.url)
  modifiedHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: modifiedHeaders,
    },
  })
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ],
}

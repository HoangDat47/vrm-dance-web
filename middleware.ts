import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Allow public routes without authentication
  if (
    pathname === '/' ||
    pathname === '/auth' || 
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/models') ||
    pathname.startsWith('/api/animations')
  ) {
    return NextResponse.next();
  }

  // Check if user has auth cookie
  const sessionCookie = request.cookies.get('sb-auth-token');

  // Redirect unauthenticated users to auth page only for protected routes
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
};

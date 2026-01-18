import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
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

  // For protected routes, verify Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get the access token from cookies
  const accessToken = request.cookies.get('sb-access-token')?.value || 
                      request.cookies.get('sb-auth-token')?.value;

  if (accessToken) {
    try {
      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (user && !error) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Auth verification error:', error);
    }
  }

  // Redirect unauthenticated users to login
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
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

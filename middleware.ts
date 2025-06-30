import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = [
    '/',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/products',
  ].some(publicPath => 
    path === publicPath || 
    path.startsWith('/products/') ||
    path.startsWith('/api/products/')
  );

  // Check if the path is for static files
  const isStaticFile = [
    '/favicon.ico',
    '/_next',
  ].some(staticPath => path.startsWith(staticPath));

  // We'll use a custom auth cookie instead of next-auth
  const hasAuthCookie = request.cookies.has('user_auth');

  // If the path requires authentication and user is not authenticated, redirect to login
  if (!isPublicPath && !isStaticFile && !hasAuthCookie) {
    // For client-side auth, we'll rely more on the client-side checks
    // This is a simple check that will redirect unauthenticated users
    // from server-rendered protected pages
    if (path.startsWith('/admin') || path.startsWith('/profile') || path.startsWith('/orders')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If the user is already logged in and tries to access login/register page, redirect to home
  if ((path === '/login' || path === '/register') && hasAuthCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth (NextAuth.js API routes)
     * 2. /_next (Next.js internals)
     * 3. /fonts (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)',
  ],
};
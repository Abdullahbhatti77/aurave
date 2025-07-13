// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/products",
  ].some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith("/products/") ||
      path.startsWith("/api/products/")
  );

  // Check if the path is for static files
  const isStaticFile = ["/_next", "/favicon.ico"].some((staticPath) =>
    path.startsWith(staticPath)
  );

  // Get the NextAuth session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if user is authenticated and has the required role
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "admin";

  // Protect routes
  if (!isPublicPath && !isStaticFile && !isAuthenticated) {
    if (
      path.startsWith("/admin") ||
      path.startsWith("/profile") ||
      path.startsWith("/orders")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Additional check for admin routes
  if (path.startsWith("/admin") && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is authenticated and tries to access login/register, redirect to home
  if ((path === "/login" || path === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth (NextAuth.js API routes)
     * 2. /_next (Next.js internals)
     * 3. /fonts (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
};

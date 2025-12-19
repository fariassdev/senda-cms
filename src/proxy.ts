import { jwtVerify } from 'jose';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 1. Specify protected and public routes
const protectedRoutes = ['/courses', '/lessons'];
const publicRoutes = ['/login'];

/**
 * Validates JWT token using jose library (Edge Runtime compatible)
 * @param token - JWT token to validate
 * @returns Promise<boolean> - true if token is valid, false otherwise
 */
async function validateToken(token: string): Promise<boolean> {
  try {
    // We need the JWT secret from environment variables
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn('JWT_SECRET not configured, skipping token validation');
      return true; // In development, we might not have the secret configured yet
    }

    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(secret);

    // Verify the JWT token
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    console.log('Token validation failed:', error);
    return false;
  }
}

/**
 * Middleware for route protection
 * Follows Next.js best practices for authentication middleware
 * - Validates JWT tokens and clears invalid ones
 * - Redirects unauthenticated users from protected routes to login
 * - Redirects authenticated users from public routes to dashboard
 */
export async function proxy(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Check for authentication token
  const token = request.cookies.get('senda_auth_token')?.value;

  // 4. Validate token if it exists
  let isValidToken = false;
  if (token) {
    isValidToken = await validateToken(token);

    // If token is invalid, clear it and treat as unauthenticated
    if (!isValidToken) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('senda_auth_token');
      response.cookies.delete('senda_refresh_token');
      return response;
    }
  }

  // 5. Redirect to /login if the user is not authenticated and accessing protected route
  if (isProtectedRoute && (!token || !isValidToken)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Redirect to /courses if the user is authenticated and accessing public route
  if (isPublicRoute && token && isValidToken && !path.startsWith('/courses')) {
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  // 7. For the root path, redirect based on authentication status
  if (path === '/') {
    if (token && isValidToken) {
      return NextResponse.redirect(new URL('/courses', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * Following Next.js best practices for path matching
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

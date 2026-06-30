import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwtRole(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Decode base64 payload at the Edge
    const payload = JSON.parse(atob(parts[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ciisic_token')?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isProtectedRoute = pathname.startsWith('/portal') || pathname.startsWith('/dashboard');

  // Authentication routes
  const isAuthRoute = pathname.startsWith('/auth');

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtectedRoute && token) {
    const role = parseJwtRole(token);

    // Enforce role-based route gates
    if (pathname.startsWith('/portal/student') || pathname.startsWith('/dashboard/student')) {
      if (role !== 'STUDENT') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (pathname.startsWith('/portal/industry') || pathname.startsWith('/dashboard/industry')) {
      if (role !== 'INDUSTRY_SPOC') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (pathname.startsWith('/portal/institution') || pathname.startsWith('/dashboard/institution')) {
      if (role !== 'INSTITUTION_SPOC') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (pathname.startsWith('/portal/admin') || pathname.startsWith('/admin')) {
      if (role !== 'SUPER_ADMIN' && role !== 'CII_ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (pathname.startsWith('/portal/reviewer') || pathname.startsWith('/reviewer')) {
      if (role !== 'REVIEWER') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/dashboard/:path*', '/admin/:path*', '/auth/:path*', '/reviewer/:path*']
};

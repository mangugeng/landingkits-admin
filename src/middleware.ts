import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 menit
  max: 100, // maksimal 100 request per menit
};

// In-memory store untuk rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return false;
  }

  if (now > record.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT.max) {
    return true;
  }

  record.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-real-ip') ?? 'unknown';
  const authCookie = request.cookies.get('auth');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Rate limiting untuk API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    return NextResponse.next();
  }

  // Rate limiting untuk halaman login
  if (isLoginPage) {
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Jika sudah login dan mencoba mengakses halaman login
  if (isLoginPage && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika mencoba mengakses dashboard tanpa auth
  if (isDashboardPage && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login, arahkan ke dashboard
  if (authCookie && !isDashboardPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
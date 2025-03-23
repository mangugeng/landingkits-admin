import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

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
  matcher: ['/dashboard/:path*', '/login', '/'],
}; 
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('rw_auth_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  // Strict route gating: /dashboard and all subroutes require an authenticated session
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from /login and /register to /dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
};

import { NextResponse } from 'next/server';

// Pages that need a signed-in user. The token is fully verified by the API routes;
// pages also redirect to /login themselves when /api/auth/me says the session is invalid.
export function middleware(request) {
  const token = request.cookies.get('rw_auth_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding'],
};

import { NextResponse } from 'next/server';
import { currentUserRecord, publicUser, AUTH_COOKIE } from '../../../../src/lib/store.js';

export async function GET(request) {
  const user = currentUserRecord(request);
  if (!user) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    // Clear stale or invalid cookies so the user can sign in again.
    if (request.cookies.get(AUTH_COOKIE)) response.cookies.delete(AUTH_COOKIE);
    return response;
  }
  return NextResponse.json({ authenticated: true, user: publicUser(user) });
}

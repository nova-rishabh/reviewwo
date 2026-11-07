import { NextResponse } from 'next/server';
import { loadData, signToken } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const users = loadData('users.json', []);
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please register first.' }, { status: 401 });
    }

    if (user.password && user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName,
      role: user.role || 'merchant',
      plan: user.plan || 'growth'
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        plan: user.plan,
        planPrice: user.planPrice || 299,
        role: user.role,
        googlePlaceId: user.googlePlaceId || ''
      }
    });

    response.cookies.set('rw_auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

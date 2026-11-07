import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadData, saveData, signToken } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, mobile, phone, businessName, password, plan = 'growth' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const users = loadData('users.json', []);
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 400 });
    }

    const planPrices = { starter: 149, growth: 299, agency: 799 };
    const targetPhone = mobile || phone || '';
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      mobile: targetPhone,
      businessName: businessName ? businessName.trim() : `${name}'s Business`,
      plan,
      planPrice: planPrices[plan] || 299,
      createdAt: new Date().toISOString(),
      role: 'merchant',
      googlePlaceId: '',
      googleRating: 5.0,
      reviewCount: 0
    };

    users.push(newUser);
    saveData('users.json', users);

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      businessName: newUser.businessName,
      plan: newUser.plan
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: newUser
    });

    response.cookies.set('rw_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  loadData,
  saveData,
  publicUser,
  setAuthCookie,
  tokenFor,
  normalizeMobile,
  PLAN_IDS,
} from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const mobile = normalizeMobile(body.mobile);
    const plan = PLAN_IDS.includes(body.plan) ? body.plan : 'starter';
    const billingCycle = body.billingCycle === 'annual' ? 'annual' : 'monthly';

    if (!name) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Use at least 8 characters for your password.' }, { status: 400 });
    }
    if (!mobile) {
      return NextResponse.json({ error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const users = loadData('users.json', []);
    if (users.some((u) => u.email && u.email.toLowerCase() === email)) {
      return NextResponse.json({ error: 'An account with this email already exists. Sign in instead.' }, { status: 409 });
    }
    if (users.some((u) => u.mobile && normalizeMobile(u.mobile) === mobile)) {
      return NextResponse.json({ error: 'This mobile number is already used by another account.' }, { status: 409 });
    }

    const user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      mobile,
      businessName: '',
      category: '',
      city: '',
      googlePlaceId: '',
      alertName: name,
      alertMobile: mobile,
      plan,
      billingCycle,
      planStatus: 'unpaid',
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveData('users.json', users);

    const response = NextResponse.json({ success: true, user: publicUser(user) });
    return setAuthCookie(response, tokenFor(user));
  } catch (err) {
    return NextResponse.json({ error: 'Could not create your account. Please try again.' }, { status: 500 });
  }
}

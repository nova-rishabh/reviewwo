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
import { redeemCoupon, listCoupons, normalizeCode } from '../../../../src/lib/coupons.js';
import { findActiveReference, normalizeRef } from '../../../../src/lib/references.js';

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

    // Check a coupon before creating the account so a typo does not leave a half-set-up account.
    const couponCode = normalizeCode(body.coupon);
    if (couponCode) {
      const c = listCoupons().find((x) => x.code === couponCode);
      if (!c || !c.active) return NextResponse.json({ error: 'This coupon code isn’t valid.' }, { status: 400 });
      if (c.maxUses > 0 && c.uses >= c.maxUses) {
        return NextResponse.json({ error: 'This coupon has already been used the maximum number of times.' }, { status: 400 });
      }
    }

    const refCode = normalizeRef(body.reference);
    const reference = refCode ? findActiveReference(refCode) : null;
    if (refCode && !reference) {
      return NextResponse.json({ error: 'This reference code isn’t valid. Check it, or leave it empty.' }, { status: 400 });
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
      ...(reference ? { referenceCode: reference.code } : {}),
    };

    if (couponCode) redeemCoupon(user, couponCode);
    users.push(user);
    saveData('users.json', users);

    const response = NextResponse.json({ success: true, user: publicUser(user) });
    return setAuthCookie(response, tokenFor(user));
  } catch (err) {
    return NextResponse.json({ error: 'Could not create your account. Please try again.' }, { status: 500 });
  }
}

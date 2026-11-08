import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest, publicUser } from '../../../../src/lib/store.js';
import { redeemCoupon } from '../../../../src/lib/coupons.js';

const attempts = globalThis.__rwCouponAttempts || (globalThis.__rwCouponAttempts = new Map());

/** Signed-in user applies a coupon code to their account. */
export async function POST(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  // Slow down guessing: 10 tries per user per 10 minutes.
  const now = Date.now();
  const recent = (attempts.get(session.id) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 10) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }
  attempts.set(session.id, [...recent, now]);

  try {
    const { code } = await request.json();
    const users = loadData('users.json', []);
    const record = users.find((u) => u.id === session.id);
    if (!record) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

    const coupon = redeemCoupon(record, code);
    saveData('users.json', users);
    return NextResponse.json({ success: true, user: publicUser(record), plan: coupon.plan, months: coupon.months });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not apply the coupon.' }, { status: 400 });
  }
}

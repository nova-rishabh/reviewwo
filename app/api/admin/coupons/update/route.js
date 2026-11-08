import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../../src/lib/store.js';
import { setCouponActive } from '../../../../../src/lib/coupons.js';

/** Turn a coupon on or off: { code, active }. */
export async function POST(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const { code, active } = await request.json();
    const coupon = setCouponActive(code, active);
    return NextResponse.json({ success: true, coupon });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not update the coupon.' }, { status: 400 });
  }
}

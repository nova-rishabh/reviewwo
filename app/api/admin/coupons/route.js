import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { listCoupons, createCoupon } from '../../../../src/lib/coupons.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  return NextResponse.json(listCoupons());
}

export async function POST(request) {
  const admin = currentAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const body = await request.json();
    const coupon = createCoupon({ ...body, createdBy: admin.email });
    return NextResponse.json({ success: true, coupon });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not create the coupon.' }, { status: 400 });
  }
}

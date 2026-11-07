import { NextResponse } from 'next/server';
import { otpStore, loadData, saveData, signToken } from '../../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const rawMobile = body.mobile || body.phone || '';
    const otp = body.otp || body.code || '';
    const cleanMobile = rawMobile.replace(/[^0-9]/g, '');
    const record = otpStore.get(cleanMobile);

    if (record && record.otp === otp && Date.now() < record.expiresAt) {
      otpStore.delete(cleanMobile);
      const users = loadData('users.json', []);
      let user = users.find(u => u.mobile && u.mobile.replace(/[^0-9]/g, '') === cleanMobile);

      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: 'WhatsApp Merchant',
          email: `wa_${cleanMobile}@reviewwo.divergit.com`,
          mobile: rawMobile,
          businessName: 'My Local Business',
          plan: 'growth',
          planPrice: 299,
          createdAt: new Date().toISOString(),
          role: 'merchant',
          googlePlaceId: '',
          googleRating: 5.0,
          reviewCount: 0
        };
        users.push(user);
        saveData('users.json', users);
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        role: 'merchant',
        plan: user.plan
      });

      const response = NextResponse.json({
        success: true,
        token,
        user
      });

      response.cookies.set('rw_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new code.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { otpStore } from '../../../../../src/lib/store.js';
import { waTransport } from '../../../../../src/whatsapp/transport.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const mobile = body.mobile || body.phone;
    if (!mobile) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(cleanMobile, { otp: rawOtp, expiresAt });

    const dispatch = await waTransport.sendOtp(mobile, rawOtp);
    return NextResponse.json({
      success: true,
      message: 'OTP dispatched via sovereign WhatsApp socket.',
      delivered: dispatch.delivered,
      logId: dispatch.logId,
      expiresInSeconds: 300,
      cost: '₹0.00 (Zero SMS Fees)'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

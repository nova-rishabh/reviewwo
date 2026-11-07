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

    // Anti-abuse rate limiting: 60-second cooldown per mobile number
    const existing = otpStore.get(cleanMobile);
    if (existing && existing.lastRequested && Date.now() - existing.lastRequested < 60 * 1000) {
      const waitSeconds = Math.ceil((60 * 1000 - (Date.now() - existing.lastRequested)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitSeconds}s before requesting a new security code.` },
        { status: 429 }
      );
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(cleanMobile, { otp: rawOtp, expiresAt, lastRequested: Date.now() });

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

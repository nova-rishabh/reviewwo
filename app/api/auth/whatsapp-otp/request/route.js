import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { otpStore, loadData, normalizeMobile } from '../../../../../src/lib/store.js';
import { waTransport } from '../../../../../src/whatsapp/transport.js';

const COOLDOWN_MS = 60 * 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const mobile = normalizeMobile(body.mobile || body.phone);
    if (!mobile) {
      return NextResponse.json({ error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const existing = otpStore.get(mobile);
    if (existing?.lastRequested && Date.now() - existing.lastRequested < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (Date.now() - existing.lastRequested)) / 1000);
      return NextResponse.json({ error: `Wait ${wait} seconds before asking for another code.` }, { status: 429 });
    }

    const users = loadData('users.json', []);
    const account = users.find((u) => u.mobile && normalizeMobile(u.mobile) === mobile);

    // Same response whether or not the number has an account, so numbers can't be probed.
    otpStore.set(mobile, { lastRequested: Date.now() });
    if (account) {
      const otp = String(crypto.randomInt(100000, 1000000));
      otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000, lastRequested: Date.now(), attempts: 0 });
      const result = await waTransport.sendOtp(mobile, otp);
      if (!result?.delivered) {
        return NextResponse.json(
          { error: 'We couldn’t send a WhatsApp code right now. Sign in with your email and password instead.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ success: true, expiresInSeconds: 300 });
  } catch (err) {
    return NextResponse.json({ error: 'Could not send a code. Please try again.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  otpStore,
  loadData,
  normalizeMobile,
  publicUser,
  setAuthCookie,
  tokenFor,
} from '../../../../../src/lib/store.js';

const INVALID = 'That code is wrong or has expired. Ask for a new one.';

export async function POST(request) {
  try {
    const body = await request.json();
    const mobile = normalizeMobile(body.mobile || body.phone);
    const otp = String(body.otp || body.code || '').trim();
    const record = mobile ? otpStore.get(mobile) : null;

    if (!record?.otp || Date.now() >= record.expiresAt) {
      return NextResponse.json({ error: INVALID }, { status: 400 });
    }

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 5) {
      otpStore.delete(mobile);
      return NextResponse.json({ error: 'Too many wrong attempts. Ask for a new code.' }, { status: 429 });
    }
    if (record.otp !== otp) {
      return NextResponse.json({ error: INVALID }, { status: 400 });
    }

    otpStore.delete(mobile);
    const users = loadData('users.json', []);
    const user = users.find((u) => u.mobile && normalizeMobile(u.mobile) === mobile);
    if (!user) {
      return NextResponse.json({ error: INVALID }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user: publicUser(user) });
    return setAuthCookie(response, tokenFor(user));
  } catch (err) {
    return NextResponse.json({ error: 'Sign-in failed. Please try again.' }, { status: 500 });
  }
}

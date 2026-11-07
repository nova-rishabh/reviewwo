import { NextResponse } from 'next/server';
import { currentUserRecord, normalizeMobile } from '../../../../src/lib/store.js';
import { waTransport } from '../../../../src/whatsapp/transport.js';

const lastSent = globalThis.__rwTestAlerts || (globalThis.__rwTestAlerts = new Map());

/** Sends a fixed test message to the signed-in user's own alert number. */
export async function POST(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  const to = normalizeMobile(user.alertMobile || user.mobile);
  if (!to) return NextResponse.json({ error: 'Add an alert number first.' }, { status: 400 });

  const prev = lastSent.get(user.id) || 0;
  if (Date.now() - prev < 30 * 1000) {
    return NextResponse.json({ error: 'Wait a few seconds before sending another test.' }, { status: 429 });
  }
  lastSent.set(user.id, Date.now());

  try {
    const result = await waTransport.sendTestAlert(to, { businessName: user.businessName });
    if (!result?.delivered) {
      return NextResponse.json(
        { error: 'The test message could not be delivered right now. Please try again later.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: true, to });
  } catch (err) {
    return NextResponse.json({ error: 'The test message could not be sent.' }, { status: 500 });
  }
}

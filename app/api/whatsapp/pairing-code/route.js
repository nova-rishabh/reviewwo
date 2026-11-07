import { NextResponse } from 'next/server';
import { currentAdmin, normalizeMobile } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function POST(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const { mobile } = await request.json();
    const clean = normalizeMobile(mobile);
    if (!clean) return NextResponse.json({ error: 'Enter a valid WhatsApp number.' }, { status: 400 });
    const res = await waSocket.requestPairingCode(clean);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not get a pairing code.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const qr = await waSocket.generatePairingQr();
    return NextResponse.json({ success: true, connected: Boolean(qr.connected), qrDataUrl: qr.dataUrl || null });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not create a pairing code.' }, { status: 500 });
  }
}

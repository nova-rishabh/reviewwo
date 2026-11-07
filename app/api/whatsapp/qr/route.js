import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const qrData = await waSocket.generatePairingQr();
    return NextResponse.json({
      success: true,
      raw: qrData.raw,
      dataUrl: qrData.dataUrl,
      qrDataUrl: qrData.dataUrl
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

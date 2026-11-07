import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = await waSocket.disconnect();
  return NextResponse.json({ success: true, status });
}

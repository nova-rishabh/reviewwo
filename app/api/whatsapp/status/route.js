import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = waSocket.getStatus();
  return NextResponse.json(status);
}

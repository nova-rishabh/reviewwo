import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function POST(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  const status = await waSocket.disconnect();
  return NextResponse.json({ success: true, status });
}

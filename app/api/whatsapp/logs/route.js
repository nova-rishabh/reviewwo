import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  return NextResponse.json(waSocket.getLogs(50));
}

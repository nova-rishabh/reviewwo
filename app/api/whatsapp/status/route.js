import { NextResponse } from 'next/server';
import { currentUserRecord, isAdminEmail } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  const status = waSocket.getStatus();
  if (!isAdminEmail(user.email)) {
    // Merchants only need to know whether alerts can be delivered.
    return NextResponse.json({ connected: status.connected });
  }
  return NextResponse.json(status);
}

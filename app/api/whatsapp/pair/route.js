import { NextResponse } from 'next/server';
import { authenticateRequest, loadData } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const users = loadData('users.json', []);
    const currentUser = users.find(u => u.id === user.id) || user;
    const phone = body.mobile || currentUser.mobile || '+919876543210';

    const status = await waSocket.pairSimulate(phone);
    return NextResponse.json({ success: true, status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

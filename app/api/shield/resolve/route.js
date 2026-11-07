import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

/** Mark a feedback message resolved ({ id, note }) or reopen it ({ id, reopen: true }). */
export async function POST(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const body = await request.json();
    const id = body.id || body.logId;
    const log = loadData('shield_logs.json', []);
    const item = log.find((l) => l.id === id && l.userId === session.id);
    if (!item) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });

    if (body.reopen === true) {
      item.status = 'open';
      item.resolvedAt = null;
    } else {
      item.status = 'resolved';
      item.resolvedAt = new Date().toISOString();
      item.note = String(body.note || '').trim().slice(0, 500);
    }
    saveData('shield_logs.json', log);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update the message.' }, { status: 500 });
  }
}

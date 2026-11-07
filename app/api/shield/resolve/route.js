import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { logId, resolutionNote } = await request.json();
    const logs = loadData('shield_logs.json', []);
    const record = logs.find(l => l.id === logId);

    if (!record) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }

    record.status = 'resolved';
    record.resolvedAt = new Date().toISOString();
    record.actionTaken = resolutionNote || 'Contacted customer via WhatsApp and resolved grievance.';

    saveData('shield_logs.json', logs);
    return NextResponse.json({ success: true, log: record });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

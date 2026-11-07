import { NextResponse } from 'next/server';
import { loadData, saveData } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { rating, feedback, customerPhone, customerName } = body;

    const logs = loadData('shield_logs.json', []);
    const newLog = {
      id: `shd_${Date.now()}`,
      rating: Number(rating) || 2,
      feedback: feedback ? feedback.trim() : 'Grievance intercepted via QR shield.',
      customerPhone: customerPhone ? customerPhone.trim() : 'Customer',
      customerName: customerName ? customerName.trim() : 'Anonymous Guest',
      interceptedAt: new Date().toISOString(),
      status: 'pending',
      actionTaken: 'Routed away from public Google page to private manager resolution.'
    };

    logs.unshift(newLog);
    saveData('shield_logs.json', logs);

    return NextResponse.json({
      success: true,
      intercepted: true,
      message: 'Feedback received privately. Our management team is addressing this immediately.',
      shieldLog: newLog
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, tableNumber, format = 'acrylic_7x5' } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Standee label is required.' }, { status: 400 });
    }

    const standees = loadData('standees.json', []);
    const shortCode = 'RW' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newStandee = {
      id: `std_${Date.now()}`,
      userId: user.id,
      name: name.trim(),
      tableNumber: tableNumber ? tableNumber.trim() : '',
      format,
      shortCode,
      qrUrl: `https://reviewwo.qr/${shortCode}`,
      scans: 0,
      fiveStarReviewsGenerated: 0,
      createdAt: new Date().toISOString()
    };

    standees.push(newStandee);
    saveData('standees.json', standees);

    return NextResponse.json({ success: true, standee: newStandee });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

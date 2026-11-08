import { NextResponse } from 'next/server';
import { loadData, saveData, currentAdmin } from '../../../../../src/lib/store.js';
import { NFC_ORDER_STATUSES } from '../../../../../src/lib/nfc.js';

/** Update an order's status and the note shown to the customer: { id, status, adminNote }. */
export async function POST(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const { id, status, adminNote } = await request.json();
    const orders = loadData('nfc_orders.json', []);
    const order = orders.find((o) => o.id === id);
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (status !== undefined) {
      if (!NFC_ORDER_STATUSES.includes(status)) return NextResponse.json({ error: 'Unknown status.' }, { status: 400 });
      order.status = status;
    }
    if (adminNote !== undefined) order.adminNote = String(adminNote).trim().slice(0, 300);
    order.updatedAt = new Date().toISOString();
    saveData('nfc_orders.json', orders);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update the order.' }, { status: 500 });
  }
}

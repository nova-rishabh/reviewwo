import { NextResponse } from 'next/server';
import { loadData, saveData, currentUserRecord, normalizeMobile } from '../../../src/lib/store.js';
import { NFC_CARD_PRICE } from '../../../src/lib/nfc.js';
import { waTransport } from '../../../src/whatsapp/transport.js';

const text = (v, max) => String(v ?? '').trim().slice(0, max);

/** The signed-in user's NFC card orders. */
export async function GET(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });
  const orders = loadData('nfc_orders.json', []).filter((o) => o.userId === user.id);
  return NextResponse.json(orders);
}

/**
 * Request NFC cards. Body: { items: [{ cardId, qty }], name, phone, address, city, pincode, notes }.
 * No payment is taken here; the team confirms the total and delivery charge before shipping.
 */
export async function POST(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const body = await request.json();
    const myCards = loadData('standees.json', []).filter((c) => c.userId === user.id);
    const items = (Array.isArray(body.items) ? body.items : [])
      .map((i) => ({ card: myCards.find((c) => c.id === i.cardId), qty: Math.floor(Number(i.qty)) }))
      .filter((i) => i.card && i.qty > 0);

    if (!items.length) return NextResponse.json({ error: 'Choose at least one QR code and a quantity.' }, { status: 400 });
    if (items.some((i) => i.qty > 100)) return NextResponse.json({ error: 'Order at most 100 cards per QR code.' }, { status: 400 });

    const name = text(body.name, 80);
    const phone = normalizeMobile(body.phone);
    const address = text(body.address, 300);
    const city = text(body.city, 80);
    const pincode = text(body.pincode, 10);
    if (!name) return NextResponse.json({ error: 'Enter the name for delivery.' }, { status: 400 });
    if (!phone) return NextResponse.json({ error: 'Enter a valid 10-digit phone number for delivery.' }, { status: 400 });
    if (!address || !city) return NextResponse.json({ error: 'Enter the delivery address and city.' }, { status: 400 });
    if (!/^\d{6}$/.test(pincode)) return NextResponse.json({ error: 'Enter a 6-digit PIN code.' }, { status: 400 });

    const quantity = items.reduce((n, i) => n + i.qty, 0);
    const order = {
      id: `nfc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: user.id,
      businessName: user.businessName || '',
      email: user.email,
      items: items.map((i) => ({ cardId: i.card.id, cardName: i.card.name, shortCode: i.card.shortCode, url: i.card.fullUrl, qty: i.qty })),
      quantity,
      unitPrice: NFC_CARD_PRICE,
      cardsTotal: quantity * NFC_CARD_PRICE,
      delivery: { name, phone, address, city, pincode },
      notes: text(body.notes, 500),
      status: 'requested',
      adminNote: '',
      createdAt: new Date().toISOString(),
    };

    const orders = loadData('nfc_orders.json', []);
    orders.unshift(order);
    saveData('nfc_orders.json', orders);

    // Optional heads-up to the team. Failure here must not fail the order.
    const notify = normalizeMobile(process.env.ORDER_ALERT_MOBILE);
    if (notify) {
      waTransport.adapter
        .sendMessage(
          notify,
          `New NFC card request\n\n${order.businessName} (${order.email})\nCards: ${quantity} (₹${order.cardsTotal} before delivery)\nDeliver to: ${city} ${pincode}\n\nOpen the Reviewwo admin page to confirm.`,
          'order_alert'
        )
        .catch(() => {});
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: 'Could not send your request. Please try again.' }, { status: 500 });
  }
}

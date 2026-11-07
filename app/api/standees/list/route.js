import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let standees = loadData('standees.json', []);

    // Seed default flagship standee if none exists
    if (!standees || standees.length === 0) {
      standees = [
        {
          id: 'std_flagship_cashier',
          userId: user.id,
          name: 'Main Cashier Counter Standee',
          tableNumber: 'Billing Counter 01',
          format: 'acrylic_7x5',
          shortCode: 'RW101',
          qrUrl: '/r/RW101',
          fullUrl: 'https://reviewwo.divergit.com/r/RW101',
          scans: 34,
          fiveStarReviewsGenerated: 28,
          createdAt: new Date().toISOString()
        }
      ];
    }

    let modified = false;
    for (const std of standees) {
      if (!std.qrDataUrl) {
        const fullUrl = std.fullUrl || `https://reviewwo.divergit.com/r/${std.shortCode}`;
        std.fullUrl = fullUrl;
        try {
          std.qrDataUrl = await QRCode.toDataURL(fullUrl, {
            width: 400,
            margin: 1,
            color: { dark: '#0B3D3B', light: '#FFFFFF' }
          });
          std.qrSvg = await QRCode.toString(fullUrl, {
            type: 'svg',
            margin: 1,
            color: { dark: '#0B3D3B', light: '#FFFFFF' }
          });
          modified = true;
        } catch (e) {}
      }
    }

    if (modified) {
      saveData('standees.json', standees);
    }

    return NextResponse.json(standees);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

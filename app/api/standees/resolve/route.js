import { NextResponse } from 'next/server';
import { loadData } from '../../../../src/lib/store.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get('code') || '').trim();

  const standees = loadData('standees.json', []);
  const users = loadData('users.json', []);

  // Try to find standee by code
  let matchedStandee = null;
  if (code) {
    matchedStandee = standees.find(s => 
      (s.shortCode && s.shortCode.toLowerCase() === code.toLowerCase()) ||
      (s.id && s.id.toLowerCase() === code.toLowerCase()) ||
      (s.qrSlug && s.qrSlug.toLowerCase() === code.toLowerCase())
    );
  }

  // Find merchant
  let merchant = null;
  if (matchedStandee && matchedStandee.userId) {
    merchant = users.find(u => u.id === matchedStandee.userId);
  }
  if (!merchant && users.length > 0) {
    merchant = users[0];
  }

  const businessName = (matchedStandee && matchedStandee.name) || (merchant && merchant.businessName) || 'Reviewwo Partner Store';
  const placeId = (merchant && merchant.googlePlaceId) || '';
  const rating = (merchant && merchant.googleRating) || 5.0;
  const totalReviews = (merchant && merchant.reviewCount) || 0;
  const tableNumber = (matchedStandee && matchedStandee.tableNumber) || '';

  return NextResponse.json({
    success: true,
    code: code || 'DEMO',
    standee: matchedStandee,
    business: {
      name: businessName,
      placeId: placeId,
      rating: rating,
      totalReviews: totalReviews,
      tableNumber: tableNumber,
      hasPlaceId: Boolean(placeId)
    }
  });
}

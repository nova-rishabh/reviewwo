import { NextResponse } from 'next/server';
import {
  loadData,
  saveData,
  authenticateRequest,
  normalizeMobile,
  isValidPlaceId,
  publicUser,
} from '../../../../src/lib/store.js';
import { cleanKeywords, isHexColor, isValidLogo, MAX_LOGO_BYTES } from '../../../../src/lib/branding.js';

const CATEGORIES = ['restaurant', 'cafe', 'salon', 'clinic', 'retail', 'hotel', 'gym', 'other'];

const text = (v, max = 120) => String(v ?? '').trim().slice(0, max);

/** Partial update: only the fields present in the body are changed. */
export async function POST(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const body = await request.json();
    const users = loadData('users.json', []);
    const record = users.find((u) => u.id === session.id);
    if (!record) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

    const errors = {};

    if ('name' in body) {
      const v = text(body.name);
      if (!v) errors.name = 'Enter your name.';
      else record.name = v;
    }
    if ('businessName' in body) {
      const v = text(body.businessName);
      if (!v) errors.businessName = 'Enter your business name.';
      else record.businessName = v;
    }
    if ('category' in body) {
      if (!CATEGORIES.includes(body.category)) errors.category = 'Choose a business type.';
      else record.category = body.category;
    }
    if ('city' in body) {
      const v = text(body.city, 80);
      if (!v) errors.city = 'Enter your city.';
      else record.city = v;
    }
    if ('googlePlaceId' in body) {
      const v = text(body.googlePlaceId, 300);
      if (v && !isValidPlaceId(v)) errors.googlePlaceId = 'This doesn’t look like a Place ID. It usually starts with “ChIJ”.';
      else record.googlePlaceId = v;
    }
    if ('brandName' in body) {
      record.brandName = text(body.brandName, 80);
    }
    if ('brandColor' in body) {
      if (body.brandColor && !isHexColor(body.brandColor)) errors.brandColor = 'Pick a colour.';
      else record.brandColor = body.brandColor || '';
    }
    if ('brandAccent' in body) {
      if (body.brandAccent && !isHexColor(body.brandAccent)) errors.brandAccent = 'Pick a colour.';
      else record.brandAccent = body.brandAccent || '';
    }
    if ('brandLogo' in body) {
      if (body.brandLogo && !isValidLogo(body.brandLogo)) {
        errors.brandLogo = `Use a PNG, JPG or WebP image under ${Math.round(MAX_LOGO_BYTES / 1024)} KB.`;
      } else record.brandLogo = body.brandLogo || '';
    }
    if ('reviewKeywords' in body) {
      record.reviewKeywords = cleanKeywords(body.reviewKeywords);
    }
    if ('alertName' in body) {
      record.alertName = text(body.alertName, 80);
    }
    if ('alertMobile' in body) {
      const v = normalizeMobile(body.alertMobile);
      if (!v) errors.alertMobile = 'Enter a valid 10-digit WhatsApp number.';
      else record.alertMobile = v;
    }
    if ('mobile' in body) {
      const v = normalizeMobile(body.mobile);
      if (!v) errors.mobile = 'Enter a valid 10-digit mobile number.';
      else if (users.some((u) => u.id !== record.id && normalizeMobile(u.mobile) === v)) {
        errors.mobile = 'This number is already used by another account.';
      } else record.mobile = v;
    }
    if (body.onboardingComplete === true) {
      if (!record.businessName || !record.googlePlaceId || !record.alertMobile) {
        errors.onboardingComplete = 'Add your business name, Google listing and alert number first.';
      } else record.onboardingComplete = true;
    }

    if (Object.keys(errors).length) {
      return NextResponse.json({ error: Object.values(errors)[0], fields: errors }, { status: 400 });
    }

    record.updatedAt = new Date().toISOString();
    saveData('users.json', users);
    return NextResponse.json({ success: true, user: publicUser(record) });
  } catch (err) {
    return NextResponse.json({ error: 'Could not save your changes. Please try again.' }, { status: 500 });
  }
}

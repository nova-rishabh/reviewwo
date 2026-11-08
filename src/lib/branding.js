/**
 * Review-page branding and keywords. Pure data/helpers: safe to import from
 * both server routes and client components.
 */

/** Suggested highlights per business type, used until the owner sets their own. */
export const DEFAULT_KEYWORDS = {
  restaurant: ['Tasty food', 'Friendly staff', 'Quick service', 'Good portions', 'Nice ambience', 'Good value'],
  cafe: ['Great coffee', 'Friendly staff', 'Cosy place', 'Quick service', 'Tasty snacks', 'Good value'],
  salon: ['Great result', 'Friendly staff', 'Clean and hygienic', 'On time', 'Relaxing', 'Good value'],
  clinic: ['Caring doctor', 'Clear explanation', 'Short wait', 'Clean clinic', 'Helpful staff'],
  retail: ['Good range', 'Helpful staff', 'Fair prices', 'Quick billing', 'Easy to find things'],
  hotel: ['Clean room', 'Helpful staff', 'Comfortable stay', 'Good location', 'Good breakfast'],
  gym: ['Good equipment', 'Helpful trainers', 'Clean space', 'Not crowded', 'Good value'],
  other: ['Friendly staff', 'Quick service', 'Good quality', 'Good value', 'Would come back'],
};

export const MAX_KEYWORDS = 12;
export const MAX_KEYWORD_LENGTH = 40;
export const MAX_LOGO_BYTES = 200 * 1024;
export const DEFAULT_BRAND_COLOR = '#0B3D3B';
export const DEFAULT_ACCENT_COLOR = '#F2B705';

export function keywordsFor(user) {
  const own = Array.isArray(user?.reviewKeywords) ? user.reviewKeywords.filter(Boolean) : [];
  return own.length ? own : DEFAULT_KEYWORDS[user?.category] || DEFAULT_KEYWORDS.other;
}

/** Cleans a keyword list from user input: trimmed, de-duplicated, capped. */
export function cleanKeywords(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const k = String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_KEYWORD_LENGTH);
    if (!k || seen.has(k.toLowerCase())) continue;
    seen.add(k.toLowerCase());
    out.push(k);
    if (out.length >= MAX_KEYWORDS) break;
  }
  return out;
}

export function isHexColor(v) {
  return /^#[0-9a-fA-F]{6}$/.test(String(v || ''));
}

/** Logo must be a small PNG, JPEG or WebP data URL (no SVG: it can carry scripts). */
export function isValidLogo(v) {
  const s = String(v || '');
  if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)) return false;
  const bytes = Math.floor(((s.length - s.indexOf(',') - 1) * 3) / 4);
  return bytes <= MAX_LOGO_BYTES;
}

/** Black or white, whichever reads better on the given background colour. */
export function textOn(hex) {
  if (!isHexColor(hex)) return '#FFFFFF';
  const n = parseInt(hex.slice(1), 16);
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.4 ? '#13201F' : '#FFFFFF';
}

/** What the public review page needs to know about a business. */
export function publicBusiness(owner, card) {
  return {
    name: owner.brandName || owner.businessName || 'Our business',
    city: owner.city || '',
    category: owner.category || '',
    placeId: owner.googlePlaceId || '',
    cardName: card?.name || '',
    logo: isValidLogo(owner.brandLogo) ? owner.brandLogo : '',
    color: isHexColor(owner.brandColor) ? owner.brandColor : DEFAULT_BRAND_COLOR,
    accent: isHexColor(owner.brandAccent) ? owner.brandAccent : DEFAULT_ACCENT_COLOR,
    keywords: keywordsFor(owner),
  };
}

/** The business behind the public demo code (/r/demo). */
export const DEMO_OWNER = {
  businessName: 'The Corner Café',
  city: 'Bengaluru',
  category: 'cafe',
  googlePlaceId: '',
};

import fs from 'fs';
import path from 'path';
import { verifyToken, signToken } from '../auth/jwt.js';

export const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

export function getDataFilePath(filename) {
  const safeName = path.basename(filename);
  const target = path.join(dataDir, safeName);
  const parent = path.dirname(target);
  try {
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
  } catch (e) {}
  return target;
}

export function loadData(filename, fallback = []) {
  try {
    const safeName = path.basename(filename);
    const fullPath = getDataFilePath(safeName);

    // 1. If it exists in the active data directory, return it
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8').trim();
      if (content) {
        return JSON.parse(content);
      }
    }

    // 2. If missing from the persistent disk volume, load and seed from bundled project data
    const bundledPath = path.join(process.cwd(), 'data', safeName);
    if (bundledPath !== fullPath && fs.existsSync(bundledPath)) {
      const bundledContent = fs.readFileSync(bundledPath, 'utf8').trim();
      if (bundledContent) {
        const seedData = JSON.parse(bundledContent);
        try {
          saveData(safeName, seedData);
        } catch (e) {}
        return seedData;
      }
    }
  } catch (e) {
    console.error(`Error loading ${filename}:`, e);
  }
  return fallback;
}

export function saveData(filename, data) {
  try {
    const fullPath = getDataFilePath(filename);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Error saving ${filename}:`, e);
    return false;
  }
}

// In-memory OTP store for WhatsApp verification
const globalForOtp = global;
if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = new Map();
}
export const otpStore = globalForOtp.otpStore;

export function authenticateRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').filter(Boolean).map(c => {
      const idx = c.indexOf('=');
      return [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
    })
  );

  let token = cookies.rw_auth_token;
  if (!token) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export { verifyToken, signToken };

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Public base URL used in card links and QR codes. APP_URL is read at runtime;
 * NEXT_PUBLIC_APP_URL is baked in at build time, so it is only a fallback.
 * Printed cards depend on this value: changing it breaks cards already printed.
 */
export function appUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://reviewwo.divergit.com').replace(/\/$/, '');
}

/** Normalise a mobile number to +<country><number>; bare 10-digit numbers are treated as Indian. Returns '' if invalid. */
export function normalizeMobile(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : '';
  }
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : '';
}

/** Admins are listed by email in the ADMIN_EMAILS env var (comma separated). */
export function isAdminEmail(email) {
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email) && list.includes(String(email).toLowerCase());
}

/** 'active' | 'expired' | 'unpaid'. Plans granted with an end date (e.g. by coupon) expire on their own. */
export function planStatusOf(u) {
  if (u.planStatus !== 'active') return u.planStatus || 'unpaid';
  if (u.planExpiresAt && new Date(u.planExpiresAt).getTime() < Date.now()) return 'expired';
  return 'active';
}

/** Fields that are safe to send to the browser. */
export function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name || '',
    email: u.email || '',
    mobile: u.mobile || '',
    businessName: u.businessName || '',
    category: u.category || '',
    city: u.city || '',
    googlePlaceId: u.googlePlaceId || '',
    alertName: u.alertName || '',
    brandName: u.brandName || '',
    brandColor: u.brandColor || '',
    brandAccent: u.brandAccent || '',
    brandLogo: u.brandLogo || '',
    reviewKeywords: Array.isArray(u.reviewKeywords) ? u.reviewKeywords : [],
    alertMobile: u.alertMobile || '',
    plan: u.plan || 'starter',
    planStatus: planStatusOf(u),
    planSource: u.planSource || '',
    planExpiresAt: u.planExpiresAt || null,
    billingCycle: u.billingCycle || 'monthly',
    cardLimit: CARD_LIMITS[u.plan] || CARD_LIMITS.starter,
    // Accounts created before onboarding existed count as onboarded if they have a Google listing.
    onboardingComplete: u.onboardingComplete === true || (u.onboardingComplete === undefined && Boolean(u.googlePlaceId)),
    isAdmin: isAdminEmail(u.email),
  };
}

/** Returns the signed-in user's stored record, or null. */
export function currentUserRecord(request) {
  const decoded = authenticateRequest(request);
  if (!decoded) return null;
  const users = loadData('users.json', []);
  return users.find((u) => u.id === decoded.id) || null;
}

export const AUTH_COOKIE = 'rw_auth_token';

export function setAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}

export function tokenFor(user) {
  return signToken({ id: user.id, email: user.email });
}

/** Google Place IDs are URL-safe strings, usually starting with "ChIJ". */
export function isValidPlaceId(value) {
  return /^[A-Za-z0-9_-]{20,300}$/.test(String(value || ''));
}

export const PLAN_IDS = ['starter', 'growth', 'agency'];

/** Cards allowed per plan. Keep in sync with PLAN_PRICING in razorpay.js and the pricing page. */
export const CARD_LIMITS = { starter: 1, growth: 5, agency: 25 };

/** Returns the signed-in admin's record, or null when the caller is not an admin. */
export function currentAdmin(request) {
  const user = currentUserRecord(request);
  return user && isAdminEmail(user.email) ? user : null;
}

import crypto from 'crypto';
import { loadData, saveData, PLAN_IDS } from './store.js';

const FILE = 'coupons.json';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

export function normalizeCode(code) {
  return String(code || '').trim().toUpperCase().replace(/\s+/g, '');
}

export function generateCode() {
  let out = '';
  for (let i = 0; i < 8; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `RW-${out}`;
}

export function listCoupons() {
  return loadData(FILE, []);
}

/**
 * Creates a coupon. months = 0 means the plan never expires.
 * maxUses = 0 means unlimited redemptions.
 */
export function createCoupon({ code, plan, months, maxUses, note, createdBy }) {
  const coupons = listCoupons();
  const clean = normalizeCode(code) || generateCode();
  if (!/^[A-Z0-9-]{4,32}$/.test(clean)) throw new Error('Use 4 to 32 letters, numbers or dashes for the code.');
  if (coupons.some((c) => c.code === clean)) throw new Error('A coupon with this code already exists.');
  if (!PLAN_IDS.includes(plan)) throw new Error('Choose a plan.');
  const m = Number(months);
  const u = Number(maxUses);
  if (!Number.isInteger(m) || m < 0 || m > 120) throw new Error('Months must be between 0 and 120.');
  if (!Number.isInteger(u) || u < 0 || u > 10000) throw new Error('Uses must be between 0 and 10,000.');

  const coupon = {
    code: clean,
    plan,
    months: m,
    maxUses: u,
    uses: 0,
    redeemedBy: [],
    note: String(note || '').trim().slice(0, 120),
    active: true,
    createdBy: createdBy || '',
    createdAt: new Date().toISOString(),
  };
  coupons.unshift(coupon);
  saveData(FILE, coupons);
  return coupon;
}

export function setCouponActive(code, active) {
  const coupons = listCoupons();
  const c = coupons.find((x) => x.code === normalizeCode(code));
  if (!c) throw new Error('Coupon not found.');
  c.active = Boolean(active);
  saveData(FILE, coupons);
  return c;
}

/**
 * Applies a coupon to a user record in place (caller saves users.json).
 * Returns the updated coupon. Throws with a user-facing message if it cannot be used.
 */
export function redeemCoupon(userRecord, rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) throw new Error('Enter a coupon code.');
  const coupons = listCoupons();
  const c = coupons.find((x) => x.code === code);
  if (!c || !c.active) throw new Error('This coupon code isn’t valid.');
  if (c.maxUses > 0 && c.uses >= c.maxUses) throw new Error('This coupon has already been used the maximum number of times.');
  if ((c.redeemedBy || []).some((r) => r.userId === userRecord.id)) throw new Error('You’ve already used this coupon.');

  const now = new Date();
  let expires = null;
  if (c.months > 0) {
    expires = new Date(now);
    expires.setMonth(expires.getMonth() + c.months);
  }

  userRecord.plan = c.plan;
  userRecord.planStatus = 'active';
  userRecord.planSource = 'coupon';
  userRecord.planCoupon = c.code;
  userRecord.planExpiresAt = expires ? expires.toISOString() : null;

  c.uses += 1;
  c.redeemedBy = [...(c.redeemedBy || []), { userId: userRecord.id, email: userRecord.email, at: now.toISOString() }];
  saveData(FILE, coupons);
  return c;
}

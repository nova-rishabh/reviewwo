import crypto from 'crypto';
import { loadData, saveData, planStatusOf } from './store.js';

/**
 * Reference codes: admins hand them to salespeople, partners or agencies.
 * A business enters one when signing up (or opens /register?ref=CODE), and the
 * admin panel shows who signed up with which code. They give no discount;
 * discounts are coupons.
 */
const FILE = 'references.json';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

export function normalizeRef(code) {
  return String(code || '').trim().toUpperCase().replace(/\s+/g, '');
}

function generateRef() {
  let out = '';
  for (let i = 0; i < 6; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `REF-${out}`;
}

export function listReferences() {
  return loadData(FILE, []);
}

export function findActiveReference(raw) {
  const code = normalizeRef(raw);
  if (!code) return null;
  return listReferences().find((r) => r.code === code && r.active) || null;
}

export function createReference({ code, owner, contact, note, createdBy }) {
  const refs = listReferences();
  const clean = normalizeRef(code) || generateRef();
  if (!/^[A-Z0-9-]{3,32}$/.test(clean)) throw new Error('Use 3 to 32 letters, numbers or dashes for the code.');
  if (refs.some((r) => r.code === clean)) throw new Error('A reference code with this name already exists.');
  const who = String(owner || '').trim().slice(0, 80);
  if (!who) throw new Error('Enter who this code belongs to.');

  const ref = {
    code: clean,
    owner: who,
    contact: String(contact || '').trim().slice(0, 80),
    note: String(note || '').trim().slice(0, 120),
    active: true,
    createdBy: createdBy || '',
    createdAt: new Date().toISOString(),
  };
  refs.unshift(ref);
  saveData(FILE, refs);
  return ref;
}

export function setReferenceActive(code, active) {
  const refs = listReferences();
  const r = refs.find((x) => x.code === normalizeRef(code));
  if (!r) throw new Error('Reference code not found.');
  r.active = Boolean(active);
  saveData(FILE, refs);
  return r;
}

/** Codes with the businesses that signed up using each one (read live from users.json). */
export function referenceReport() {
  const users = loadData('users.json', []);
  const byCode = new Map();
  for (const u of users) {
    if (!u.referenceCode) continue;
    const list = byCode.get(u.referenceCode) || [];
    list.push({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      mobile: u.mobile || '',
      businessName: u.businessName || '',
      plan: u.plan || 'starter',
      billingCycle: u.billingCycle || 'monthly',
      planStatus: planStatusOf(u),
      planSource: u.planSource || '',
      signedUpAt: u.createdAt || u.referenceAddedAt || null,
    });
    byCode.set(u.referenceCode, list);
  }
  return listReferences().map((r) => {
    const signups = (byCode.get(r.code) || []).sort((a, b) => String(b.signedUpAt).localeCompare(String(a.signedUpAt)));
    return {
      ...r,
      signups,
      total: signups.length,
      paying: signups.filter((s) => s.planStatus === 'active' && s.planSource !== 'coupon').length,
    };
  });
}

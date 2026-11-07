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
    const fullPath = getDataFilePath(filename);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
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

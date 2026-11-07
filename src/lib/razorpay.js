import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret
  });
}

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !signature || !orderId || !paymentId) return false;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  try {
    const a = Buffer.from(generatedSignature, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

export const PLAN_PRICING = {
  starter: {
    name: 'Starter',
    monthlyPrice: 149,
    annualPrice: 1428, // ₹119/mo * 12
    standeesLimit: 1,
    locations: 1
  },
  growth: {
    name: 'Growth',
    monthlyPrice: 299,
    annualPrice: 2868, // ₹239/mo * 12
    standeesLimit: 5,
    locations: 3
  },
  agency: {
    name: 'Agency Partner',
    monthlyPrice: 799,
    annualPrice: 7668, // ₹639/mo * 12
    standeesLimit: 25,
    locations: 25
  }
};

import { NextResponse } from 'next/server';
import { getRazorpayClient, PLAN_PRICING } from '../../../../src/lib/razorpay.js';
import { authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    const body = await request.json();
    const { plan = 'growth', billingCycle = 'monthly', email, name } = body;

    const planConfig = PLAN_PRICING[plan] || PLAN_PRICING.growth;
    const priceInINR = billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;
    const amountInPaise = priceInINR * 100;

    const razorpay = getRazorpayClient();

    // If Razorpay keys are not yet configured in env, provide clear response
    if (!razorpay) {
      return NextResponse.json({
        success: false,
        isConfigured: false,
        error: 'Razorpay keys not configured on server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment or Render dashboard.',
        amount: priceInINR,
        plan: planConfig.name,
        requiresKeys: true
      }, { status: 400 });
    }

    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rw_sub_${Date.now()}`,
      notes: {
        plan: planConfig.name,
        billingCycle,
        userId: user ? user.id : 'guest',
        userEmail: user ? user.email : (email || 'unregistered')
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      isConfigured: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: planConfig.name,
      billingCycle,
      prefill: {
        name: user ? user.name : (name || ''),
        email: user ? user.email : (email || ''),
        contact: user ? user.mobile : ''
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

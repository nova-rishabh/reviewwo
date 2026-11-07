import { NextResponse } from 'next/server';
import { getRazorpayClient, PLAN_PRICING } from '../../../../src/lib/razorpay.js';
import { currentUserRecord } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in to subscribe.' }, { status: 401 });

  try {
    const body = await request.json();
    const planId = PLAN_PRICING[body.plan] ? body.plan : null;
    if (!planId) return NextResponse.json({ error: 'Choose a plan.' }, { status: 400 });
    const billingCycle = body.billingCycle === 'annual' ? 'annual' : 'monthly';
    const plan = PLAN_PRICING[planId];
    const amountInr = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Online payments are not set up yet. Please contact us to subscribe.', requiresKeys: true },
        { status: 503 }
      );
    }

    // Plan, cycle and user are stored on the order so verification never trusts the browser.
    const order = await razorpay.orders.create({
      amount: amountInr * 100,
      currency: 'INR',
      receipt: `rw_${Date.now()}`,
      notes: { planId, billingCycle, userId: user.id },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: plan.name,
      billingCycle,
      prefill: { name: user.name || '', email: user.email || '', contact: user.mobile || '' },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 });
  }
}

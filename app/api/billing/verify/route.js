import { NextResponse } from 'next/server';
import { getRazorpayClient, verifyPaymentSignature, PLAN_PRICING } from '../../../../src/lib/razorpay.js';
import { loadData, saveData, currentUserRecord } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = currentUserRecord(request);
  if (!user) return NextResponse.json({ error: 'Sign in again to finish your payment.' }, { status: 401 });

  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } =
      await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Payment details are missing.' }, { status: 400 });
    }
    if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
      return NextResponse.json({ error: 'We could not verify this payment.' }, { status: 400 });
    }

    const payments = loadData('payments.json', []);
    if (payments.some((p) => p.paymentId === paymentId)) {
      return NextResponse.json({ success: true, message: 'This payment was already applied to your account.' });
    }

    // Read plan details from the order itself, not from the request.
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.fetch(orderId);
    const planId = order?.notes?.planId;
    const billingCycle = order?.notes?.billingCycle === 'annual' ? 'annual' : 'monthly';
    const plan = PLAN_PRICING[planId];
    if (!plan || order?.notes?.userId !== user.id) {
      return NextResponse.json({ error: 'This payment does not belong to your account.' }, { status: 400 });
    }

    const amountInr = Number(order.amount) / 100;
    const now = new Date().toISOString();
    payments.unshift({
      id: `pay_${Date.now()}`,
      orderId,
      paymentId,
      amount: amountInr,
      currency: order.currency,
      planId,
      billingCycle,
      userId: user.id,
      createdAt: now,
    });
    saveData('payments.json', payments);

    const users = loadData('users.json', []);
    const record = users.find((u) => u.id === user.id);
    if (record) {
      record.plan = planId;
      record.billingCycle = billingCycle;
      record.planStatus = 'active';
      record.lastPaymentDate = now;
      record.planPrice = billingCycle === 'annual' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
      saveData('users.json', users);
    }

    return NextResponse.json({ success: true, message: `You’re now on the ${plan.name} plan.` });
  } catch (err) {
    return NextResponse.json({ error: 'We could not confirm your payment. Contact us if you were charged.' }, { status: 500 });
  }
}

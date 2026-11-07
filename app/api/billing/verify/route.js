import { NextResponse } from 'next/server';
import { verifyPaymentSignature, PLAN_PRICING } from '../../../../src/lib/razorpay.js';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = 'growth',
      billingCycle = 'monthly'
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification parameters.' }, { status: 400 });
    }

    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Razorpay signature. Verification failed.' }, { status: 400 });
    }

    // Save payment log
    const payments = loadData('payments.json', []);
    const planConfig = PLAN_PRICING[plan] || PLAN_PRICING.growth;
    const paymentRecord = {
      id: `pay_${Date.now()}`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice,
      currency: 'INR',
      plan: planConfig.name,
      planId: plan,
      billingCycle,
      userId: user ? user.id : 'unregistered',
      userEmail: user ? user.email : '',
      timestamp: new Date().toISOString(),
      status: 'captured'
    };
    payments.unshift(paymentRecord);
    saveData('payments.json', payments);

    // Update user subscription if logged in
    if (user) {
      const users = loadData('users.json', []);
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].plan = plan;
        users[userIndex].planPrice = paymentRecord.amount;
        users[userIndex].planStatus = 'active';
        users[userIndex].billingCycle = billingCycle;
        users[userIndex].lastPaymentDate = paymentRecord.timestamp;
        saveData('users.json', users);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment verified! You are now subscribed to Reviewwo ${planConfig.name} plan.`,
      payment: paymentRecord
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

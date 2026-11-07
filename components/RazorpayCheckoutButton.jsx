'use client';

import { useState } from 'react';

export default function RazorpayCheckoutButton({
  plan = 'growth',
  billingCycle = 'monthly',
  className = '',
  children,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle })
      });

      const orderData = await res.json();

      if (!res.ok) {
        if (orderData.requiresKeys) {
          alert('Razorpay Payment Gateway Setup Required:\n\n' + orderData.error);
        } else {
          alert('Error initiating checkout: ' + (orderData.error || 'Unknown error'));
        }
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Reviewwo Enterprise',
        description: `Subscription: ${orderData.plan} (${orderData.billingCycle})`,
        image: '/assets/img/logos/icon-dark.png',
        order_id: orderData.orderId,
        prefill: orderData.prefill || {},
        theme: {
          color: '#0B3D3B'
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                billingCycle
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert('🎉 Payment Successful! ' + verifyData.message);
              if (onSuccess) onSuccess(verifyData);
              else window.location.href = '/dashboard';
            } else {
              alert('Payment Verification Failed: ' + verifyData.error);
            }
          } catch (e) {
            alert('Verification network error: ' + e.message);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();
    } catch (err) {
      alert('Checkout error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={className || "w-full py-3 px-4 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"}
    >
      {loading ? 'Initializing Razorpay...' : (children || 'Pay with UPI / Cards →')}
    </button>
  );
}

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function loadScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function RazorpayCheckoutButton({ plan, billingCycle = 'monthly', className = 'btn btn-primary', children, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setError('');
    setLoading(true);
    try {
      if (!(await loadScript())) throw new Error('The payment window could not load. Check your connection and try again.');

      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle }),
      });
      const order = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!res.ok) throw new Error(order.error || 'Could not start the payment.');

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Reviewwo',
        description: `${order.plan} plan, ${order.billingCycle === 'annual' ? 'yearly' : 'monthly'}`,
        image: '/assets/img/logos/icon-dark.png',
        order_id: order.orderId,
        prefill: order.prefill || {},
        theme: { color: '#0B3D3B' },
        handler: async (response) => {
          try {
            const v = await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const data = await v.json().catch(() => ({}));
            if (!v.ok) throw new Error(data.error || 'We could not confirm your payment.');
            if (onSuccess) onSuccess(data);
            else window.location.assign('/dashboard/settings#plan');
          } catch (err) {
            setError(err.message);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', (r) => setError(r?.error?.description || 'The payment failed. No money was taken.'));
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button type="button" onClick={start} disabled={loading} className={className}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children || 'Subscribe'}
      </button>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
    </div>
  );
}

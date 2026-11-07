'use client';

function handleUnauthorized() {
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.assign(`/login?redirect=${next}`);
  }
}

async function request(url, options) {
  const res = await fetch(url, { cache: 'no-store', ...options });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Your session has ended. Sign in again.');
  }
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.fields = data.fields || {};
    err.status = res.status;
    throw err;
  }
  return data;
}

export const apiGet = (url) => request(url);

export const apiPost = (url, body) =>
  request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });

export const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cafe', label: 'Café or bakery' },
  { id: 'salon', label: 'Salon or spa' },
  { id: 'clinic', label: 'Clinic or doctor' },
  { id: 'retail', label: 'Shop or showroom' },
  { id: 'hotel', label: 'Hotel or stay' },
  { id: 'gym', label: 'Gym or studio' },
  { id: 'other', label: 'Something else' },
];

export function googleReviewUrl(placeId) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export const PLACE_ID_FINDER_URL =
  'https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder';

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadText(text, filename, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

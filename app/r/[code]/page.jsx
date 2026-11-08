'use client';

import { use, useEffect, useRef, useState } from 'react';
import { Star, Check, Loader2 } from 'lucide-react';

const TAGS = {
  restaurant: ['Tasty food', 'Friendly staff', 'Quick service', 'Good portions', 'Nice ambience', 'Good value'],
  cafe: ['Great coffee', 'Friendly staff', 'Cosy place', 'Quick service', 'Tasty snacks', 'Good value'],
  salon: ['Great result', 'Friendly staff', 'Clean and hygienic', 'On time', 'Relaxing', 'Good value'],
  clinic: ['Caring doctor', 'Clear explanation', 'Short wait', 'Clean clinic', 'Helpful staff'],
  retail: ['Good range', 'Helpful staff', 'Fair prices', 'Quick billing', 'Easy to find things'],
  hotel: ['Clean room', 'Helpful staff', 'Comfortable stay', 'Good location', 'Good breakfast'],
  gym: ['Good equipment', 'Helpful trainers', 'Clean space', 'Not crowded', 'Good value'],
  other: ['Friendly staff', 'Quick service', 'Good quality', 'Good value', 'Would come back'],
};

const RATING_WORDS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'];

function joinTags(tags) {
  if (!tags.length) return '';
  const lower = tags.map((t, i) => (i === 0 ? t : t.charAt(0).toLowerCase() + t.slice(1)));
  const text = lower.length === 1 ? lower[0] : `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
  return `${text}.`;
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

function RatingPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Your rating" className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} of 5 – ${RATING_WORDS[n]}`}
          onClick={() => onChange(n)}
          className="rounded-lg p-1.5 transition-transform active:scale-90"
        >
          <Star className={`h-10 w-10 ${n <= value ? 'fill-marigold text-marigold' : 'text-line'}`} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

function GoogleReview({ business, demo, rating, primary }) {
  const tags = TAGS[business.category] || TAGS.other;
  const [picked, setPicked] = useState([]);
  const [text, setText] = useState('');
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggle = (t) => {
    const next = picked.includes(t) ? picked.filter((x) => x !== t) : [...picked, t];
    setPicked(next);
    if (!edited) setText(joinTags(next));
  };

  const href = business.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(business.placeId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.city}`)}`;

  const onOpen = async (e) => {
    if (demo) {
      e.preventDefault();
      setCopied(true);
      return;
    }
    if (text.trim()) {
      const ok = await copyText(text.trim());
      setCopied(ok);
    }
  };

  return (
    <section className="space-y-4">
      {primary && rating >= 4 && (
        <div>
          <p className="text-[15px] font-medium text-ink">What stood out? (optional)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => {
              const on = picked.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(t)}
                  className={`h-9 rounded-full px-3.5 text-sm font-medium transition-colors ${
                    on ? 'bg-brand-800 text-white' : 'border border-line bg-white text-ink'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="review-text" className="text-[15px] font-medium text-ink">
          Your review
        </label>
        <textarea
          id="review-text"
          rows={4}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setEdited(true);
          }}
          placeholder="Write a few words about your visit"
          className="input mt-2 text-[15px]"
        />
        <p className="mt-1.5 text-[13px] text-ink-subtle">
          We’ll copy this for you. On Google, choose your stars, paste it in and post.
        </p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onOpen}
        className={`btn btn-lg w-full ${primary ? 'btn-primary' : 'btn-secondary'}`}
      >
        {text.trim() ? 'Copy and open Google reviews' : 'Open Google reviews'}
      </a>
      {copied && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-800" role="status">
          <Check className="h-4 w-4" aria-hidden="true" />
          {demo ? 'This is a demo, so Google isn’t opened.' : 'Copied. Paste it into the review box on Google.'}
        </p>
      )}
    </section>
  );
}

function ManagerMessage({ code, rating, businessName, demo, primary }) {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setState('sending');
    try {
      const res = await fetch('/api/shield/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rating, feedback, name, contact }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Your message could not be sent. Please try again.');
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900" role="status">
        <p className="font-semibold">Thanks, your message has been sent to the manager.</p>
        <p className="mt-1 text-[15px]">
          {demo ? 'This is a demo, so nothing was actually sent.' : contact ? 'They may get in touch with you.' : 'They will read it shortly.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h2 className="font-sans text-lg font-semibold text-ink">
          {primary ? 'Tell the manager what happened' : 'Or send a private message to the manager'}
        </h2>
        <p className="mt-1 text-[15px] text-ink-muted">
          This goes straight to the manager at {businessName}. It is not posted publicly.
        </p>
      </div>
      <div>
        <label htmlFor="fb" className="label">Your message</label>
        <textarea id="fb" required rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} className="input text-[15px]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="label">Name (optional)</label>
          <input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="fb-contact" className="label">Phone (optional)</label>
          <input id="fb-contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className="input" autoComplete="tel" />
        </div>
      </div>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className={`btn btn-lg w-full ${primary ? 'btn-primary' : 'btn-secondary'}`}>
        {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Send to the manager
      </button>
    </form>
  );
}

export default function ReviewPage({ params }) {
  const { code } = use(params);
  const [status, setStatus] = useState('loading');
  const [business, setBusiness] = useState(null);
  const [demo, setDemo] = useState(false);
  const [rating, setRating] = useState(0);
  const [showPrivate, setShowPrivate] = useState(false);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    let scan = '1';
    try {
      const key = `rw_scan_${code}`;
      if (sessionStorage.getItem(key)) scan = '0';
      else sessionStorage.setItem(key, '1');
    } catch (e) {
      // storage unavailable: still count the visit
    }
    fetch(`/api/standees/resolve?code=${encodeURIComponent(code)}&scan=${scan}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.found) {
          setBusiness(d.business);
          setDemo(Boolean(d.demo));
          setStatus('ready');
        } else setStatus('missing');
      })
      .catch(() => setStatus('error'));
  }, [code]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-white" aria-busy="true" />;
  }

  if (status !== 'ready') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-2xl font-bold">{status === 'missing' ? 'This code isn’t set up yet' : 'Something went wrong'}</h1>
          <p className="mt-2 text-ink-muted">
            {status === 'missing'
              ? 'Please let a member of staff know. Thank you for wanting to leave a review.'
              : 'Check your connection and try scanning again.'}
          </p>
        </div>
      </main>
    );
  }

  const low = rating > 0 && rating <= 3;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {demo && (
        <div className="bg-brand-800 px-4 py-2 text-center text-[13px] text-white">
          Demo page. Nothing you enter here is sent or posted.
        </div>
      )}
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-12 pt-10">
        <header className="text-center">
          <p className="text-sm text-ink-subtle">{business.city || 'Thanks for visiting'}</p>
          <h1 className="mt-1 text-[1.75rem] font-bold leading-tight">{business.name}</h1>
        </header>

        <section className="mt-8 text-center">
          <p className="text-lg font-medium text-ink">How was your visit?</p>
          <div className="mt-3">
            <RatingPicker
              value={rating}
              onChange={(n) => {
                setRating(n);
                setShowPrivate(false);
              }}
            />
          </div>
          <p className="mt-1 h-6 text-[15px] text-ink-muted" aria-live="polite">
            {RATING_WORDS[rating]}
          </p>
        </section>

        {rating > 0 && (
          <div className="mt-6 space-y-8">
            {low ? (
              <>
                <ManagerMessage code={code} rating={rating} businessName={business.name} demo={demo} primary />
                <div className="border-t border-line pt-6">
                  <h2 className="font-sans text-lg font-semibold text-ink">Want to leave a Google review too?</h2>
                  <p className="mb-4 mt-1 text-[15px] text-ink-muted">You can post your review publicly on Google as well.</p>
                  <GoogleReview business={business} demo={demo} rating={rating} primary={false} />
                </div>
              </>
            ) : (
              <>
                <GoogleReview business={business} demo={demo} rating={rating} primary />
                <div className="border-t border-line pt-6">
                  {showPrivate ? (
                    <ManagerMessage code={code} rating={rating} businessName={business.name} demo={demo} primary={false} />
                  ) : (
                    <button type="button" onClick={() => setShowPrivate(true)} className="link text-[15px]">
                      Something we could do better? Message the manager
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <footer className="pb-6 text-center text-xs text-ink-subtle">
        Review page by Reviewwo. Google is a trademark of Google LLC.
      </footer>
    </div>
  );
}

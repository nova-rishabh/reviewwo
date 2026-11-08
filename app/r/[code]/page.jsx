'use client';

import { use, useEffect, useRef, useState } from 'react';
import { Star, Check, Loader2, Sparkles } from 'lucide-react';
import { textOn, DEFAULT_BRAND_COLOR, DEFAULT_ACCENT_COLOR } from '../../../src/lib/branding';

const RATING_WORDS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'];

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

/** Solid button in the business's own colour. */
function brandButton(color) {
  return { background: color, color: textOn(color), borderColor: color };
}

function RatingPicker({ value, onChange, accent }) {
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
          <Star
            className="h-10 w-10"
            style={n <= value ? { color: accent, fill: accent } : { color: '#DCE3E1' }}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewComposer({ code, business, demo, rating, primary }) {
  const [picked, setPicked] = useState([]);
  const [text, setText] = useState('');
  const [ai, setAi] = useState({ state: 'idle', error: '' });
  const [copied, setCopied] = useState(false);
  const color = business.color;

  const toggle = (t) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const useAi = async () => {
    setAi({ state: 'writing', error: '' });
    try {
      const res = await fetch('/api/reviews/generate-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rating, keywords: picked, notes: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That didn’t work. Please try again.');
      if (data.text) setText(data.text);
      setAi({ state: 'done', error: '' });
    } catch (err) {
      setAi({ state: 'idle', error: err.message });
    }
  };

  const href = business.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(business.placeId)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.city}`)}`;

  const onPost = async (e) => {
    if (demo) {
      e.preventDefault();
      setCopied(true);
      return;
    }
    if (text.trim()) setCopied(await copyText(text.trim()));
  };

  const canWrite = picked.length > 0 || text.trim().length > 0;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[15px] font-medium text-ink">{rating >= 4 ? 'What did you like?' : 'What stood out?'}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {business.keywords.map((t) => {
            const on = picked.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t)}
                style={on ? brandButton(color) : undefined}
                className={`inline-flex h-9 items-center gap-1 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  on ? '' : 'border-line bg-white text-ink'
                }`}
              >
                {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="review-text" className="text-[15px] font-medium text-ink">
            Your review
          </label>
          <button
            type="button"
            onClick={useAi}
            disabled={!canWrite || ai.state === 'writing'}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ borderColor: color, color }}
          >
            {ai.state === 'writing' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            {ai.state === 'writing' ? 'Writing…' : ai.state === 'done' ? 'Try again' : 'Use AI'}
          </button>
        </div>
        <textarea
          id="review-text"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tap a few highlights above and press Use AI, or write a few words yourself."
          className="input mt-2 text-[15px]"
          aria-describedby="review-help"
        />
        <p id="review-help" className="mt-1.5 text-[13px] text-ink-subtle" aria-live="polite">
          {ai.error ? (
            <span className="text-red-700">{ai.error}</span>
          ) : ai.state === 'done' ? (
            'Read it over and change anything you like. It’s your review.'
          ) : (
            'You can edit the text before posting.'
          )}
        </p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onPost}
        style={primary ? brandButton(color) : undefined}
        className={`btn btn-lg w-full ${primary ? '' : 'btn-secondary'}`}
      >
        {text.trim() ? 'Copy and post review' : 'Post review'}
      </a>
      {copied ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-sm text-emerald-800" role="status">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          {demo ? 'This is a demo, so nothing is posted.' : 'Copied. Choose your stars, paste it in and tap Post.'}
        </p>
      ) : (
        text.trim() && (
          <p className="text-center text-[13px] text-ink-subtle">
            We’ll copy your review. On the next page, choose your stars, paste it in and tap Post.
          </p>
        )
      )}
    </section>
  );
}

function FeedbackForm({ code, rating, business, demo, primary }) {
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
      if (!res.ok) throw new Error(data.error || 'That didn’t go through. Please try again.');
      setState('sent');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900" role="status">
        <p className="font-semibold">Thank you for your feedback.</p>
        <p className="mt-1 text-[15px]">
          {demo ? 'This is a demo, so nothing was actually sent.' : contact ? 'We may get in touch with you.' : 'We read every message.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <h2 className="font-sans text-lg font-semibold text-ink">
          {primary ? 'What could we do better?' : 'Tell us privately'}
        </h2>
        <p className="mt-1 text-[15px] text-ink-muted">Shared privately with our team.</p>
      </div>
      <div>
        <label htmlFor="fb" className="label">Your feedback</label>
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
      <button
        type="submit"
        disabled={state === 'sending'}
        style={primary ? brandButton(business.color) : undefined}
        className={`btn btn-lg w-full ${primary ? '' : 'btn-secondary'}`}
      >
        {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Send feedback
      </button>
    </form>
  );
}

function PoweredBy() {
  return (
    <footer className="pb-6 text-center text-xs text-ink-subtle">
      Powered by{' '}
      <a href="/" target="_blank" rel="noreferrer" className="font-semibold text-ink-muted hover:underline">
        Reviewwo
      </a>
    </footer>
  );
}

export default function ReviewPage({ params }) {
  const { code } = use(params);
  const [status, setStatus] = useState('loading');
  const [business, setBusiness] = useState(null);
  const [demo, setDemo] = useState(false);
  const [rating, setRating] = useState(0);
  const [showAlt, setShowAlt] = useState(false);
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
          setBusiness({
            ...d.business,
            color: d.business.color || DEFAULT_BRAND_COLOR,
            accent: d.business.accent || DEFAULT_ACCENT_COLOR,
            keywords: d.business.keywords || [],
          });
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
      <div className="flex min-h-screen flex-col bg-white">
        <main className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-sm">
            <h1 className="text-2xl font-bold">{status === 'missing' ? 'This code isn’t set up yet' : 'Something went wrong'}</h1>
            <p className="mt-2 text-ink-muted">
              {status === 'missing'
                ? 'Please let a member of staff know. Thank you for wanting to leave a review.'
                : 'Check your connection and try scanning again.'}
            </p>
          </div>
        </main>
        <PoweredBy />
      </div>
    );
  }

  const low = rating > 0 && rating <= 3;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {demo && (
        <div className="px-4 py-2 text-center text-[13px]" style={brandButton(business.color)}>
          Demo page. Nothing you enter here is sent or posted.
        </div>
      )}
      <div className="h-1.5 w-full" style={{ background: business.color }} aria-hidden="true" />
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-12 pt-8">
        <header className="text-center">
          {business.logo && (
            <img src={business.logo} alt="" className="mx-auto mb-3 h-16 w-16 rounded-xl object-contain" />
          )}
          <h1 className="text-[1.75rem] font-bold leading-tight">{business.name}</h1>
          {business.city && <p className="mt-1 text-sm text-ink-subtle">{business.city}</p>}
        </header>

        <section className="mt-8 text-center">
          <p className="text-lg font-medium text-ink">How was your visit?</p>
          <div className="mt-3">
            <RatingPicker
              value={rating}
              accent={business.accent}
              onChange={(n) => {
                setRating(n);
                setShowAlt(false);
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
                <FeedbackForm code={code} rating={rating} business={business} demo={demo} primary />
                <div className="border-t border-line pt-6">
                  {showAlt ? (
                    <ReviewComposer code={code} business={business} demo={demo} rating={rating} primary={false} />
                  ) : (
                    <button type="button" onClick={() => setShowAlt(true)} className="text-[15px] font-semibold text-ink-muted underline-offset-2 hover:underline">
                      Want to post a public review instead?
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <ReviewComposer code={code} business={business} demo={demo} rating={rating} primary />
                <div className="border-t border-line pt-6">
                  {showAlt ? (
                    <FeedbackForm code={code} rating={rating} business={business} demo={demo} primary={false} />
                  ) : (
                    <button type="button" onClick={() => setShowAlt(true)} className="text-[15px] font-semibold text-ink-muted underline-offset-2 hover:underline">
                      Anything we could do better? Tell us privately
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <PoweredBy />
    </div>
  );
}

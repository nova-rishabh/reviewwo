'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

/**
 * Homepage launch film. Loads nothing until it scrolls near the viewport, then plays
 * muted on a loop (browsers only allow muted autoplay). Visitors can turn the sound on.
 * With "reduce motion" switched on it waits for a tap instead of autoplaying.
 */
export default function LaunchVideo({ src, poster, title }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setReduced(Boolean(reduce));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute('src')) {
            v.setAttribute('src', src);
            v.load();
          }
          if (!reduce) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const start = () => {
    const v = ref.current;
    if (!v) return;
    if (!v.getAttribute('src')) {
      v.setAttribute('src', src);
      v.load();
    }
    v.play().catch(() => {});
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-canvas shadow-pop">
      <video
        ref={ref}
        className="block aspect-video w-full"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {reduced && !playing && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 flex items-center justify-center bg-ink/10"
          aria-label={`Play: ${title}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-800 text-white">
            <Play className="h-7 w-7 translate-x-0.5" aria-hidden="true" />
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-2 right-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-ink/80 px-3 text-xs font-semibold text-white backdrop-blur hover:bg-ink sm:bottom-3 sm:right-3 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
        {muted ? 'Sound on' : 'Sound off'}
      </button>
    </div>
  );
}

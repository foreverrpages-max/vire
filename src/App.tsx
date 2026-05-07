import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GhostCursor } from './GhostCursor';
import { thoughts, Thought } from './thoughts';
import { generateThoughtCard } from './card';

// ─── CONFIGURE THESE BEFORE DEPLOYING ───────────────────────────────
const INSTAGRAM_HANDLE = 'your_instagram_handle';   // e.g. 'nachiket' (without the @)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // free signup at formspree.io
// ────────────────────────────────────────────────────────────────────

function pickNext(prevIdx: number, total: number) {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  if (next === prevIdx) next = (next + 1) % total;
  return next;
}

const App: React.FC = () => {
  const [idx, setIdx] = useState<number>(() => Math.floor(Math.random() * thoughts.length));
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [now, setNow] = useState<Date>(new Date());
  const [showCardModal, setShowCardModal] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [guestStatus, setGuestStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const current: Thought = thoughts[idx];

  const advance = useCallback(() => {
    setPhase('out');
    window.setTimeout(() => {
      setIdx(prev => pickNext(prev, thoughts.length));
      setPhase('in');
    }, 420);
  }, []);

  const stop = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  // Keyboard support — only when no modal is open and not typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (showCardModal || showGuestbook) {
        if (e.key === 'Escape') {
          setShowCardModal(false);
          setShowGuestbook(false);
        }
        return;
      }
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, showCardModal, showGuestbook]);

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 5) return 'late night';
    if (h < 12) return 'good morning';
    if (h < 17) return 'good afternoon';
    if (h < 21) return 'good evening';
    return 'good night';
  }, [now]);

  const trailColor = useMemo(() => {
    const palette = ['#B19EEF', '#9EC5EF', '#EFB19E', '#9EEFC5', '#EF9EC5', '#C5EF9E'];
    return palette[idx % palette.length];
  }, [idx]);

  const handleGenerateCard = useCallback(async () => {
    const dataUrl = await generateThoughtCard({
      kicker: current.kicker,
      line: current.line,
      name: cardName.trim(),
      curator: 'Nachiket',
      domain: 'vire',
      accent: trailColor,
    });
    setCardDataUrl(dataUrl);
  }, [current, cardName, trailColor]);

  const handleDownload = () => {
    if (!cardDataUrl) return;
    const a = document.createElement('a');
    a.href = cardDataUrl;
    a.download = `vire-${cardName.trim().toLowerCase().replace(/\s+/g, '-') || 'thought'}.png`;
    a.click();
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestNote.trim()) return;
    setGuestStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: guestName.trim() || 'anonymous',
          note: guestNote.trim(),
          thought_kicker: current.kicker,
          thought_line: current.line,
          time: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setGuestStatus('sent');
        setTimeout(() => {
          setShowGuestbook(false);
          setGuestStatus('idle');
          setGuestName('');
          setGuestNote('');
        }, 1800);
      } else {
        setGuestStatus('error');
      }
    } catch {
      setGuestStatus('error');
    }
  };

  return (
    <main
      onClick={advance}
      className="vire-root"
      role="button"
      tabIndex={0}
      aria-label="Tap anywhere for a new thought"
    >
      <GhostCursor
        color={trailColor}
        brightness={1.15}
        edgeIntensity={0}
        trailLength={20}
        inertia={0.4}
        grainIntensity={0.04}
        bloomStrength={0.55}
        bloomRadius={0.8}
        bloomThreshold={0}
        fadeDelayMs={220}
        fadeDurationMs={1100}
        zIndex={1}
      />

      <div className="vire-aurora" aria-hidden />
      <div className="vire-vignette" aria-hidden />

      <header className="vire-top">
        <span className="vire-mark">vire</span>
        <span className="vire-greeting">{greeting}</span>
      </header>

      <section className={`vire-stage ${phase === 'out' ? 'is-out' : 'is-in'}`}>
        <p className="vire-kicker">{current.kicker}</p>
        <p className="vire-line">{current.line}</p>

        <div className="vire-actions" onClick={stop} onTouchEnd={stop}>
          <button
            className="vire-chip"
            onClick={(e) => { e.stopPropagation(); setShowCardModal(true); setCardDataUrl(null); }}
            aria-label="Save this thought as a card"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            keep this one
          </button>
          <button
            className="vire-chip vire-chip-soft"
            onClick={(e) => { e.stopPropagation(); setShowGuestbook(true); }}
            aria-label="Leave a note for Nachiket"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            leave a note
          </button>
        </div>
      </section>

      <footer className="vire-bottom" onClick={stop}>
        <div className="vire-bottom-left">
          <span className="vire-hint">tap anywhere · for another</span>
        </div>
        <div className="vire-bottom-right">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="vire-signature"
            onClick={stop}
          >
            curated by <span className="vire-signature-name">Nachiket</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17L17 7M9 7h8v8"/>
            </svg>
          </a>
        </div>
      </footer>

      {/* Keepsake card modal */}
      {showCardModal && (
        <div className="vire-modal" onClick={(e) => { e.stopPropagation(); setShowCardModal(false); }}>
          <div className="vire-modal-card" onClick={stop}>
            <button className="vire-close" onClick={() => setShowCardModal(false)} aria-label="Close">×</button>
            <p className="vire-modal-eyebrow">a small keepsake</p>
            <h2 className="vire-modal-title">Save this thought</h2>
            <p className="vire-modal-sub">
              Add your name to make it yours. Share it on your story and tag <strong>@{INSTAGRAM_HANDLE}</strong> — I love seeing which ones land.
            </p>

            <input
              type="text"
              placeholder="your name (optional)"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              maxLength={28}
              className="vire-input"
            />

            {!cardDataUrl ? (
              <button className="vire-primary" onClick={handleGenerateCard}>
                generate my card
              </button>
            ) : (
              <>
                <img src={cardDataUrl} alt="Your thought card" className="vire-preview" />
                <div className="vire-modal-row">
                  <button className="vire-primary" onClick={handleDownload}>download</button>
                  <button className="vire-secondary" onClick={() => setCardDataUrl(null)}>regenerate</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Guestbook modal */}
      {showGuestbook && (
        <div className="vire-modal" onClick={(e) => { e.stopPropagation(); setShowGuestbook(false); }}>
          <div className="vire-modal-card" onClick={stop}>
            <button className="vire-close" onClick={() => setShowGuestbook(false)} aria-label="Close">×</button>
            <p className="vire-modal-eyebrow">leave a note</p>
            <h2 className="vire-modal-title">Tell Nachiket which one stayed with you</h2>
            <p className="vire-modal-sub">A line is enough. Even just "the trees one." It goes straight to my inbox.</p>

            {guestStatus === 'sent' ? (
              <div className="vire-sent">
                <p className="vire-sent-title">received ·</p>
                <p className="vire-sent-sub">thank you for the note. it means more than you'd think.</p>
              </div>
            ) : (
              <form onSubmit={handleGuestSubmit} className="vire-form">
                <input
                  type="text"
                  placeholder="your name (optional)"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  maxLength={40}
                  className="vire-input"
                />
                <textarea
                  placeholder="which thought stayed with you?"
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  maxLength={300}
                  rows={3}
                  required
                  className="vire-textarea"
                />
                <button
                  type="submit"
                  className="vire-primary"
                  disabled={guestStatus === 'sending' || !guestNote.trim()}
                >
                  {guestStatus === 'sending' ? 'sending…' : guestStatus === 'error' ? 'try again' : 'send'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;

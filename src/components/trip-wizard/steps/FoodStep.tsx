'use client';

import React, { useState, useCallback } from 'react';

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const FOOD_OPTIONS = [
  {
    id: 'veg',
    emoji: '🥬',
    title: 'Veg',
    description: 'Pure vegetarian cuisine',
  },
  {
    id: 'jain',
    emoji: '🙏',
    title: 'Jain',
    description: 'Jain-friendly, no root vegetables',
  },
  {
    id: 'non-veg',
    emoji: '🍗',
    title: 'Non Veg',
    description: 'All cuisines including meat',
  },
  {
    id: 'seafood',
    emoji: '🦐',
    title: 'Seafood',
    description: 'Fresh seafood specialties',
  },
  {
    id: 'vegan',
    emoji: '🥑',
    title: 'Vegan',
    description: 'Plant-based only',
  },
  {
    id: 'intercontinental',
    emoji: '🌍',
    title: 'Intercontinental',
    description: 'Global flavors',
  },
] as const;

export function FoodStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const selected: string[] = data?.foodPreference ?? [];
  const [pulseId, setPulseId] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => {
      setPulseId(id);
      setTimeout(() => setPulseId(null), 350);

      const next = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
      onUpdate('foodPreference', next);
    },
    [selected, onUpdate],
  );

  const canContinue = selected.length >= 1;

  return (
    <div style={styles.wrapper}>
      {/* -------- Header -------- */}
      <div style={styles.header}>
        <h1 style={styles.heading}>What do you like to eat?</h1>
        <p style={styles.subtitle}>
          We'll recommend restaurants matching your taste
        </p>
      </div>

      {/* -------- Food Cards Grid -------- */}
      <div style={styles.grid}>
        {FOOD_OPTIONS.map(({ id, emoji, title, description }, idx) => {
          const isSelected = selected.includes(id);
          const isPulse = pulseId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : styles.cardDefault),
                transform: isPulse
                  ? 'scale(1.04)'
                  : isSelected
                    ? 'scale(1.01)'
                    : 'scale(1)',
                animationDelay: `${idx * 60}ms`,
              }}
              aria-pressed={isSelected}
            >
              {/* Checkmark badge */}
              <span
                style={{
                  ...styles.check,
                  ...(isSelected ? styles.checkVisible : styles.checkHidden),
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>

              <span style={styles.emoji}>{emoji}</span>
              <span style={styles.title}>{title}</span>
              <span
                style={{
                  ...styles.desc,
                  color: isSelected ? '#0F766E' : '#94A3B8',
                }}
              >
                {description}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------- Actions -------- */}
      <div style={styles.actions}>
        <button type="button" onClick={onBack} style={styles.backBtn}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          style={{
            ...styles.continueBtn,
            opacity: canContinue ? 1 : 0.45,
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          Continue
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      {/* -------- Scoped keyframes -------- */}
      <style>{`
        @keyframes foodFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes foodCardIn {
          from { opacity: 0; transform: translateY(16px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    maxWidth: 620,
    margin: '0 auto',
    padding: '48px 20px 32px',
    animation: 'foodFadeUp .55s cubic-bezier(.16,1,.3,1) both',
  },

  /* Header */
  header: { textAlign: 'center' },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
    letterSpacing: '-0.02em',
    fontFamily: 'system-ui, Inter, sans-serif',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    fontFamily: 'system-ui, Inter, sans-serif',
  },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 14,
  },

  /* Card – shared */
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '28px 20px 22px',
    borderRadius: 16,
    border: '2px solid transparent',
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    fontFamily: 'system-ui, Inter, sans-serif',
    transition:
      'transform .28s cubic-bezier(.34,1.56,.64,1), background .22s ease, border-color .22s ease, box-shadow .22s ease',
    animation: 'foodCardIn .5s cubic-bezier(.16,1,.3,1) both',
  },
  cardDefault: {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderColor: 'rgba(0,0,0,0.06)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  cardSelected: {
    background: 'rgba(14,165,164,0.08)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderColor: '#0EA5A4',
    boxShadow: '0 4px 24px rgba(14,165,164,0.18)',
  },

  /* Checkmark */
  check: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity .25s ease, transform .3s cubic-bezier(.34,1.56,.64,1)',
  },
  checkVisible: {
    background: '#0EA5A4',
    color: '#0F172A',
    opacity: 1,
    transform: 'scale(1)',
  },
  checkHidden: {
    background: 'transparent',
    color: 'transparent',
    opacity: 0,
    transform: 'scale(0.5)',
  },

  emoji: { fontSize: 36, lineHeight: 1 },
  title: {
    fontSize: 17,
    fontWeight: 600,
    color: '#0F172A',
    marginTop: 4,
  },
  desc: {
    fontSize: 13,
    fontWeight: 400,
    textAlign: 'center',
    lineHeight: 1.4,
    transition: 'color .22s ease',
  },

  /* Actions */
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 22px',
    borderRadius: 14,
    border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#334155',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: 'system-ui, Inter, sans-serif',
    cursor: 'pointer',
    transition: 'background .2s, border-color .2s',
  },

  continueBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 32px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #0EA5A4 0%, #0D9695 100%)',
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'system-ui, Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(14,165,164,0.35)',
    transition: 'opacity .25s ease, transform .2s ease',
  },
};

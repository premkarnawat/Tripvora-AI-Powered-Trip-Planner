'use client';

import React, { useState, useCallback } from 'react';

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const INTERESTS = [
  { emoji: '🌿', label: 'Nature' },
  { emoji: '🏖️', label: 'Beaches' },
  { emoji: '🛕', label: 'Temples' },
  { emoji: '🏛️', label: 'Heritage' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '🧗', label: 'Adventure' },
  { emoji: '🛍️', label: 'Shopping' },
  { emoji: '🏪', label: 'Markets' },
  { emoji: '🏛️', label: 'Museums' },
  { emoji: '🏗️', label: 'Architecture' },
  { emoji: '🦁', label: 'Wildlife' },
  { emoji: '⛺', label: 'Camping' },
  { emoji: '🚗', label: 'Road Trip' },
  { emoji: '🌙', label: 'Nightlife' },
  { emoji: '🍜', label: 'Food Trails' },
  { emoji: '🌅', label: 'Sunrise' },
  { emoji: '🌇', label: 'Sunset' },
  { emoji: '💎', label: 'Hidden Gems' },
  { emoji: '🏄', label: 'Water Activities' },
] as const;

export function InterestsStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const selected: string[] = data?.interests ?? [];
  const [rippleKey, setRippleKey] = useState<string | null>(null);

  const toggle = useCallback(
    (label: string) => {
      setRippleKey(label);
      setTimeout(() => setRippleKey(null), 400);

      const next = selected.includes(label)
        ? selected.filter((i) => i !== label)
        : [...selected, label];
      onUpdate('interests', next);
    },
    [selected, onUpdate],
  );

  const canContinue = selected.length >= 1;

  return (
    <div style={styles.wrapper}>
      {/* -------- Header -------- */}
      <div style={styles.header}>
        <h1 style={styles.heading}>What excites you?</h1>
        <p style={styles.subtitle}>Select everything that interests you</p>
      </div>

      {/* -------- Chip Grid -------- */}
      <div style={styles.grid}>
        {INTERESTS.map(({ emoji, label }) => {
          const isSelected = selected.includes(label);
          const isRipple = rippleKey === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              style={{
                ...styles.chip,
                ...(isSelected ? styles.chipSelected : styles.chipDefault),
                transform: isRipple
                  ? 'scale(1.08)'
                  : isSelected
                    ? 'scale(1.02)'
                    : 'scale(1)',
              }}
              aria-pressed={isSelected}
            >
              <span style={styles.emoji}>{emoji}</span>
              <span style={styles.label}>{label}</span>
              {isSelected && (
                <span style={styles.checkBadge}>
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
              )}
            </button>
          );
        })}
      </div>

      {/* -------- Count Indicator -------- */}
      <div style={styles.countRow}>
        <span
          style={{
            ...styles.countText,
            opacity: selected.length > 0 ? 1 : 0.4,
          }}
        >
          {selected.length === 0
            ? 'No interests selected yet'
            : `${selected.length} interest${selected.length > 1 ? 's' : ''} selected`}
        </span>
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

      {/* -------- Scoped keyframes via <style> -------- */}
      <style>{`
        @keyframes interestsFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
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
    gap: 28,
    maxWidth: 680,
    margin: '0 auto',
    padding: '48px 20px 32px',
    animation: 'interestsFadeUp .55s cubic-bezier(.16,1,.3,1) both',
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
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  /* Chip – shared */
  chip: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 999,
    border: '1.5px solid transparent',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: 'system-ui, Inter, sans-serif',
    cursor: 'pointer',
    transition:
      'transform .28s cubic-bezier(.34,1.56,.64,1), background .22s ease, border-color .22s ease, box-shadow .22s ease, color .22s ease',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  chipDefault: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderColor: 'rgba(0,0,0,0.08)',
    color: '#0F172A',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  chipSelected: {
    background: '#0EA5A4',
    borderColor: '#0EA5A4',
    color: '#0F172A',
    boxShadow: '0 4px 18px rgba(14,165,164,0.32)',
  },

  emoji: { fontSize: 20, lineHeight: 1 },
  label: { lineHeight: 1 },

  checkBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.25)',
    marginLeft: 2,
    color: '#0F172A',
    flexShrink: 0,
  },

  /* Count */
  countRow: { textAlign: 'center' },
  countText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#0EA5A4',
    fontFamily: 'system-ui, Inter, sans-serif',
    transition: 'opacity .3s ease',
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

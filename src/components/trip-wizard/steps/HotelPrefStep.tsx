'use client';

import { useState, useEffect } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */
interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface HotelOption {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const HOTEL_OPTIONS: HotelOption[] = [
  { id: 'budget',          emoji: '💰',       label: 'Budget',          subtitle: 'Clean and affordable' },
  { id: '2-star',          emoji: '⭐⭐',     label: '2 Star',          subtitle: 'Basic comfort' },
  { id: '3-star',          emoji: '⭐⭐⭐',   label: '3 Star',          subtitle: 'Good amenities' },
  { id: '4-star',          emoji: '⭐⭐⭐⭐', label: '4 Star',          subtitle: 'Premium experience' },
  { id: '5-star',          emoji: '⭐⭐⭐⭐⭐', label: '5 Star',        subtitle: 'Luxury stay' },
  { id: 'resort',          emoji: '🏖️',       label: 'Resort',          subtitle: 'Resort experience' },
  { id: 'beachfront',      emoji: '🌊',       label: 'Beachfront',      subtitle: 'Wake up to waves' },
  { id: 'family-friendly', emoji: '👨‍👩‍👧',       label: 'Family Friendly', subtitle: 'Kid-safe amenities' },
  { id: 'luxury',          emoji: '💎',       label: 'Luxury',          subtitle: 'Ultimate indulgence' },
  { id: 'boutique',        emoji: '🏡',       label: 'Boutique',        subtitle: 'Unique & charming' },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export function HotelPrefStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string[]>(data.hotelPreference ?? []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);
    onUpdate('hotelPreference', next);
  };

  return (
    <div style={{ ...styles.root, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)' }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <p style={styles.stepLabel}>Step 11</p>
        <h1 style={styles.heading}>What kind of stay do you prefer?</h1>
        <p style={styles.subtitle}>Select your accommodation style</p>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      <div style={styles.grid}>
        {HOTEL_OPTIONS.map((opt, i) => {
          const isActive = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              style={{
                ...styles.card,
                ...(isActive ? styles.cardActive : {}),
                transitionDelay: `${i * 35}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted
                  ? 'translateY(0) scale(1)'
                  : 'translateY(16px) scale(0.97)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-4px) scale(1.03)';
                el.style.boxShadow = isActive
                  ? '0 8px 32px rgba(14,165,164,0.22)'
                  : '0 8px 32px rgba(0,0,0,0.10)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = isActive
                  ? '0 4px 24px rgba(14,165,164,0.15), inset 0 0 0 2px #0EA5A4'
                  : '0 4px 24px rgba(0,0,0,0.06)';
              }}
            >
              {/* Checkmark */}
              <span
                style={{
                  ...styles.check,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(0.5)',
                }}
              >
                ✓
              </span>
              <span style={styles.emoji}>{opt.emoji}</span>
              <span style={{ ...styles.label, color: isActive ? '#0EA5A4' : '#0F172A' }}>
                {opt.label}
              </span>
              <span style={styles.cardSubtitle}>{opt.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* ── Selection summary ───────────────────────────────────────── */}
      {selected.length > 0 && (
        <div style={styles.summary}>
          <span style={styles.summaryText}>
            {selected.length} {selected.length === 1 ? 'style' : 'styles'} selected
          </span>
          <div style={styles.chips}>
            {selected.map((id) => {
              const opt = HOTEL_OPTIONS.find((o) => o.id === id);
              return (
                <span key={id} style={styles.chip}>
                  {opt?.emoji} {opt?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div style={styles.nav}>
        <button onClick={onBack} style={styles.backBtn} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.06)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          style={{
            ...styles.continueBtn,
            opacity: selected.length === 0 ? 0.45 : 1,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (selected.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,164,0.35)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,164,0.2)';
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

/* ─── Styles (inline, no external deps) ─────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '48px 24px 64px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 40,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#0EA5A4',
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0F172A',
    lineHeight: 1.15,
    marginBottom: 8,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 400,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  card: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '28px 16px 22px',
    border: '1.5px solid rgba(0,0,0,0.07)',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    outline: 'none',
    userSelect: 'none' as const,
  },
  cardActive: {
    borderColor: '#0EA5A4',
    background: 'rgba(14,165,164,0.06)',
    boxShadow: '0 4px 24px rgba(14,165,164,0.15), inset 0 0 0 2px #0EA5A4',
  },
  check: {
    position: 'absolute' as const,
    top: 10,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#0EA5A4',
    color: '#0F172A',
    fontSize: 13,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: 700,
    transition: 'color 0.2s ease',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500,
  },
  summary: {
    marginTop: 28,
    padding: '16px 20px',
    borderRadius: 14,
    background: 'rgba(14,165,164,0.05)',
    border: '1px solid rgba(14,165,164,0.15)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0EA5A4',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  chip: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0F172A',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(14,165,164,0.25)',
    borderRadius: 20,
    padding: '4px 12px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  backBtn: {
    fontSize: 15,
    fontWeight: 600,
    color: '#64748b',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  continueBtn: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0F172A',
    background: 'linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%)',
    border: 'none',
    borderRadius: 14,
    padding: '14px 40px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(14,165,164,0.2)',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  },
};

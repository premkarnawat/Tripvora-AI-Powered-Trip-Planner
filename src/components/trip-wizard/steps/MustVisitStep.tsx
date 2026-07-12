'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */
interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface MustVisitPlace {
  name: string;
  preferredDay: string;
  priority: 'optional' | 'important' | 'mandatory';
}

/* ─── Component ─────────────────────────────────────────────────────── */
export function MustVisitStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [mounted, setMounted] = useState(false);
  const [hasPlaces, setHasPlaces] = useState(false);
  const [places, setPlaces] = useState<MustVisitPlace[]>(data.mustVisit ?? []);

  // Form fields
  const [placeName, setPlaceName] = useState('');
  const [preferredDay, setPreferredDay] = useState('Any Day');
  const [priority, setPriority] = useState<MustVisitPlace['priority']>('optional');
  const [addAnim, setAddAnim] = useState(false);
  const [removingIdx, setRemovingIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const tripDays = data.duration?.days ?? 5;

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (data.mustVisit?.length) {
      setHasPlaces(true);
    }
  }, [data.mustVisit]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const addPlace = () => {
    const trimmed = placeName.trim();
    if (!trimmed) return;
    const newPlace: MustVisitPlace = {
      name: trimmed,
      preferredDay,
      priority,
    };
    const next = [...places, newPlace];
    setPlaces(next);
    onUpdate('mustVisit', next);
    setPlaceName('');
    setPreferredDay('Any Day');
    setPriority('optional');
    setAddAnim(true);
    setTimeout(() => setAddAnim(false), 400);
    inputRef.current?.focus();
  };

  const removePlace = (index: number) => {
    setRemovingIdx(index);
    setTimeout(() => {
      const next = places.filter((_, i) => i !== index);
      setPlaces(next);
      onUpdate('mustVisit', next);
      setRemovingIdx(null);
    }, 280);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlace();
    }
  };

  const handleSkip = () => {
    onUpdate('mustVisit', []);
    onNext();
  };

  const dayOptions = ['Any Day', ...Array.from({ length: tripDays }, (_, i) => `Day ${i + 1}`)];

  const priorityOptions: { value: MustVisitPlace['priority']; label: string; emoji: string; color: string }[] = [
    { value: 'optional',  label: 'Optional',  emoji: '🟢', color: '#22c55e' },
    { value: 'important', label: 'Important', emoji: '🟡', color: '#eab308' },
    { value: 'mandatory', label: 'Mandatory', emoji: '🔴', color: '#ef4444' },
  ];

  const priorityBadgeColor: Record<string, { bg: string; text: string }> = {
    optional:  { bg: 'rgba(34,197,94,0.10)',  text: '#16a34a' },
    important: { bg: 'rgba(234,179,8,0.12)',   text: '#ca8a04' },
    mandatory: { bg: 'rgba(239,68,68,0.10)',   text: '#dc2626' },
  };

  return (
    <div style={{ ...s.root, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)' }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={s.headerRow}>
        <div>
          <p style={s.stepLabel}>Step 12 · Optional</p>
          <h1 style={s.heading}>Any places you must visit?</h1>
          <p style={s.subtitle}>Tell us places you definitely want to see</p>
        </div>
        <button
          onClick={handleSkip}
          style={s.skipLink}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0EA5A4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
        >
          Skip this step →
        </button>
      </div>

      {/* ── Toggle ──────────────────────────────────────────────────── */}
      <div style={s.toggleCard}>
        <span style={s.toggleText}>Do you have specific places in mind?</span>
        <button
          onClick={() => setHasPlaces(!hasPlaces)}
          style={{
            ...s.toggleTrack,
            background: hasPlaces ? '#0EA5A4' : '#e2e8f0',
          }}
        >
          <span
            style={{
              ...s.toggleThumb,
              transform: hasPlaces ? 'translateX(22px)' : 'translateX(2px)',
            }}
          />
        </button>
      </div>

      {/* ── Form (visible when toggled on) ──────────────────────────── */}
      <div
        style={{
          ...s.formContainer,
          maxHeight: hasPlaces ? 1200 : 0,
          opacity: hasPlaces ? 1 : 0,
          marginTop: hasPlaces ? 24 : 0,
        }}
      >
        {/* Search input */}
        <div style={s.inputGroup}>
          <label style={s.inputLabel}>Place name</label>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>📍</span>
            <input
              ref={inputRef}
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Taj Mahal, Jaipur Fort…"
              style={s.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0EA5A4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14,165,164,0.12)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Day selector */}
        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.inputLabel}>Preferred Day</label>
            <select
              value={preferredDay}
              onChange={(e) => setPreferredDay(e.target.value)}
              style={s.select}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0EA5A4'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority selector */}
        <div style={s.inputGroup}>
          <label style={s.inputLabel}>Priority</label>
          <div style={s.priorityRow}>
            {priorityOptions.map((p) => {
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  style={{
                    ...s.priorityCard,
                    borderColor: active ? p.color : 'rgba(0,0,0,0.07)',
                    background: active ? `${p.color}10` : 'rgba(255,255,255,0.8)',
                    boxShadow: active ? `0 4px 16px ${p.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: 16 }}>{p.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: active ? p.color : '#334155' }}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={addPlace}
          disabled={!placeName.trim()}
          style={{
            ...s.addBtn,
            opacity: placeName.trim() ? 1 : 0.4,
            cursor: placeName.trim() ? 'pointer' : 'not-allowed',
            transform: addAnim ? 'scale(0.96)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (placeName.trim()) e.currentTarget.style.background = '#0d9695';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0EA5A4';
          }}
        >
          + Add Place
        </button>

        {/* ── Added places list ─────────────────────────────────────── */}
        {places.length > 0 && (
          <div style={s.placesList}>
            <p style={s.placesListTitle}>
              Your must-visit places ({places.length})
            </p>
            {places.map((place, idx) => {
              const badge = priorityBadgeColor[place.priority];
              const isRemoving = removingIdx === idx;
              return (
                <div
                  key={`${place.name}-${idx}`}
                  style={{
                    ...s.placeCard,
                    opacity: isRemoving ? 0 : 1,
                    transform: isRemoving ? 'translateX(40px) scale(0.95)' : 'translateX(0) scale(1)',
                  }}
                >
                  <div style={s.placeInfo}>
                    <div style={s.placeTop}>
                      <span style={s.placeName}>📍 {place.name}</span>
                      <span
                        style={{
                          ...s.placeBadge,
                          background: badge.bg,
                          color: badge.text,
                        }}
                      >
                        {place.priority}
                      </span>
                    </div>
                    <span style={s.placeDay}>{place.preferredDay}</span>
                  </div>
                  <button
                    onClick={() => removePlace(idx)}
                    style={s.removeBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div style={s.nav}>
        <button
          onClick={onBack}
          style={s.backBtn}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          style={s.generateBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,164,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(14,165,164,0.25)';
          }}
        >
          ✨ Generate My Trip
        </button>
      </div>
    </div>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  root: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '48px 24px 64px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },

  /* Header */
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 32,
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
  skipLink: {
    fontSize: 14,
    fontWeight: 600,
    color: '#94a3b8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    whiteSpace: 'nowrap' as const,
    marginTop: 4,
  },

  /* Toggle */
  toggleCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.80)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1.5px solid rgba(0,0,0,0.06)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
  },
  toggleTrack: {
    position: 'relative' as const,
    width: 50,
    height: 28,
    borderRadius: 14,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.25s ease',
    flexShrink: 0,
  },
  toggleThumb: {
    position: 'absolute' as const,
    top: 3,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
    transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
  },

  /* Form container */
  formContainer: {
    overflow: 'hidden',
    transition: 'max-height 0.45s cubic-bezier(.4,0,.2,1), opacity 0.35s ease, margin-top 0.35s ease',
  },

  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#94a3b8',
    marginBottom: 8,
    display: 'block',
  },
  searchWrap: {
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    top: '50%',
    left: 16,
    transform: 'translateY(-50%)',
    fontSize: 16,
    pointerEvents: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: 500,
    color: '#0F172A',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box' as const,
  },
  row: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: 500,
    color: '#0F172A',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    appearance: 'none' as const,
    boxSizing: 'border-box' as const,
  },

  /* Priority */
  priorityRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  priorityCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 6,
    padding: '16px 12px',
    borderRadius: 14,
    border: '1.5px solid rgba(0,0,0,0.07)',
    backdropFilter: 'blur(12px)',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
    outline: 'none',
  },

  /* Add button */
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 700,
    color: '#0F172A',
    background: '#0EA5A4',
    border: 'none',
    borderRadius: 12,
    padding: '12px 28px',
    transition: 'all 0.25s ease',
    marginBottom: 24,
  },

  /* Places list */
  placesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  placesListTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0EA5A4',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  placeCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'opacity 0.28s ease, transform 0.28s ease',
  },
  placeInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  placeTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap' as const,
  },
  placeName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0F172A',
  },
  placeBadge: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'capitalize' as const,
    padding: '2px 10px',
    borderRadius: 20,
  },
  placeDay: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0,0,0,0.04)',
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },

  /* Navigation */
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 24,
    borderTop: '1px solid rgba(0,0,0,0.06)',
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
  generateBtn: {
    fontSize: 17,
    fontWeight: 800,
    color: '#0F172A',
    background: 'linear-gradient(135deg, #0EA5A4 0%, #0891b2 50%, #0EA5A4 100%)',
    backgroundSize: '200% 200%',
    border: 'none',
    borderRadius: 16,
    padding: '16px 44px',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(14,165,164,0.25)',
    transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
    letterSpacing: '0.01em',
  },
};

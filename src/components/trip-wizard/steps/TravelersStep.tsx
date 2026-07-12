'use client';

import React, { useState, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

type TravelType =
  | 'solo'
  | 'couple'
  | 'family'
  | 'friends'
  | 'bachelor'
  | 'corporate'
  | 'senior';

interface Members {
  adults: number;
  children: number;
  seniors: number;
  boys: number;
  girls: number;
  total: number;
}

interface TravelOption {
  id: TravelType;
  icon: string;
  label: string;
  desc: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TRAVEL_OPTIONS: TravelOption[] = [
  { id: 'solo', icon: '🧍', label: 'Solo', desc: 'A journey just for you' },
  { id: 'couple', icon: '💑', label: 'Couple', desc: 'Romantic getaway for two' },
  { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Family', desc: 'Fun for the whole family' },
  { id: 'friends', icon: '👫', label: 'Friends', desc: 'Adventures with your squad' },
  { id: 'bachelor', icon: '🎉', label: 'Bachelor', desc: 'The ultimate celebration' },
  { id: 'corporate', icon: '💼', label: 'Corporate', desc: 'Team offsites & retreats' },
  { id: 'senior', icon: '👴', label: 'Senior Citizens', desc: 'Relaxed & comfortable trips' },
];

const defaultMembers = (): Members => ({
  adults: 1,
  children: 0,
  seniors: 0,
  boys: 0,
  girls: 0,
  total: 1,
});

/* ------------------------------------------------------------------ */
/*  Counter component                                                  */
/* ------------------------------------------------------------------ */

function Counter({
  label,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={styles.counterRow}>
      <span style={styles.counterLabel}>{label}</span>
      <div style={styles.counterControls}>
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            ...styles.counterBtn,
            opacity: value <= min ? 0.35 : 1,
            cursor: value <= min ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (value > min) e.currentTarget.style.background = 'rgba(14,165,164,0.10)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
          }}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span style={styles.counterValue}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          style={styles.counterBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(14,165,164,0.10)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
          }}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TravelersStep                                                      */
/* ------------------------------------------------------------------ */

export function TravelersStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [travelType, setTravelType] = useState<TravelType | null>(
    data.travelType ?? null,
  );
  const [members, setMembers] = useState<Members>(
    data.members ?? defaultMembers(),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  /* ---- helpers ---- */
  const selectType = (type: TravelType) => {
    setTravelType(type);
    onUpdate('travelType', type);

    // Reset members to sensible defaults
    let next: Members;
    switch (type) {
      case 'solo':
        next = { adults: 1, children: 0, seniors: 0, boys: 0, girls: 0, total: 1 };
        break;
      case 'couple':
        next = { adults: 2, children: 0, seniors: 0, boys: 0, girls: 0, total: 2 };
        break;
      case 'family':
        next = { adults: 2, children: 1, seniors: 0, boys: 0, girls: 0, total: 3 };
        break;
      case 'friends':
        next = { adults: 2, children: 0, seniors: 0, boys: 1, girls: 1, total: 2 };
        break;
      case 'bachelor':
        next = { adults: 4, children: 0, seniors: 0, boys: 0, girls: 0, total: 4 };
        break;
      case 'corporate':
        next = { adults: 5, children: 0, seniors: 0, boys: 0, girls: 0, total: 5 };
        break;
      case 'senior':
        next = { adults: 0, children: 0, seniors: 2, boys: 0, girls: 0, total: 2 };
        break;
      default:
        next = defaultMembers();
    }
    setMembers(next);
    onUpdate('members', next);
  };

  const updateMembers = (patch: Partial<Members>) => {
    const updated = { ...members, ...patch };
    setMembers(updated);
    onUpdate('members', updated);
  };

  /* ---- dynamic fields ---- */
  const renderFields = () => {
    if (!travelType) return null;

    switch (travelType) {
      case 'solo':
        return (
          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>🎒</span>
            <span style={styles.infoText}>
              Travelling solo — 1 adult. No extra details needed!
            </span>
          </div>
        );

      case 'couple':
        return (
          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>💕</span>
            <span style={styles.infoText}>
              Couple's trip — 2 Adults
            </span>
          </div>
        );

      case 'family':
        return (
          <div style={styles.countersCard}>
            <h4 style={styles.countersTitle}>Family Members</h4>
            <Counter
              label="Adults"
              value={members.adults}
              min={1}
              onChange={(v) => updateMembers({ adults: v })}
            />
            <Counter
              label="Children"
              value={members.children}
              min={0}
              onChange={(v) => updateMembers({ children: v })}
            />
            <Counter
              label="Seniors"
              value={members.seniors}
              min={0}
              onChange={(v) => updateMembers({ seniors: v })}
            />
          </div>
        );

      case 'friends':
        return (
          <div style={styles.countersCard}>
            <h4 style={styles.countersTitle}>Group Details</h4>
            <Counter
              label="Adults"
              value={members.adults}
              min={1}
              onChange={(v) => updateMembers({ adults: v })}
            />
            <Counter
              label="Male"
              value={members.boys}
              min={0}
              onChange={(v) => updateMembers({ boys: v })}
            />
            <Counter
              label="Female"
              value={members.girls}
              min={0}
              onChange={(v) => updateMembers({ girls: v })}
            />
          </div>
        );

      case 'bachelor':
        return (
          <div style={styles.countersCard}>
            <h4 style={styles.countersTitle}>Party Size</h4>
            <Counter
              label="Total Members"
              value={members.total}
              min={1}
              onChange={(v) => updateMembers({ total: v })}
            />
          </div>
        );

      case 'corporate':
        return (
          <div style={styles.countersCard}>
            <h4 style={styles.countersTitle}>Team Size</h4>
            <Counter
              label="Total Members"
              value={members.total}
              min={1}
              onChange={(v) => updateMembers({ total: v })}
            />
          </div>
        );

      case 'senior':
        return (
          <div style={styles.countersCard}>
            <h4 style={styles.countersTitle}>Group Size</h4>
            <Counter
              label="Total Members"
              value={members.total}
              min={1}
              onChange={(v) => updateMembers({ total: v })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.container,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        {/* Header */}
        <div style={styles.headerArea}>
          <span style={styles.stepBadge}>Step 6</span>
          <h1 style={styles.heading}>Who's travelling?</h1>
          <p style={styles.subtitle}>Tell us about your travel crew</p>
        </div>

        {/* ---- Travel type grid ---- */}
        <div style={styles.typeGrid}>
          {TRAVEL_OPTIONS.map((opt, idx) => {
            const isActive = travelType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectType(opt.id)}
                style={{
                  ...styles.typeCard,
                  ...(isActive ? styles.typeCardActive : {}),
                  transitionDelay: `${idx * 40}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted
                    ? isActive
                      ? 'scale(1.04)'
                      : 'scale(1)'
                    : 'translateY(20px)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'scale(1.04)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 32px rgba(0,0,0,0.10)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 24px rgba(0,0,0,0.06)';
                  }
                }}
              >
                <span style={styles.typeIcon}>{opt.icon}</span>
                <span style={styles.typeLabel}>{opt.label}</span>
                <span style={styles.typeDesc}>{opt.desc}</span>
                {isActive && <span style={styles.checkMark}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* ---- Dynamic fields ---- */}
        <div
          style={{
            ...styles.fieldsArea,
            maxHeight: travelType ? 400 : 0,
            opacity: travelType ? 1 : 0,
            marginTop: travelType ? 28 : 0,
          }}
        >
          {renderFields()}
        </div>

        {/* ---- Navigation ---- */}
        <div
          style={{
            ...styles.navRow,
            opacity: travelType ? 1 : 0,
            transform: travelType ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={styles.backBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onNext}
            style={styles.continueBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 32px rgba(14,165,164,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(14,165,164,0.25)';
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 24px',
  },
  container: {
    width: '100%',
    maxWidth: 660,
    transition:
      'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
  },

  /* ---- header ---- */
  headerArea: {
    textAlign: 'center' as const,
    marginBottom: 36,
  },
  stepBadge: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: '#0EA5A4',
    background: 'rgba(14,165,164,0.08)',
    borderRadius: 100,
    padding: '4px 14px',
    marginBottom: 14,
  },
  heading: {
    fontFamily: 'system-ui, Inter, sans-serif',
    fontSize: 32,
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 8px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    margin: 0,
    fontWeight: 400,
  },

  /* ---- type selection grid ---- */
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  typeCard: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    padding: '26px 16px 22px',
    borderRadius: 16,
    border: '2px solid rgba(0,0,0,0.06)',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition:
      'transform 0.25s cubic-bezier(.4,0,.2,1), border-color 0.3s, box-shadow 0.3s, opacity 0.5s ease',
    outline: 'none',
    fontFamily: 'system-ui, Inter, sans-serif',
  },
  typeCardActive: {
    borderColor: '#0EA5A4',
    background: 'rgba(14,165,164,0.04)',
    boxShadow: '0 4px 24px rgba(14,165,164,0.14)',
    transform: 'scale(1.04)',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
  },
  typeDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center' as const,
  },
  checkMark: {
    position: 'absolute' as const,
    top: 10,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#0EA5A4',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
  },

  /* ---- dynamic fields area ---- */
  fieldsArea: {
    overflow: 'hidden',
    transition:
      'max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s ease, margin-top 0.4s ease',
  },

  /* Info card (solo / couple) */
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '20px 24px',
    borderRadius: 16,
    background: 'rgba(14,165,164,0.04)',
    border: '1px solid rgba(14,165,164,0.12)',
  },
  infoIcon: {
    fontSize: 26,
  },
  infoText: {
    fontSize: 15,
    fontWeight: 500,
    color: '#0F172A',
    fontFamily: 'system-ui, Inter, sans-serif',
  },

  /* Counters card */
  countersCard: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 16,
    padding: '24px 24px 8px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  countersTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    margin: '0 0 16px',
    fontFamily: 'system-ui, Inter, sans-serif',
  },

  /* Counter row */
  counterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    marginBottom: 2,
  },
  counterLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: '#334155',
    fontFamily: 'system-ui, Inter, sans-serif',
  },
  counterControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    background: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  counterBtn: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 500,
    color: '#0F172A',
    background: 'rgba(0,0,0,0.04)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'system-ui, Inter, sans-serif',
    transition: 'background 0.2s',
  },
  counterValue: {
    width: 44,
    textAlign: 'center' as const,
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    fontFamily: 'system-ui, Inter, sans-serif',
  },

  /* ---- navigation ---- */
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 36,
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
  backBtn: {
    padding: '12px 24px',
    fontSize: 15,
    fontWeight: 500,
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'system-ui, Inter, sans-serif',
    transition: 'background 0.2s',
  },
  continueBtn: {
    padding: '14px 36px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #0EA5A4 0%, #0D9695 100%)',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'system-ui, Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(14,165,164,0.25)',
    transition: 'transform 0.25s, box-shadow 0.25s',
  },
};

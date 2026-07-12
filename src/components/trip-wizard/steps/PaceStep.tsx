'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

type Pace = 'slow' | 'balanced' | 'explorer';

interface PaceOption {
  id: Pace;
  emoji: string;
  title: string;
  attractions: string;
  description: string;
  badge?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PACE_OPTIONS: PaceOption[] = [
  {
    id: 'slow',
    emoji: '🌿',
    title: 'Slow',
    attractions: '3–4 attractions per day',
    description: 'Take it easy, soak it in',
  },
  {
    id: 'balanced',
    emoji: '⚡',
    title: 'Balanced',
    attractions: '5–6 attractions per day',
    description: 'The sweet spot',
    badge: 'Most Popular',
  },
  {
    id: 'explorer',
    emoji: '🔥',
    title: 'Explorer',
    attractions: '7–8 attractions per day',
    description: 'See everything possible',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function PaceStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const pace: Pace = data?.pace ?? 'balanced';
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<Pace | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 2px 12px rgba(14,165,164,0.25); }
          50%      { box-shadow: 0 2px 20px rgba(14,165,164,0.45); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 16px 48px',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          background: 'linear-gradient(180deg, #f8fffe 0%, #f0fdfa 40%, #ffffff 100%)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52, maxWidth: 540 }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0,
              animation: 'fadeSlideUp 0.6s ease both',
            }}
          >
            What&apos;s your travel style?
          </h1>
          <p
            style={{
              fontSize: 17,
              color: '#64748b',
              marginTop: 12,
              fontWeight: 500,
              animation: 'fadeSlideUp 0.6s ease 0.1s both',
            }}
          >
            How do you like to explore?
          </p>
        </div>

        {/* Cards Container */}
        <div style={{ width: '100%', maxWidth: 840 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              marginBottom: 48,
            }}
          >
            {PACE_OPTIONS.map((option, idx) => {
              const isSelected = pace === option.id;
              const isHovered = hoveredId === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => onUpdate('pace', option.id)}
                  onMouseEnter={() => setHoveredId(option.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    position: 'relative',
                    background: isSelected
                      ? 'linear-gradient(160deg, rgba(14,165,164,0.07) 0%, rgba(14,165,164,0.03) 100%)'
                      : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: isSelected
                      ? '2.5px solid #0EA5A4'
                      : '2px solid rgba(226,232,240,0.5)',
                    borderRadius: 20,
                    padding: '40px 24px 36px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: isSelected
                      ? 'scale(1.02)'
                      : isHovered
                        ? 'scale(1.01) translateY(-3px)'
                        : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 12px 40px rgba(14,165,164,0.18), 0 4px 12px rgba(0,0,0,0.04)'
                      : isHovered
                        ? '0 12px 36px rgba(0,0,0,0.1)'
                        : '0 4px 24px rgba(0,0,0,0.06)',
                    outline: 'none',
                    filter: isSelected ? 'none' : 'grayscale(0.15)',
                    animation: `scaleIn 0.45s ease ${0.15 + idx * 0.1}s both`,
                    overflow: 'visible',
                  }}
                  aria-pressed={isSelected}
                >
                  {/* "Most Popular" Badge */}
                  {option.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -13,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #0EA5A4 0%, #14b8a6 100%)',
                        color: '#0F172A',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '5px 16px',
                        borderRadius: 20,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        animation: 'badgePulse 3s ease-in-out infinite',
                        zIndex: 2,
                      }}
                    >
                      {option.badge}
                    </div>
                  )}

                  {/* Checkmark overlay */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#0EA5A4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 3px 12px rgba(14,165,164,0.35)',
                        animation: 'checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="#fff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Emoji */}
                  <div
                    style={{
                      fontSize: 52,
                      marginBottom: 18,
                      transition: 'transform 0.3s ease',
                      transform: isSelected || isHovered ? 'scale(1.1)' : 'scale(1)',
                      lineHeight: 1,
                    }}
                  >
                    {option.emoji}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: isSelected ? '#0EA5A4' : '#0F172A',
                      marginBottom: 10,
                      letterSpacing: '-0.02em',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {option.title}
                  </div>

                  {/* Attractions count */}
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: 13,
                      fontWeight: 700,
                      color: isSelected ? '#0EA5A4' : '#64748b',
                      background: isSelected
                        ? 'rgba(14,165,164,0.1)'
                        : 'rgba(100,116,139,0.08)',
                      padding: '6px 14px',
                      borderRadius: 20,
                      marginBottom: 14,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {option.attractions}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize: 14,
                      color: '#94a3b8',
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Navigation ───────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'fadeSlideUp 0.5s ease 0.5s both',
            }}
          >
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 700,
                color: '#64748b',
                background: 'transparent',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#0F172A';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <button
              onClick={onNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 800,
                color: '#0F172A',
                background: 'linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%)',
                border: 'none',
                borderRadius: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(14,165,164,0.35)',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 28px rgba(14,165,164,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  'translateY(0) scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 4px 16px rgba(14,165,164,0.35)';
              }}
            >
              Continue
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M7 4L12 9L7 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

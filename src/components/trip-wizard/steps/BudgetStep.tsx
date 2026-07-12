'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

type BudgetMode = 'strict' | 'balanced' | 'flexible';

interface BudgetModeOption {
  id: BudgetMode;
  emoji: string;
  title: string;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MIN_BUDGET = 5000;
const MAX_BUDGET = 1000000;
const STEP_SIZE = 1000;

const BUDGET_MODES: BudgetModeOption[] = [
  { id: 'strict', emoji: '🎯', title: 'Strict Budget', description: 'Never exceed budget' },
  { id: 'balanced', emoji: '⚖️', title: 'Balanced', description: 'Can exceed slightly for better experiences' },
  { id: 'flexible', emoji: '💎', title: 'Flexible', description: 'Optimize quality over exact budget' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function getTotalTravelers(data: any): number {
  const members = data?.members || data?.travelers || {};
  const total =
    (members.adults || 0) +
    (members.boys || 0) +
    (members.girls || 0) +
    (members.children || 0) +
    (members.seniors || 0);
  return Math.max(total, 1);
}

function getTripDays(data: any): number {
  if (data?.duration?.days) return Math.max(data.duration.days, 1);
  if (data?.arrival?.date && data?.departure?.date) {
    const start = new Date(data.arrival.date);
    const end = new Date(data.departure.date);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  }
  return 1;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BudgetStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const budget: number = data?.budget ?? 50000;
  const budgetMode: BudgetMode = data?.budgetMode ?? 'balanced';

  const sliderRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [badgeLeft, setBadgeLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Entrance animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Compute badge position based on slider value
  const updateBadgePosition = useCallback(() => {
    if (!sliderRef.current || !trackRef.current) return;
    const pct = (budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET);
    const trackWidth = trackRef.current.offsetWidth;
    const thumbRadius = 16; // half of 32px thumb
    const left = thumbRadius + pct * (trackWidth - thumbRadius * 2);
    setBadgeLeft(left);
  }, [budget]);

  useEffect(() => {
    updateBadgePosition();
    window.addEventListener('resize', updateBadgePosition);
    return () => window.removeEventListener('resize', updateBadgePosition);
  }, [updateBadgePosition]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onUpdate('budget', val);
  };

  const days = getTripDays(data);
  const travelers = getTotalTravelers(data);
  const dailyBudget = Math.round(budget / days);
  const perPerson = Math.round(budget / travelers);
  const fillPercent = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <>
      {/* Scoped styles for the range slider */}
      <style>{`
        .tripvora-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: transparent;
          outline: none;
          cursor: pointer;
          position: relative;
          z-index: 2;
        }

        .tripvora-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%);
          border: 4px solid #ffffff;
          box-shadow: 0 4px 16px rgba(14, 165, 164, 0.45), 0 2px 8px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 0.15s cubic-bezier(0.4,0,0.2,1), box-shadow 0.15s ease;
          position: relative;
          z-index: 3;
        }
        .tripvora-slider::-webkit-slider-thumb:hover,
        .tripvora-slider:active::-webkit-slider-thumb {
          transform: scale(1.18);
          box-shadow: 0 6px 24px rgba(14, 165, 164, 0.6), 0 3px 12px rgba(0,0,0,0.2);
          cursor: grabbing;
        }

        .tripvora-slider::-moz-range-thumb {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%);
          border: 4px solid #ffffff;
          box-shadow: 0 4px 16px rgba(14, 165, 164, 0.45), 0 2px 8px rgba(0,0,0,0.15);
          cursor: grab;
          transition: transform 0.15s cubic-bezier(0.4,0,0.2,1), box-shadow 0.15s ease;
        }
        .tripvora-slider::-moz-range-thumb:hover {
          transform: scale(1.18);
          box-shadow: 0 6px 24px rgba(14, 165, 164, 0.6), 0 3px 12px rgba(0,0,0,0.2);
        }

        .tripvora-slider::-moz-range-track {
          background: transparent;
          height: 8px;
          border: none;
        }

        @keyframes budgetPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(14, 165, 164, 0.3); }
          50% { box-shadow: 0 4px 24px rgba(14, 165, 164, 0.55); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
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
        <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 600 }}>
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
            What&apos;s your budget?
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
            Drag to set your total trip budget
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            width: '100%',
            maxWidth: 720,
            animation: 'scaleIn 0.5s ease 0.15s both',
          }}
        >
          {/* ── Slider Hero Section ──────────────────────────────────────── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 24,
              padding: '48px 40px 40px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid rgba(255,255,255,0.9)',
              marginBottom: 24,
            }}
          >
            {/* Floating Badge */}
            <div
              ref={trackRef}
              style={{ position: 'relative', marginBottom: 8, height: 52 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: badgeLeft,
                  top: 0,
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%)',
                  color: '#0F172A',
                  fontSize: 18,
                  fontWeight: 800,
                  padding: '8px 20px',
                  borderRadius: 14,
                  whiteSpace: 'nowrap',
                  boxShadow: isDragging
                    ? '0 8px 32px rgba(14,165,164,0.5)'
                    : '0 4px 16px rgba(14,165,164,0.3)',
                  transition: isDragging ? 'none' : 'left 0.1s ease, box-shadow 0.2s ease',
                  animation: !isDragging ? 'budgetPulse 3s ease-in-out infinite' : 'none',
                  letterSpacing: '-0.01em',
                  zIndex: 5,
                }}
              >
                {formatINR(budget)}
                {/* Down arrow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderTop: '7px solid #0EA5A4',
                  }}
                />
              </div>
            </div>

            {/* Slider Track */}
            <div style={{ position: 'relative', height: 8, marginBottom: 16 }}>
              {/* Background track */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: 4,
                  background: '#e2e8f0',
                }}
              />
              {/* Filled track */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${fillPercent}%`,
                  height: 8,
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #0EA5A4 0%, #14b8a6 60%, #2dd4bf 100%)',
                  transition: isDragging ? 'none' : 'width 0.1s ease',
                  boxShadow: '0 0 12px rgba(14,165,164,0.3)',
                }}
              />
              {/* Native Range Input (invisible track, visible thumb) */}
              <input
                ref={sliderRef}
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={STEP_SIZE}
                value={budget}
                onChange={handleSliderChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="tripvora-slider"
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 0,
                  width: '100%',
                  height: 32,
                  margin: 0,
                }}
                aria-label="Trip budget slider"
              />
            </div>

            {/* Min/Max labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#94a3b8',
                fontWeight: 600,
              }}
            >
              <span>₹5,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>

          {/* ── Calculated Stats ─────────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {[
              { emoji: '💰', label: 'Total Budget', value: formatINR(budget) },
              { emoji: '📅', label: 'Daily Budget', value: formatINR(dailyBudget) },
              { emoji: '👤', label: 'Per Person', value: formatINR(perPerson) },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: 16,
                  padding: '24px 16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  animation: `fadeSlideUp 0.5s ease ${0.2 + idx * 0.08}s both`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.emoji}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#94a3b8',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: 6,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── Budget Mode ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Budget Mode
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {BUDGET_MODES.map((mode, idx) => {
                const isSelected = budgetMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => onUpdate('budgetMode', mode.id)}
                    style={{
                      position: 'relative',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(14,165,164,0.08) 0%, rgba(14,165,164,0.04) 100%)'
                        : 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: isSelected ? '2px solid #0EA5A4' : '2px solid rgba(226,232,240,0.6)',
                      borderRadius: 16,
                      padding: '24px 14px 20px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: isSelected
                        ? '0 8px 32px rgba(14,165,164,0.18)'
                        : '0 4px 24px rgba(0,0,0,0.06)',
                      animation: `fadeSlideUp 0.5s ease ${0.35 + idx * 0.08}s both`,
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#0EA5A4';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(226,232,240,0.6)';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                      }
                    }}
                    aria-pressed={isSelected}
                  >
                    {/* Checkmark overlay */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: '#0EA5A4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <div style={{ fontSize: 30, marginBottom: 10 }}>{mode.emoji}</div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: isSelected ? '#0EA5A4' : '#0F172A',
                        marginBottom: 6,
                      }}
                    >
                      {mode.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#94a3b8',
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {mode.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Navigation ───────────────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(14,165,164,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(14,165,164,0.35)';
              }}
            >
              Continue
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

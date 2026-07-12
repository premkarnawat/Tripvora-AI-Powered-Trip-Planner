'use client';

import React, { useState, useEffect, useRef } from 'react';

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

type TransportType = 'flight' | 'train' | 'bus' | 'cab';

interface TransportOption {
  type: TransportType;
  icon: string;
  label: string;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  { type: 'flight', icon: '✈️', label: 'Flight' },
  { type: 'train', icon: '🚂', label: 'Train' },
  { type: 'bus', icon: '🚌', label: 'Bus' },
  { type: 'cab', icon: '🚗', label: 'Cab' },
];

function GlassInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label
        style={{
          display: 'block',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '13px 16px',
          borderRadius: 12,
          border: `1.5px solid ${focused ? '#0EA5A4' : 'rgba(0,0,0,0.07)'}`,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: '#0F172A',
          outline: 'none',
          transition: 'all 0.25s ease',
          boxShadow: focused
            ? '0 0 0 3px rgba(14, 165, 164, 0.1)'
            : '0 1px 3px rgba(0,0,0,0.03)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          boxSizing: 'border-box' as const,
        }}
      />
    </div>
  );
}

export function TransportStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [hasTransport, setHasTransport] = useState<boolean | null>(
    data?.hasTransport ?? null
  );
  const [transportType, setTransportType] = useState<TransportType | null>(
    data?.transport?.type ?? null
  );
  const [arrivalDate, setArrivalDate] = useState(data?.transport?.arrival?.date ?? '');
  const [arrivalTime, setArrivalTime] = useState(data?.transport?.arrival?.time ?? '');
  const [arrivalFrom, setArrivalFrom] = useState(data?.transport?.arrival?.from ?? '');
  const [arrivalTo, setArrivalTo] = useState(data?.transport?.arrival?.to ?? '');
  const [departureDate, setDepartureDate] = useState(data?.transport?.departure?.date ?? '');
  const [departureTime, setDepartureTime] = useState(data?.transport?.departure?.time ?? '');

  const expandRef = useRef<HTMLDivElement>(null);
  const [expandHeight, setExpandHeight] = useState(0);

  /* Measure the expandable content height */
  useEffect(() => {
    if (hasTransport && expandRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setExpandHeight(entry.contentRect.height);
        }
      });
      observer.observe(expandRef.current);
      return () => observer.disconnect();
    } else {
      setExpandHeight(0);
    }
  }, [hasTransport]);

  /* Sync to parent */
  useEffect(() => {
    if (hasTransport === false) {
      onUpdate('hasTransport', false);
    }
    if (hasTransport === true) {
      onUpdate('hasTransport', true);
      onUpdate('transport', {
        type: transportType,
        arrival: {
          date: arrivalDate,
          time: arrivalTime,
          from: arrivalFrom,
          to: arrivalTo,
        },
        departure: {
          date: departureDate,
          time: departureTime,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTransport, transportType, arrivalDate, arrivalTime, arrivalFrom, arrivalTo, departureDate, departureTime]);

  const canContinue =
    hasTransport === false ||
    (hasTransport === true && !!transportType);

  const toggleCards: { value: boolean; icon: string; title: string; subtitle: string }[] = [
    {
      value: false,
      icon: '🗺️',
      title: 'No, help me plan',
      subtitle: "I'll figure out transport later",
    },
    {
      value: true,
      icon: '🎫',
      title: 'Yes, I have bookings',
      subtitle: 'I already have my tickets',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.12em',
            color: '#0EA5A4',
            marginBottom: 8,
          }}
        >
          Step 4
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 8,
          }}
        >
          Have you already booked
          <br />
          your transport?
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
          Let us know so we can plan accordingly
        </p>
      </div>

      {/* Toggle Cards */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {toggleCards.map((card) => {
          const selected = hasTransport === card.value;
          return (
            <button
              key={String(card.value)}
              onClick={() => setHasTransport(card.value)}
              style={{
                position: 'relative',
                padding: '28px 18px',
                borderRadius: 18,
                border: `2px solid ${selected ? '#0EA5A4' : 'rgba(0,0,0,0.06)'}`,
                background: selected
                  ? 'rgba(14, 165, 164, 0.06)'
                  : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: selected
                  ? '0 8px 32px rgba(14, 165, 164, 0.12)'
                  : '0 4px 24px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                textAlign: 'center' as const,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: selected ? 'scale(1.02)' : 'scale(1)',
                fontFamily: 'inherit',
              }}
            >
              {/* Selection indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `2px solid ${selected ? '#0EA5A4' : '#d1d5db'}`,
                  background: selected ? '#0EA5A4' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                }}
              >
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}>
                {card.icon}
              </span>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  fontWeight: 500,
                }}
              >
                {card.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expandable Details (when Yes is selected) */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
          maxHeight: hasTransport ? expandHeight + 40 : 0,
          opacity: hasTransport ? 1 : 0,
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
        }}
      >
        <div ref={expandRef}>
          {/* Transport Type Selector */}
          <div
            style={{
              marginBottom: 20,
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              padding: '20px',
            }}
          >
            <p
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                marginBottom: 14,
                margin: '0 0 14px 0',
              }}
            >
              Transport Type
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {TRANSPORT_OPTIONS.map((opt) => {
                const sel = transportType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setTransportType(opt.type)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: 14,
                      border: `2px solid ${sel ? '#0EA5A4' : 'rgba(0,0,0,0.06)'}`,
                      background: sel ? 'rgba(14,165,164,0.08)' : 'rgba(248,250,252,0.8)',
                      cursor: 'pointer',
                      textAlign: 'center' as const,
                      transition: 'all 0.25s ease',
                      transform: sel ? 'scale(1.04)' : 'scale(1)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 6 }}>
                      {opt.icon}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arrival Details */}
          <div
            style={{
              marginBottom: 14,
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(14, 165, 164, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
              >
                📍
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                Arrival Details
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <GlassInput label="Date" type="date" value={arrivalDate} onChange={setArrivalDate} />
              <GlassInput label="Time" type="time" value={arrivalTime} onChange={setArrivalTime} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <GlassInput
                label="Boarding Location"
                placeholder="e.g. Mumbai"
                value={arrivalFrom}
                onChange={setArrivalFrom}
              />
              <GlassInput
                label="Arrival Location"
                placeholder="e.g. Goa"
                value={arrivalTo}
                onChange={setArrivalTo}
              />
            </div>
          </div>

          {/* Departure Details */}
          <div
            style={{
              marginBottom: 8,
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(14, 165, 164, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
              >
                🛫
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                Departure Details
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <GlassInput label="Date" type="date" value={departureDate} onChange={setDepartureDate} />
              <GlassInput label="Time" type="time" value={departureTime} onChange={setDepartureTime} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 28,
          width: '100%',
          maxWidth: 480,
          opacity: hasTransport !== null ? 1 : 0.4,
          transform: hasTransport !== null ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.35s ease',
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: '16px 24px',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontFamily: 'inherit',
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          style={{
            flex: 2,
            padding: '16px 24px',
            borderRadius: 14,
            border: 'none',
            background: canContinue
              ? 'linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%)'
              : '#e2e8f0',
            color: canContinue ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: canContinue ? 'pointer' : 'default',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: canContinue ? '0 4px 20px rgba(14, 165, 164, 0.3)' : 'none',
            transform: canContinue ? 'scale(1)' : 'scale(0.98)',
            fontFamily: 'inherit',
          }}
        >
          Continue
        </button>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

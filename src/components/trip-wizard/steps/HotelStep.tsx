'use client';

import React, { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface HotelDetails {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

/* ------------------------------------------------------------------ */
/*  HotelStep                                                          */
/* ------------------------------------------------------------------ */

export function HotelStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [hasHotel, setHasHotel] = useState<boolean | null>(
    data.hasHotel ?? null,
  );
  const [hotel, setHotel] = useState<HotelDetails>({
    name: data.hotel?.name ?? '',
    address: data.hotel?.address ?? '',
    checkIn: data.hotel?.checkIn ?? '',
    checkOut: data.hotel?.checkOut ?? '',
  });
  const [mounted, setMounted] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  /* Scroll the detail fields into view when they appear */
  useEffect(() => {
    if (hasHotel && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [hasHotel]);

  /* ---- helpers ---- */
  const handleToggle = (value: boolean) => {
    setHasHotel(value);
    onUpdate('hasHotel', value);
    if (!value) {
      onUpdate('hotel', null);
    }
  };

  const updateHotelField = (field: keyof HotelDetails, value: string) => {
    const updated = { ...hotel, [field]: value };
    setHotel(updated);
    onUpdate('hotel', updated);
  };

  const canContinue =
    hasHotel === false ||
    (hasHotel === true &&
      hotel.name.trim() !== '' &&
      hotel.checkIn !== '' &&
      hotel.checkOut !== '');

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div style={styles.wrapper}>
      {/* ---- Entrance container ---- */}
      <div
        style={{
          ...styles.container,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        {/* Heading */}
        <div style={styles.headerArea}>
          <span style={styles.stepBadge}>Step 5</span>
          <h1 style={styles.heading}>Have you already booked your stay?</h1>
          <p style={styles.subtitle}>
            Let us know so we can tailor your trip perfectly.
          </p>
        </div>

        {/* ---- Toggle cards ---- */}
        <div style={styles.toggleRow}>
          {/* No card */}
          <button
            type="button"
            onClick={() => handleToggle(false)}
            style={{
              ...styles.toggleCard,
              ...(hasHotel === false ? styles.toggleCardActive : {}),
            }}
            onMouseEnter={(e) => {
              if (hasHotel !== false) {
                Object.assign(e.currentTarget.style, styles.toggleCardHover);
              }
            }}
            onMouseLeave={(e) => {
              if (hasHotel !== false) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = styles.toggleCard.boxShadow as string;
              }
            }}
          >
            <span style={styles.toggleIcon}>🏨</span>
            <span style={styles.toggleLabel}>No, recommend hotels</span>
            <span style={styles.toggleDesc}>
              We'll find the best stays for you
            </span>
            {hasHotel === false && <span style={styles.checkMark}>✓</span>}
          </button>

          {/* Yes card */}
          <button
            type="button"
            onClick={() => handleToggle(true)}
            style={{
              ...styles.toggleCard,
              ...(hasHotel === true ? styles.toggleCardActive : {}),
            }}
            onMouseEnter={(e) => {
              if (hasHotel !== true) {
                Object.assign(e.currentTarget.style, styles.toggleCardHover);
              }
            }}
            onMouseLeave={(e) => {
              if (hasHotel !== true) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = styles.toggleCard.boxShadow as string;
              }
            }}
          >
            <span style={styles.toggleIcon}>✅</span>
            <span style={styles.toggleLabel}>Yes, I have a booking</span>
            <span style={styles.toggleDesc}>
              Enter your hotel details below
            </span>
            {hasHotel === true && <span style={styles.checkMark}>✓</span>}
          </button>
        </div>

        {/* ---- Hotel detail fields (expand) ---- */}
        <div
          ref={detailsRef}
          style={{
            ...styles.detailsOuter,
            maxHeight: hasHotel === true ? 600 : 0,
            opacity: hasHotel === true ? 1 : 0,
            marginTop: hasHotel === true ? 28 : 0,
          }}
        >
          <div style={styles.detailsCard}>
            <h3 style={styles.detailsHeading}>Hotel Details</h3>

            {/* Hotel Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="hotelName">
                <span style={styles.labelIcon}>🏨</span> Hotel Name
              </label>
              <input
                id="hotelName"
                type="text"
                placeholder="e.g. The Ritz-Carlton"
                value={hotel.name}
                onChange={(e) => updateHotelField('name', e.target.value)}
                style={styles.input}
                onFocus={(e) =>
                  Object.assign(e.currentTarget.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Hotel Address */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="hotelAddress">
                <span style={styles.labelIcon}>📍</span> Hotel Address
              </label>
              <input
                id="hotelAddress"
                type="text"
                placeholder="e.g. 50 Central Park South, New York"
                value={hotel.address}
                onChange={(e) => updateHotelField('address', e.target.value)}
                style={styles.input}
                onFocus={(e) =>
                  Object.assign(e.currentTarget.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Dates row */}
            <div style={styles.dateRow}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label} htmlFor="checkIn">
                  <span style={styles.labelIcon}>📅</span> Check-in
                </label>
                <input
                  id="checkIn"
                  type="datetime-local"
                  value={hotel.checkIn}
                  onChange={(e) => updateHotelField('checkIn', e.target.value)}
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, styles.inputFocus)
                  }
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label} htmlFor="checkOut">
                  <span style={styles.labelIcon}>📅</span> Check-out
                </label>
                <input
                  id="checkOut"
                  type="datetime-local"
                  value={hotel.checkOut}
                  onChange={(e) => updateHotelField('checkOut', e.target.value)}
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, styles.inputFocus)
                  }
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---- Navigation ---- */}
        <div
          style={{
            ...styles.navRow,
            opacity: hasHotel !== null ? 1 : 0,
            transform:
              hasHotel !== null ? 'translateY(0)' : 'translateY(12px)',
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
            disabled={!canContinue}
            onClick={onNext}
            style={{
              ...styles.continueBtn,
              opacity: canContinue ? 1 : 0.45,
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (canContinue) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(14,165,164,0.35)';
              }
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
    maxWidth: 640,
    transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
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

  /* ---- toggle cards ---- */
  toggleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  toggleCard: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 6,
    padding: '32px 20px',
    borderRadius: 16,
    border: '2px solid rgba(0,0,0,0.06)',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition:
      'transform 0.25s cubic-bezier(.4,0,.2,1), border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
    fontFamily: 'system-ui, Inter, sans-serif',
  },
  toggleCardHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  },
  toggleCardActive: {
    borderColor: '#0EA5A4',
    background: 'rgba(14,165,164,0.04)',
    boxShadow: '0 4px 24px rgba(14,165,164,0.12)',
    transform: 'scale(1.03)',
  },
  toggleIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center' as const,
  },
  checkMark: {
    position: 'absolute' as const,
    top: 12,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#0EA5A4',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },

  /* ---- expanded details ---- */
  detailsOuter: {
    overflow: 'hidden',
    transition:
      'max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s ease, margin-top 0.4s ease',
  },
  detailsCard: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 16,
    padding: '28px 24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  detailsHeading: {
    fontSize: 17,
    fontWeight: 600,
    color: '#0F172A',
    margin: '0 0 20px',
    fontFamily: 'system-ui, Inter, sans-serif',
  },

  /* ---- form fields ---- */
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    marginBottom: 6,
  },
  labelIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    fontFamily: 'system-ui, Inter, sans-serif',
    borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.9)',
    color: '#0F172A',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxSizing: 'border-box' as const,
  },
  inputFocus: {
    borderColor: '#0EA5A4',
    boxShadow: '0 0 0 3px rgba(14,165,164,0.12)',
  },
  dateRow: {
    display: 'flex',
    gap: 14,
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
    color: '#0F172A',
    background: 'linear-gradient(135deg, #0EA5A4 0%, #0D9695 100%)',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'system-ui, Inter, sans-serif',
    boxShadow: '0 4px 20px rgba(14,165,164,0.25)',
    transition: 'transform 0.25s, box-shadow 0.25s, opacity 0.3s',
  },
};

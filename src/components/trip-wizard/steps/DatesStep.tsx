'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: string, b: string): boolean {
  return a === b;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DatesStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<string | null>(data?.tripDates?.start || null);
  const [endDate, setEndDate] = useState<string | null>(data?.tripDates?.end || null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goToPrev = useCallback(() => {
    if (!canGoPrev || isAnimating) return;
    setSlideDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
      else setViewMonth(m => m - 1);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [canGoPrev, isAnimating, viewMonth]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setSlideDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [isAnimating, viewMonth]);

  /* Calculate duration */
  const duration = startDate && endDate
    ? (() => {
        const s = parseDateStr(startDate);
        const e = parseDateStr(endDate);
        const diffMs = e.getTime() - s.getTime();
        const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
        const nights = days - 1;
        return { days, nights };
      })()
    : null;

  /* Sync to parent */
  useEffect(() => {
    if (startDate && endDate) {
      onUpdate('tripDates', { start: startDate, end: endDate });
      if (duration) onUpdate('duration', { days: duration.days, nights: duration.nights });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      // Fresh selection
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      // Picking end date
      if (dateStr < startDate) {
        setStartDate(dateStr);
        setEndDate(null);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  /* Calendar grid helpers */
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const isDatePast = (dateStr: string) => dateStr < todayStr;

  const isInRange = (dateStr: string) => {
    if (startDate && endDate) return dateStr >= startDate && dateStr <= endDate;
    if (startDate && hoverDate && !endDate) {
      const lo = hoverDate >= startDate ? startDate : hoverDate;
      const hi = hoverDate >= startDate ? hoverDate : startDate;
      return dateStr >= lo && dateStr <= hi;
    }
    return false;
  };

  const isRangeStart = (dateStr: string) => startDate ? isSameDay(dateStr, startDate) : false;
  const isRangeEnd = (dateStr: string) => endDate ? isSameDay(dateStr, endDate) : false;
  const isToday = (dateStr: string) => isSameDay(dateStr, todayStr);

  const renderCalendarCells = () => {
    const cells: React.ReactNode[] = [];

    /* Empty leading cells */
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={{ aspectRatio: '1' }} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(viewYear, viewMonth, d);
      const past = isDatePast(dateStr);
      const inRange = isInRange(dateStr);
      const rangeStart = isRangeStart(dateStr);
      const rangeEnd = isRangeEnd(dateStr);
      const todayCell = isToday(dateStr);
      const selected = rangeStart || rangeEnd;

      cells.push(
        <div
          key={dateStr}
          onMouseEnter={() => { if (!past && startDate && !endDate) setHoverDate(dateStr); }}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => { if (!past) handleDateClick(dateStr); }}
          style={{
            position: 'relative',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: past ? 'default' : 'pointer',
            borderRadius: selected ? '50%' : inRange ? '0' : '50%',
            background: selected
              ? '#0EA5A4'
              : inRange
              ? 'rgba(14, 165, 164, 0.12)'
              : 'transparent',
            color: past
              ? '#cbd5e1'
              : selected
              ? '#fff'
              : todayCell
              ? '#0EA5A4'
              : '#1e293b',
            fontWeight: selected || todayCell ? 700 : 500,
            fontSize: '0.9rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none' as const,
            ...(inRange && !selected
              ? {
                  borderRadius:
                    rangeStart || (d === 1) || (new Date(viewYear, viewMonth, d).getDay() === 0)
                      ? '50% 0 0 50%'
                      : rangeEnd || (d === daysInMonth) || (new Date(viewYear, viewMonth, d).getDay() === 6)
                      ? '0 50% 50% 0'
                      : '0',
                }
              : {}),
          }}
        >
          {/* Today indicator dot */}
          {todayCell && !selected && (
            <span
              style={{
                position: 'absolute',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#0EA5A4',
              }}
            />
          )}
          {d}
        </div>,
      );
    }

    return cells;
  };

  const isValid = !!startDate && !!endDate;

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
          Step 3
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 8,
          }}
        >
          When are you travelling?
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
          Select your travel dates
        </p>
      </div>

      {/* Calendar Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
          padding: '24px 20px',
          overflow: 'hidden',
        }}
      >
        {/* Month Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <button
            onClick={goToPrev}
            disabled={!canGoPrev || isAnimating}
            aria-label="Previous month"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: 'none',
              background: canGoPrev ? 'rgba(14, 165, 164, 0.08)' : 'transparent',
              color: canGoPrev ? '#0EA5A4' : '#cbd5e1',
              cursor: canGoPrev ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            ‹
          </button>

          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>

          <button
            onClick={goToNext}
            disabled={isAnimating}
            aria-label="Next month"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: 'none',
              background: 'rgba(14, 165, 164, 0.08)',
              color: '#0EA5A4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
          >
            ›
          </button>
        </div>

        {/* Day-of-week headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
            marginBottom: 6,
          }}
        >
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.06em',
                padding: '4px 0',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          ref={calendarRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2,
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating
              ? slideDirection === 'left'
                ? 'translateX(-16px)'
                : 'translateX(16px)'
              : 'translateX(0)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderCalendarCells()}
        </div>
      </div>

      {/* Duration Display */}
      <div
        style={{
          marginTop: 20,
          width: '100%',
          maxWidth: 420,
          opacity: isValid ? 1 : 0,
          transform: isValid ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isValid ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(14, 165, 164, 0.07)',
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            border: '1px solid rgba(14, 165, 164, 0.15)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0EA5A4' }}>
              {duration?.days ?? '—'}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              days
            </span>
          </div>
          <div
            style={{
              width: 1,
              height: 32,
              background: 'rgba(14, 165, 164, 0.2)',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0EA5A4' }}>
              {duration?.nights ?? '—'}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              nights
            </span>
          </div>
        </div>

        {/* Date Labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
            padding: '0 4px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              Check-in
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A' }}>
              {startDate
                ? parseDateStr(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              Check-out
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A' }}>
              {endDate
                ? parseDateStr(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 32,
          width: '100%',
          maxWidth: 420,
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
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          style={{
            flex: 2,
            padding: '16px 24px',
            borderRadius: 14,
            border: 'none',
            background: isValid
              ? 'linear-gradient(135deg, #0EA5A4 0%, #0d9695 100%)'
              : '#e2e8f0',
            color: isValid ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: isValid ? 'pointer' : 'default',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isValid ? '0 4px 20px rgba(14, 165, 164, 0.3)' : 'none',
            transform: isValid ? 'scale(1)' : 'scale(0.98)',
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

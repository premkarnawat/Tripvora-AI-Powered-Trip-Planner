'use client';

import React from 'react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function WizardProgress({ currentStep, totalSteps, labels }: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{
      padding: '20px 32px 0',
      background: 'transparent',
    }}>
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: 4,
        background: 'rgba(0,0,0,0.06)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #0EA5A4, #14b8a6)',
          borderRadius: 4,
          transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>

      {/* Step Indicators */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        overflowX: 'auto',
        paddingBottom: 8,
        scrollbarWidth: 'none',
      }}>
        {labels.map((label, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isFuture = i > currentStep;

          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              {/* Dot */}
              <div style={{
                width: isCurrent ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: isCompleted
                  ? '#0EA5A4'
                  : isCurrent
                    ? 'linear-gradient(90deg, #0EA5A4, #14b8a6)'
                    : 'rgba(0,0,0,0.08)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />

              {/* Label (only show current on mobile, all on desktop) */}
              {isCurrent && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#0EA5A4',
                  whiteSpace: 'nowrap',
                  marginLeft: 4,
                }}>
                  {label}
                </span>
              )}
            </div>
          );
        })}

        <span style={{
          fontSize: 12,
          color: '#94a3b8',
          marginLeft: 'auto',
          flexShrink: 0,
          fontWeight: 500,
        }}>
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}

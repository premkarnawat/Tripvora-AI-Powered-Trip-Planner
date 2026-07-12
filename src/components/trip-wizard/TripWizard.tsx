'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { OriginStep } from './steps/OriginStep';
import { DestinationStep } from './steps/DestinationStep';
import { DatesStep } from './steps/DatesStep';
import { TransportStep } from './steps/TransportStep';
import { HotelStep } from './steps/HotelStep';
import { TravelersStep } from './steps/TravelersStep';
import { BudgetStep } from './steps/BudgetStep';
import { PaceStep } from './steps/PaceStep';
import { InterestsStep } from './steps/InterestsStep';
import { FoodStep } from './steps/FoodStep';
import { HotelPrefStep } from './steps/HotelPrefStep';
import { MustVisitStep } from './steps/MustVisitStep';
import { WizardProgress } from './WizardProgress';
import { InfoPanel } from './InfoPanel';

export interface WizardData {
  // Step 1
  source: string;
  sourceCoords: { lat: number; lon: number } | null;
  // Step 2
  destination: string;
  destinationCoords: { lat: number; lon: number } | null;
  destinationType: string;
  // Step 3
  tripDates: { start: string; end: string };
  duration: { days: number; nights: number };
  // Step 4
  hasTransport: boolean;
  transport: {
    type: string;
    arrival: { date: string; time: string; from: string; to: string };
    departure: { date: string; time: string };
  } | null;
  // Step 5
  hasHotel: boolean;
  hotel: { name: string; address: string; checkIn: string; checkOut: string } | null;
  // Step 6
  travelType: string;
  members: { adults: number; children: number; seniors: number; boys: number; girls: number };
  // Step 7
  budget: number;
  budgetMode: string;
  // Step 8
  pace: string;
  // Step 9
  interests: string[];
  // Step 10
  foodPreference: string[];
  // Step 11
  hotelPreference: string[];
  // Step 12
  mustVisit: Array<{ name: string; preferredDay: string; priority: string }>;
}

const INITIAL_DATA: WizardData = {
  source: '',
  sourceCoords: null,
  destination: '',
  destinationCoords: null,
  destinationType: '',
  tripDates: { start: '', end: '' },
  duration: { days: 0, nights: 0 },
  hasTransport: false,
  transport: null,
  hasHotel: false,
  hotel: null,
  travelType: '',
  members: { adults: 2, children: 0, seniors: 0, boys: 0, girls: 0 },
  budget: 50000,
  budgetMode: 'balanced',
  pace: 'balanced',
  interests: [],
  foodPreference: [],
  hotelPreference: [],
  mustVisit: [],
};

const STEP_LABELS = [
  'Origin',
  'Destination',
  'Dates',
  'Transport',
  'Hotel',
  'Travelers',
  'Budget',
  'Style',
  'Interests',
  'Food',
  'Stay',
  'Must Visit',
];

interface TripWizardProps {
  onComplete: (data: WizardData) => void;
}

export function TripWizard({ onComplete }: TripWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tripvora_wizard_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({ ...prev, ...parsed.data }));
        setCurrentStep(parsed.step || 0);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tripvora_wizard_progress', JSON.stringify({ data, step: currentStep }));
  }, [data, currentStep]);

  const handleUpdate = useCallback((field: string, value: any) => {
    setData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      // Support nested updates like 'members.adults'
      const newData = { ...prev };
      let obj: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('forward');

    if (currentStep === STEP_LABELS.length - 1) {
      onComplete(data);
      return;
    }

    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, STEP_LABELS.length - 1));
      setIsAnimating(false);
    }, 300);
  }, [currentStep, data, isAnimating, onComplete]);

  const handleBack = useCallback(() => {
    if (isAnimating || currentStep === 0) return;
    setIsAnimating(true);
    setDirection('backward');

    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      setIsAnimating(false);
    }, 300);
  }, [currentStep, isAnimating]);

  const stepProps = { data, onUpdate: handleUpdate, onNext: handleNext, onBack: handleBack };

  const STEPS = [
    <OriginStep key="origin" {...stepProps} />,
    <DestinationStep key="dest" {...stepProps} />,
    <DatesStep key="dates" {...stepProps} />,
    <TransportStep key="transport" {...stepProps} />,
    <HotelStep key="hotel" {...stepProps} />,
    <TravelersStep key="travelers" {...stepProps} />,
    <BudgetStep key="budget" {...stepProps} />,
    <PaceStep key="pace" {...stepProps} />,
    <InterestsStep key="interests" {...stepProps} />,
    <FoodStep key="food" {...stepProps} />,
    <HotelPrefStep key="hotelpref" {...stepProps} />,
    <MustVisitStep key="mustvisit" {...stepProps} />,
  ];

  const estimatedMinutes = Math.max(1, Math.ceil((STEP_LABELS.length - currentStep) * 0.4));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Bar */}
      <div style={{
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5 }}>
            Tripvora
          </span>
          <span style={{
            fontSize: 12,
            color: '#0EA5A4',
            background: 'rgba(14,165,164,0.08)',
            padding: '4px 10px',
            borderRadius: 20,
            fontWeight: 600,
          }}>
            Trip Planner
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            ~{estimatedMinutes} min remaining
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('tripvora_wizard_progress');
              setData(INITIAL_DATA);
              setCurrentStep(0);
            }}
            style={{
              fontSize: 13,
              color: '#94a3b8',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Progress */}
      <WizardProgress
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        labels={STEP_LABELS}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        gap: 32,
      }}>
        {/* Left: Step Content */}
        <div style={{
          flex: '1 1 60%',
          minWidth: 0,
          position: 'relative',
        }}>
          <div
            key={currentStep}
            style={{
              animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {STEPS[currentStep]}
          </div>
        </div>

        {/* Right: Info Panel (hidden on mobile) */}
        <div style={{
          flex: '0 0 340px',
          display: 'none',
        }}
          className="info-panel-container"
        >
          <InfoPanel currentStep={currentStep} data={data} />
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (min-width: 1024px) {
          .info-panel-container {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

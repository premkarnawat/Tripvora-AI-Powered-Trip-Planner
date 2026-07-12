'use client';

import React from 'react';

interface InfoPanelProps {
  currentStep: number;
  data: any;
}

const STEP_INFO: Record<number, {
  title: string;
  icon: string;
  tips: string[];
  fact?: string;
}> = {
  0: {
    title: 'Starting Point',
    icon: '📍',
    tips: [
      'Choose your nearest city for accurate transport estimates',
      'We\'ll calculate distances and fares from here',
      'You can also use your current location',
    ],
    fact: 'Most Indian travelers start their trips from metro cities',
  },
  1: {
    title: 'Destination',
    icon: '🗺️',
    tips: [
      'Search for any place — cities, temples, beaches, mountains',
      'You can search for a specific attraction like "Statue of Unity"',
      'If you select a state, we\'ll help you choose the best route',
    ],
    fact: 'Goa, Jaipur, and Manali are India\'s most searched destinations',
  },
  2: {
    title: 'Travel Dates',
    icon: '📅',
    tips: [
      'Weekday trips often have better hotel rates',
      'Consider weather and festival seasons',
      'We\'ll auto-calculate your trip duration',
    ],
  },
  3: {
    title: 'Transport',
    icon: '✈️',
    tips: [
      'If you\'ve already booked, we\'ll plan around your timings',
      'Your arrival time affects Day 1 itinerary start',
      'Departure time determines when Day N ends',
    ],
    fact: 'Pre-booked transport helps us create more accurate itineraries',
  },
  4: {
    title: 'Accommodation',
    icon: '🏨',
    tips: [
      'Pre-booked hotels become the base for your itinerary',
      'If not booked, our AI recommends the best options',
      'Hotel location affects nearby attraction planning',
    ],
  },
  5: {
    title: 'Travel Crew',
    icon: '👥',
    tips: [
      'Group composition affects attraction recommendations',
      'Family trips prioritize kid-friendly and safe places',
      'Solo trips focus on must-see attractions and local experiences',
    ],
  },
  6: {
    title: 'Budget Planning',
    icon: '💰',
    tips: [
      'Budget includes hotels, food, activities & local transport',
      'Strict mode ensures we never exceed your limit',
      'Flexible mode optimizes for the best experience',
    ],
  },
  7: {
    title: 'Travel Style',
    icon: '⚡',
    tips: [
      'Slow: Perfect for relaxation and deep exploration',
      'Balanced: The most popular choice — see the highlights',
      'Explorer: Maximum sightseeing for adventure lovers',
    ],
    fact: '68% of travelers prefer the Balanced pace',
  },
  8: {
    title: 'Your Interests',
    icon: '✨',
    tips: [
      'Selected interests directly influence attraction ranking',
      'Hidden Gems shows you off-the-beaten-path spots',
      'The more you select, the more personalized your trip',
    ],
  },
  9: {
    title: 'Food Preferences',
    icon: '🍽️',
    tips: [
      'We only recommend restaurants matching your diet',
      'Temple towns automatically prefer vegetarian options',
      'Multiple selections are supported',
    ],
    fact: 'We verify restaurant menus against your preferences',
  },
  10: {
    title: 'Stay Preference',
    icon: '🛏️',
    tips: [
      'Hotel recommendations are filtered by your preference',
      'Beachfront and Resort options are destination-dependent',
      'Budget stays are always verified for safety and ratings',
    ],
  },
  11: {
    title: 'Must-Visit Places',
    icon: '📌',
    tips: [
      'Mandatory places are always included in the itinerary',
      'We\'ll calculate feasibility and travel time automatically',
      'Preferred day helps us optimize the route',
    ],
    fact: 'This step is optional — skip if you want AI to decide everything',
  },
};

export function InfoPanel({ currentStep, data }: InfoPanelProps) {
  const info = STEP_INFO[currentStep] || STEP_INFO[0];

  return (
    <div style={{
      position: 'sticky',
      top: 100,
    }}>
      {/* Main Info Card */}
      <div style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.06)',
        padding: 28,
        boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize: 40,
          marginBottom: 16,
        }}>
          {info.icon}
        </div>

        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: 16,
          letterSpacing: -0.3,
        }}>
          {info.title}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {info.tips.map((tip, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#0EA5A4',
                marginTop: 7,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 13,
                color: '#475569',
                lineHeight: 1.5,
              }}>
                {tip}
              </span>
            </div>
          ))}
        </div>

        {info.fact && (
          <div style={{
            marginTop: 20,
            padding: '14px 16px',
            background: 'rgba(14,165,164,0.06)',
            borderRadius: 12,
            borderLeft: '3px solid #0EA5A4',
          }}>
            <span style={{
              fontSize: 12,
              color: '#0EA5A4',
              fontWeight: 600,
              display: 'block',
              marginBottom: 4,
            }}>
              💡 Did you know?
            </span>
            <span style={{
              fontSize: 13,
              color: '#334155',
              lineHeight: 1.5,
            }}>
              {info.fact}
            </span>
          </div>
        )}
      </div>

      {/* Trip Summary Card (appears after step 2) */}
      {currentStep >= 2 && (data.source || data.destination) && (
        <div style={{
          marginTop: 16,
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.06)',
          padding: 20,
          boxShadow: '0 4px 32px rgba(0,0,0,0.04)',
        }}>
          <h4 style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 14,
          }}>
            Your Trip
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.source && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>From</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{data.source}</span>
              </div>
            )}
            {data.destination && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>To</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{data.destination}</span>
              </div>
            )}
            {data.duration?.days > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Duration</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>
                  {data.duration.days} days, {data.duration.nights} nights
                </span>
              </div>
            )}
            {data.travelType && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Type</span>
                <span style={{ color: '#0F172A', fontWeight: 600, textTransform: 'capitalize' }}>
                  {data.travelType}
                </span>
              </div>
            )}
            {data.budget > 0 && currentStep >= 7 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Budget</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>
                  ₹{data.budget.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

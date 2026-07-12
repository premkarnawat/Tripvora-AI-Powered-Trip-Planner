'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    county?: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Popular Cities                                                     */
/* ------------------------------------------------------------------ */

const POPULAR_CITIES: { name: string; lat: number; lon: number }[] = [
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function OriginStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [query, setQuery] = useState<string>(data?.source || '');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(!!data?.source);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ---------- Nominatim search with debounce ---------- */

  const searchPlaces = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const json: NominatimResult[] = await res.json();
      setSuggestions(json);
      setIsOpen(json.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelected(false);
    onUpdate('source', '');
    onUpdate('sourceCoords', null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  };

  /* ---------- Select a suggestion ---------- */

  const selectPlace = (result: NominatimResult) => {
    const cityName =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.display_name.split(',')[0];
    setQuery(cityName);
    setSelected(true);
    setSuggestions([]);
    setIsOpen(false);
    onUpdate('source', cityName);
    onUpdate('sourceCoords', {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    });
  };

  /* ---------- Popular city click ---------- */

  const selectPopularCity = (city: (typeof POPULAR_CITIES)[number]) => {
    setQuery(city.name);
    setSelected(true);
    onUpdate('source', city.name);
    onUpdate('sourceCoords', { lat: city.lat, lon: city.lon });
    // auto-advance after short delay for visual feedback
    setTimeout(() => onNext(), 350);
  };

  /* ---------- Geolocation ---------- */

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const json = await res.json();
          const cityName =
            json.address?.city ||
            json.address?.town ||
            json.address?.village ||
            json.address?.county ||
            'Your Location';
          setQuery(cityName);
          setSelected(true);
          onUpdate('source', cityName);
          onUpdate('sourceCoords', { lat: latitude, lon: longitude });
        } catch {
          setGeoError('Could not determine your city.');
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoError('Location access denied. Please enable permissions.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ---------- Helpers ---------- */

  const formatSuggestion = (r: NominatimResult) => {
    const city =
      r.address?.city || r.address?.town || r.address?.village || '';
    const state = r.address?.state || '';
    const country = r.address?.country || '';
    const parts = [city, state, country].filter(Boolean);
    return {
      primary: parts[0] || r.display_name.split(',')[0],
      secondary: parts.slice(1).join(', '),
    };
  };

  const isDisabled = !selected || !data?.source;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.5s cubic-bezier(.16,1,.3,1), transform 0.5s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* ---- Header ---- */}
      <div style={{ marginBottom: 8 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: 0,
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          }}
        >
          Where are you starting from?
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            marginTop: 8,
            fontWeight: 500,
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          }}
        >
          We&rsquo;ll plan your journey from here
        </p>
      </div>

      {/* ---- Search input ---- */}
      <div style={{ position: 'relative', marginTop: 28 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0,0,0,0.03)',
            border: selected
              ? '1.5px solid rgba(14,165,164,0.6)'
              : '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            padding: '14px 18px',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            boxShadow: selected
              ? '0 0 0 3px rgba(14,165,164,0.12)'
              : 'none',
          }}
        >
          <SearchIcon className="" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your city..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#0F172A',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
            }}
          />
          {isLoading && (
            <SpinnerIcon
              className=""
            />
          )}
        </div>

        {/* ---- Autocomplete dropdown ---- */}
        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'rgba(15,23,42,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              overflow: 'hidden',
              zIndex: 50,
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              animation: 'originDropIn 0.2s ease-out',
            }}
          >
            {suggestions.map((s, i) => {
              const { primary, secondary } = formatSuggestion(s);
              return (
                <button
                  key={s.place_id}
                  onClick={() => selectPlace(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '14px 18px',
                    border: 'none',
                    borderBottom:
                      i < suggestions.length - 1
                        ? '1px solid rgba(255,255,255,0.06)'
                        : 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                    color: '#0F172A',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(14,165,164,0.08)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <MapPinIcon className="" />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#0F172A',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily:
                          'system-ui, Inter, -apple-system, sans-serif',
                      }}
                    >
                      {primary}
                    </div>
                    {secondary && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'rgba(100,116,139,1)',
                          marginTop: 2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily:
                            'system-ui, Inter, -apple-system, sans-serif',
                        }}
                      >
                        {secondary}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Use Current Location ---- */}
      <button
        onClick={useCurrentLocation}
        disabled={geoLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 16,
          padding: '10px 18px',
          background: 'rgba(14,165,164,0.08)',
          border: '1px solid rgba(14,165,164,0.2)',
          borderRadius: 12,
          cursor: geoLoading ? 'wait' : 'pointer',
          color: '#0EA5A4',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          transition: 'all 0.2s ease',
          width: 'fit-content',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(14,165,164,0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(14,165,164,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {geoLoading ? (
          <SpinnerIcon className="" />
        ) : (
          <CrosshairIcon className="" />
        )}
        {geoLoading ? 'Detecting location...' : 'Use Current Location'}
      </button>

      {geoError && (
        <p
          style={{
            fontSize: 12,
            color: '#f87171',
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          {geoError}
        </p>
      )}

      {/* ---- Popular Cities ---- */}
      <div style={{ marginTop: 32 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 14,
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          }}
        >
          Popular Cities
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {POPULAR_CITIES.map((city, i) => (
            <button
              key={city.name}
              onClick={() => selectPopularCity(city)}
              style={{
                padding: '9px 18px',
                borderRadius: 100,
                border: '1px solid rgba(0,0,0,0.08)',
                background:
                  data?.source === city.name
                    ? 'rgba(14,165,164,0.18)'
                    : 'rgba(255,255,255,0.04)',
                color:
                  data?.source === city.name
                    ? '#0EA5A4'
                    : 'rgba(51,65,85,1)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
                borderColor:
                  data?.source === city.name
                    ? 'rgba(14,165,164,0.4)'
                    : 'rgba(0,0,0,0.08)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: `${i * 40 + 200}ms`,
              }}
              onMouseEnter={(e) => {
                if (data?.source !== city.name) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (data?.source !== city.name) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Continue button ---- */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={onNext}
          disabled={isDisabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 32px',
            borderRadius: 14,
            border: 'none',
            background: isDisabled
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg, #0EA5A4, #0d9695)',
            color: isDisabled ? 'rgba(255,255,255,0.25)' : '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: isDisabled
              ? 'none'
              : '0 4px 20px rgba(14,165,164,0.3)',
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow =
                '0 6px 28px rgba(14,165,164,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (!isDisabled) {
              e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(14,165,164,0.3)';
            }
          }}
        >
          Continue
          <ChevronRightIcon className="" />
        </button>
      </div>

      {/* ---- Keyframes injected once ---- */}
      <style>{`
        @keyframes originDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes originSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

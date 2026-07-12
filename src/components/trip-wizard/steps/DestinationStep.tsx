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
  type: string;
  class: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    county?: string;
    state_district?: string;
    tourism?: string;
    natural?: string;
  };
  addresstype?: string;
}

/* ------------------------------------------------------------------ */
/*  Trending destinations                                              */
/* ------------------------------------------------------------------ */

const TRENDING: {
  name: string;
  emoji: string;
  lat: number;
  lon: number;
  type: string;
}[] = [
  { name: 'Goa', emoji: '🏖️', lat: 15.2993, lon: 74.124, type: 'state' },
  { name: 'Jaipur', emoji: '🏰', lat: 26.9124, lon: 75.7873, type: 'city' },
  { name: 'Manali', emoji: '🏔️', lat: 32.2396, lon: 77.1887, type: 'city' },
  { name: 'Kerala', emoji: '🌴', lat: 10.8505, lon: 76.2711, type: 'state' },
  { name: 'Udaipur', emoji: '🪷', lat: 24.5854, lon: 73.7125, type: 'city' },
  { name: 'Rishikesh', emoji: '🧘', lat: 30.0869, lon: 78.2676, type: 'city' },
  { name: 'Andaman', emoji: '🐚', lat: 11.7401, lon: 92.6586, type: 'island' },
  { name: 'Ladakh', emoji: '🏔️', lat: 34.1526, lon: 77.577, type: 'region' },
];

/* ------------------------------------------------------------------ */
/*  Type detection helpers                                             */
/* ------------------------------------------------------------------ */

type DestType =
  | 'city'
  | 'state'
  | 'country'
  | 'beach'
  | 'mountain'
  | 'island'
  | 'temple'
  | 'attraction'
  | 'region'
  | 'place';

function detectType(r: NominatimResult): DestType {
  const t = (r.type || '').toLowerCase();
  const c = (r.class || '').toLowerCase();
  const at = (r.addresstype || '').toLowerCase();

  if (at === 'state' || t === 'state' || t === 'administrative' && r.address?.state && !r.address?.city)
    return 'state';
  if (at === 'country' || t === 'country') return 'country';
  if (t === 'island' || t === 'archipelago') return 'island';
  if (t === 'beach' || t === 'coastline') return 'beach';
  if (t === 'peak' || t === 'mountain' || t === 'mountain_range' || t === 'volcano') return 'mountain';
  if (c === 'tourism' || t === 'attraction' || t === 'museum' || t === 'monument')
    return 'attraction';
  if (t === 'place_of_worship' || t === 'temple') return 'temple';
  if (
    at === 'city' ||
    at === 'town' ||
    at === 'village' ||
    t === 'city' ||
    t === 'town' ||
    t === 'village'
  )
    return 'city';
  return 'place';
}

function getTypeLabel(dt: DestType): string {
  const map: Record<DestType, string> = {
    city: 'City',
    state: 'State / Province',
    country: 'Country',
    beach: 'Beach',
    mountain: 'Mountain',
    island: 'Island',
    temple: 'Temple / Shrine',
    attraction: 'Attraction',
    region: 'Region',
    place: 'Place',
  };
  return map[dt];
}

function getTypeIcon(dt: DestType): string {
  const map: Record<DestType, string> = {
    city: '🏙️',
    state: '🗺️',
    country: '🌍',
    beach: '🏖️',
    mountain: '🏔️',
    island: '🏝️',
    temple: '🛕',
    attraction: '🎯',
    region: '📍',
    place: '📌',
  };
  return map[dt];
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function SearchIcon() {
  return (
    <svg
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

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
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

function SpinnerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: 'destSpin 0.8s linear infinite' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  State exploration sub-question                                     */
/* ------------------------------------------------------------------ */

type StateExploreOption = 'entire' | 'one_city' | 'ai_recommend';

interface StateExploreProps {
  stateName: string;
  selected: StateExploreOption | null;
  onSelect: (opt: StateExploreOption) => void;
}

function StateExplorePanel({ stateName, selected, onSelect }: StateExploreProps) {
  const options: { key: StateExploreOption; icon: string; label: string; desc: string }[] = [
    {
      key: 'entire',
      icon: '🗺️',
      label: 'Entire State',
      desc: `Explore all of ${stateName}`,
    },
    {
      key: 'one_city',
      icon: '🏙️',
      label: 'One City',
      desc: 'Pick a specific city to visit',
    },
    {
      key: 'ai_recommend',
      icon: '✨',
      label: 'AI Recommend Best Route',
      desc: 'Let AI plan the perfect route',
    },
  ];

  return (
    <div
      style={{
        marginTop: 20,
        background: 'rgba(14,165,164,0.04)',
        border: '1px solid rgba(14,165,164,0.15)',
        borderRadius: 16,
        padding: 20,
        animation: 'destDropIn 0.3s ease-out',
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#0EA5A4',
          marginBottom: 14,
          fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
        }}
      >
        How would you like to explore {stateName}?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 16px',
              borderRadius: 12,
              border:
                selected === opt.key
                  ? '1.5px solid rgba(14,165,164,0.5)'
                  : '1.5px solid rgba(0,0,0,0.06)',
              background:
                selected === opt.key
                  ? 'rgba(14,165,164,0.12)'
                  : 'rgba(0,0,0,0.02)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              color: '#0F172A',
            }}
            onMouseEnter={(e) => {
              if (selected !== opt.key) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== opt.key) {
                e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              }
            }}
          >
            <span style={{ fontSize: 22 }}>{opt.icon}</span>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: selected === opt.key ? '#0EA5A4' : '#fff',
                  fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
                }}
              >
                {opt.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(100,116,139,1)',
                  marginTop: 2,
                  fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
                }}
              >
                {opt.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function DestinationStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [query, setQuery] = useState<string>(data?.destination || '');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(!!data?.destination);
  const [detectedType, setDetectedType] = useState<DestType | null>(
    data?.destinationType || null
  );
  const [stateExplore, setStateExplore] = useState<StateExploreOption | null>(
    null
  );
  const [stateName, setStateName] = useState('');

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
    setDetectedType(null);
    setStateExplore(null);
    onUpdate('destination', '');
    onUpdate('destinationCoords', null);
    onUpdate('destinationType', '');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  };

  /* ---------- Select a suggestion ---------- */

  const selectPlace = (result: NominatimResult) => {
    const dt = detectType(result);
    const name =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.state ||
      result.address?.country ||
      result.display_name.split(',')[0];

    setQuery(name);
    setSelected(true);
    setDetectedType(dt);
    setSuggestions([]);
    setIsOpen(false);

    onUpdate('destination', name);
    onUpdate('destinationCoords', {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
    });
    onUpdate('destinationType', dt);

    if (dt === 'state') {
      setStateName(name);
      setStateExplore(null);
    } else {
      setStateExplore(null);
      setStateName('');
    }
  };

  /* ---------- Trending destination click ---------- */

  const selectTrending = (t: (typeof TRENDING)[number]) => {
    setQuery(t.name);
    setSelected(true);
    setDetectedType(t.type as DestType);
    onUpdate('destination', t.name);
    onUpdate('destinationCoords', { lat: t.lat, lon: t.lon });
    onUpdate('destinationType', t.type);

    if (t.type === 'state') {
      setStateName(t.name);
      setStateExplore(null);
    } else {
      setStateName('');
      setStateExplore(null);
    }
  };

  /* ---------- State explore option ---------- */

  const handleStateExplore = (opt: StateExploreOption) => {
    setStateExplore(opt);
    onUpdate('stateExploreMode', opt);
  };

  /* ---------- Helpers ---------- */

  const formatSuggestion = (r: NominatimResult) => {
    const dt = detectType(r);
    const name =
      r.address?.city ||
      r.address?.town ||
      r.address?.village ||
      r.address?.state ||
      r.address?.country ||
      r.display_name.split(',')[0];
    const parts = r.display_name.split(',').map((s) => s.trim());
    const parentParts = parts.slice(1, 3);
    return {
      icon: getTypeIcon(dt),
      name,
      typeLabel: getTypeLabel(dt),
      parent: parentParts.join(', '),
      detectedType: dt,
    };
  };

  const canContinue =
    selected &&
    data?.destination &&
    (detectedType !== 'state' || stateExplore !== null);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition:
          'opacity 0.5s cubic-bezier(.16,1,.3,1), transform 0.5s cubic-bezier(.16,1,.3,1)',
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
          Where do you want to travel?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(100,116,139,1)',
            marginTop: 8,
            fontWeight: 500,
            lineHeight: 1.5,
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          }}
        >
          Search any city, attraction, temple, beach, mountain, island, country
          or region…
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
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder="Try 'Goa', 'Taj Mahal', 'Kerala', 'Ladakh'..."
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
          {isLoading && <SpinnerIcon />}
          {selected && detectedType && (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(14,165,164,0.15)',
                color: '#0EA5A4',
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
              }}
            >
              {getTypeIcon(detectedType)} {getTypeLabel(detectedType)}
            </span>
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
              animation: 'destDropIn 0.2s ease-out',
            }}
          >
            {suggestions.map((s, i) => {
              const fmt = formatSuggestion(s);
              return (
                <button
                  key={s.place_id}
                  onClick={() => selectPlace(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
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
                    (e.currentTarget.style.background =
                      'rgba(14,165,164,0.08)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <span style={{ fontSize: 20 }}>{fmt.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#0F172A',
                          fontFamily:
                            'system-ui, Inter, -apple-system, sans-serif',
                        }}
                      >
                        {fmt.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'rgba(94,234,212,0.7)',
                          background: 'rgba(14,165,164,0.1)',
                          padding: '2px 7px',
                          borderRadius: 6,
                          whiteSpace: 'nowrap',
                          fontFamily:
                            'system-ui, Inter, -apple-system, sans-serif',
                        }}
                      >
                        {fmt.typeLabel}
                      </span>
                    </div>
                    {fmt.parent && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.35)',
                          marginTop: 3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily:
                            'system-ui, Inter, -apple-system, sans-serif',
                        }}
                      >
                        {fmt.parent}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- State exploration sub-question ---- */}
      {detectedType === 'state' && stateName && (
        <StateExplorePanel
          stateName={stateName}
          selected={stateExplore}
          onSelect={handleStateExplore}
        />
      )}

      {/* ---- Trending destinations ---- */}
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
          🔥 Trending Destinations
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {TRENDING.map((t, i) => (
            <button
              key={t.name}
              onClick={() => selectTrending(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 100,
                border:
                  data?.destination === t.name
                    ? '1px solid rgba(14,165,164,0.4)'
                    : '1px solid rgba(0,0,0,0.08)',
                background:
                  data?.destination === t.name
                    ? 'rgba(14,165,164,0.18)'
                    : 'rgba(255,255,255,0.04)',
                color:
                  data?.destination === t.name
                    ? '#0EA5A4'
                    : 'rgba(51,65,85,1)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: `${i * 40 + 200}ms`,
              }}
              onMouseEnter={(e) => {
                if (data?.destination !== t.name) {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (data?.destination !== t.name) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ fontSize: 15 }}>{t.emoji}</span>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Navigation buttons ---- */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '12px 20px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'transparent',
            color: 'rgba(71,85,105,1)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(71,85,105,1)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
          }}
        >
          <ArrowLeftIcon />
          Back
        </button>

        {/* Continue */}
        <button
          onClick={onNext}
          disabled={!canContinue}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 32px',
            borderRadius: 14,
            border: 'none',
            background: !canContinue
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg, #0EA5A4, #0d9695)',
            color: !canContinue ? 'rgba(255,255,255,0.25)' : '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: !canContinue ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: !canContinue
              ? 'none'
              : '0 4px 20px rgba(14,165,164,0.3)',
            fontFamily: 'system-ui, Inter, -apple-system, sans-serif',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (canContinue) {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow =
                '0 6px 28px rgba(14,165,164,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            if (canContinue) {
              e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(14,165,164,0.3)';
            }
          }}
        >
          Continue
          <ChevronRightIcon />
        </button>
      </div>

      {/* ---- Keyframes ---- */}
      <style>{`
        @keyframes destDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes destSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

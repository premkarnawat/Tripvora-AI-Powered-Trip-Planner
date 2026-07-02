// Post-processor — strips internal labels, validates fields, cleans AI output

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

// Patterns to strip from all string values (case-insensitive)
const STRIP_PATTERNS: RegExp[] = [
  /TRAVIXA/gi,
  /Travixa/g,
  /Phase\s+\d+/gi,
  /Protocol\s+Triggered/gi,
  /Protocol\s+Activated/gi,
  /\bEngine\b/gi,
  /Forensic\s+GIS/gi,
  /\bValidated\b/gi,
  /\bVerified\b/gi,
  /Operating\s+System/gi,
  /\bV4\b/gi,
  /v4\.0/gi,
  /\bMandate\b/gi,
  /Stage\s+\d+/gi,
];

// Activity-like titles that are generic and should be kept as-is
const GENERIC_ACTIVITY_KEYWORDS = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'check-in',
  'check-out',
  'check in',
  'check out',
  'checkin',
  'checkout',
  'departure',
  'arrival',
  'arrive',
  'depart',
  'transfer',
  'explore',
];

// Keys that should contain numeric values
const NUMERIC_KEYS = new Set([
  'estimatedCost',
  'estimatedcost',
  'rating',
  'lat',
  'lon',
  'latitude',
  'longitude',
  'distanceKm',
  'distancekm',
  'distance',
  'price',
  'cost',
  'budget',
  'day',
  'temperature',
  'rainProbability',
  'durationHours',
  'estimatedFare',
]);

function cleanString(value: string): string {
  let result = value;
  for (const pattern of STRIP_PATTERNS) {
    result = result.replace(pattern, '');
  }
  // Collapse multiple spaces
  result = result.replace(/\s{2,}/g, ' ').trim();
  return result;
}

function isGenericActivity(title: string): boolean {
  const lower = title.toLowerCase();
  return GENERIC_ACTIVITY_KEYWORDS.some((kw) => lower.includes(kw));
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function coerceToNumber(value: JsonValue): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return null;
}

function walkAndClean(
  value: JsonValue,
  key: string | null,
  _realPlaceNames: string[]
): JsonValue {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    // Handle imageUrl fields
    if (
      key !== null &&
      (key.toLowerCase().includes('imageurl') ||
        key.toLowerCase().includes('image_url'))
    ) {
      if (value === '' || !isValidHttpUrl(value)) return null;
      return value;
    }

    // Handle numeric fields stored as strings
    if (key !== null && NUMERIC_KEYS.has(key.toLowerCase())) {
      const num = coerceToNumber(value);
      if (num !== null) return num;
    }

    return cleanString(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, idx) =>
      walkAndClean(item, String(idx), _realPlaceNames)
    );
  }

  if (typeof value === 'object') {
    const obj = value as JsonObject;
    const cleaned: JsonObject = {};

    for (const objKey of Object.keys(obj)) {
      const rawVal = obj[objKey];
      const cleanedVal = walkAndClean(rawVal, objKey, _realPlaceNames);

      // Handle numeric key coercion at the object level
      if (NUMERIC_KEYS.has(objKey.toLowerCase()) && typeof cleanedVal === 'string') {
        const num = coerceToNumber(cleanedVal);
        cleaned[objKey] = num !== null ? num : cleanedVal;
      } else {
        cleaned[objKey] = cleanedVal;
      }
    }

    // For activity objects with a title: validate against real place names
    if (
      'title' in cleaned &&
      typeof cleaned['title'] === 'string'
    ) {
      const title = cleaned['title'];
      const titleLower = title.toLowerCase();
      const isGeneric = isGenericActivity(title);
      const isRealPlace = _realPlaceNames.some(
        (name) =>
          titleLower.includes(name.toLowerCase()) ||
          name.toLowerCase().includes(titleLower)
      );

      // If not a real place and not a generic activity, keep the title
      // but don't add any fake metadata
      if (!isRealPlace && !isGeneric) {
        // Strip any potentially fabricated metadata fields
        delete cleaned['verified'];
        delete cleaned['validated'];
        delete cleaned['source'];
      }
    }

    return cleaned;
  }

  return value;
}

/**
 * Sanitize AI output by stripping internal labels, validating URLs,
 * coercing numeric fields, and ensuring no fabricated metadata.
 */
export function sanitize(
  aiOutput: JsonValue,
  realPlaceNames: string[]
): JsonValue {
  return walkAndClean(aiOutput, null, realPlaceNames);
}

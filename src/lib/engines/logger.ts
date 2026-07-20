// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRIPVORA — Structured Pipeline Logger
// Every stage logs: timestamp, module, status, data count, duration_ms
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type PipelineStage =
  | 'FORM_RECEIVED'
  | 'TRAVELER_DNA'
  | 'GEOCODING'
  | 'ROUTING'
  | 'POI_DISCOVERY'
  | 'HOTELS'
  | 'RESTAURANTS'
  | 'FOOD'
  | 'WEATHER'
  | 'FORECAST'
  | 'WIKI'
  | 'IMAGE'
  | 'TRANSPORT'
  | 'MUST_VISIT'
  | 'PLACE_DETAILS'
  | 'BUDGET'
  | 'CLUSTERING'
  | 'SCHEDULING'
  | 'NARRATIVE'
  | 'GEMINI'
  | 'SANITIZATION'
  | 'IMAGES'
  | 'IMAGE_ENGINE'
  | 'EMERGENCY'
  | 'TRIP_CONTEXT'
  | 'GROUP_ENGINE'
  | 'HIDDEN_GEMS'
  | 'DESTINATION_INTEL'
  | 'COMFORT_ENGINE'
  | 'FINAL_JSON';

export interface PipelineLog {
  stage: string;
  durationMs: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

export function createPipelineLogger() {
  const logs: PipelineLog[] = [];
  
  async function timedStage<T>(stageName: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      logs.push({
        stage: stageName,
        durationMs: Date.now() - start,
        success: true,
        timestamp: new Date().toISOString(),
      });
      return result;
    } catch (err: any) {
      logs.push({
        stage: stageName,
        durationMs: Date.now() - start,
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      throw err;
    }
  }
  
  function getLogs() { return [...logs]; }
  function clear() { logs.length = 0; }
  
  return { timedStage, getLogs, clear };
}

// Keep backward compatibility with the old API
// These use a default global instance (will be replaced per-request in routes)
const defaultLogger = createPipelineLogger();
export const timedStage = defaultLogger.timedStage;
export const getPipelineLogs = defaultLogger.getLogs;
export const clearPipelineLogs = defaultLogger.clear;

export type PipelineLogger = ReturnType<typeof createPipelineLogger>;

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
  | 'BUDGET'
  | 'CLUSTERING'
  | 'SCHEDULING'
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

export interface StageLog {
  timestamp: string;
  stage: PipelineStage;
  status: 'OK' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  dataCount?: number;
  message?: string;
  error?: string;
}

const pipelineLogs: StageLog[] = [];

/**
 * Log a pipeline stage execution result.
 */
export function logStage(
  stage: PipelineStage,
  status: 'OK' | 'FAILED' | 'SKIPPED',
  durationMs: number,
  opts?: { dataCount?: number; message?: string; error?: string }
): void {
  const entry: StageLog = {
    timestamp: new Date().toISOString(),
    stage,
    status,
    durationMs,
    ...opts,
  };
  pipelineLogs.push(entry);
  const icon = status === 'OK' ? '✅' : status === 'FAILED' ? '❌' : '⏭️';
  console.log(
    `[TRIPVORA] ${icon} ${stage} — ${status} — ${durationMs}ms${opts?.dataCount !== undefined ? ` — ${opts.dataCount} items` : ''}${opts?.error ? ` — ${opts.error}` : ''}`
  );
}

/**
 * Convenience: time an async operation and log it.
 */
export async function timedStage<T>(
  stage: PipelineStage,
  fn: () => Promise<T>,
  opts?: { countFn?: (result: T) => number }
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const durationMs = Date.now() - start;
    const dataCount = opts?.countFn ? opts.countFn(result) : undefined;
    logStage(stage, 'OK', durationMs, { dataCount });
    return result;
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const message = err instanceof Error ? err.message : 'Unknown error';
    logStage(stage, 'FAILED', durationMs, { error: message });
    throw err;
  }
}

/**
 * Get all accumulated pipeline logs for inclusion in the final JSON response.
 */
export function getPipelineLogs(): StageLog[] {
  return [...pipelineLogs];
}

/**
 * Clear logs for a new request.
 */
export function clearPipelineLogs(): void {
  pipelineLogs.length = 0;
}

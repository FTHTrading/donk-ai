// =============================================
// STRUCTURED LOGGER
//
// Provides consistent, parseable log output for
// API routes, services, and server-side code.
// JSON-structured in production, human-readable in dev.
// =============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  duration_ms?: number;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry);
  }
  // Dev: human-readable
  const { level, message, context, duration_ms, timestamp: _ts, ...rest } = entry;
  const prefix = context ? `[${context}]` : '';
  const dur = duration_ms !== undefined ? ` (${duration_ms}ms)` : '';
  const extra = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : '';
  return `${level.toUpperCase().padEnd(5)} ${prefix} ${message}${dur}${extra}`;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

/** Create a logger scoped to a context (e.g. route name, service) */
export function createLogger(context: string) {
  return {
    debug: (message: string, meta?: Record<string, unknown>) =>
      log('debug', message, { context, ...meta }),
    info: (message: string, meta?: Record<string, unknown>) =>
      log('info', message, { context, ...meta }),
    warn: (message: string, meta?: Record<string, unknown>) =>
      log('warn', message, { context, ...meta }),
    error: (message: string, meta?: Record<string, unknown>) =>
      log('error', message, { context, ...meta }),

    /** Time an async operation and log duration */
    async timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
      const start = Date.now();
      try {
        const result = await fn();
        log('info', label, { context, duration_ms: Date.now() - start, status: 'ok' });
        return result;
      } catch (err) {
        log('error', label, {
          context,
          duration_ms: Date.now() - start,
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    },
  };
}

export type Logger = ReturnType<typeof createLogger>;

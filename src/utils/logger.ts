/**
 * Logging utilities for the application
 * Provides structured logging with different levels and contexts
 */

// ============================================================================
// Types
// ============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  data?: unknown;
}

interface LoggerOptions {
  context?: string;
  enableConsole?: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

const IS_DEV = import.meta.env.DEV;
const IS_PROD = import.meta.env.PROD;

// In production, you might want to send logs to a service
const LOG_ENDPOINT = import.meta.env.PUBLIC_LOG_ENDPOINT || null;

// ============================================================================
// Logger Class
// ============================================================================

class Logger {
  private context?: string;
  private enableConsole: boolean;

  constructor(options: LoggerOptions = {}) {
    this.context = options.context;
    this.enableConsole = options.enableConsole ?? true;
  }

  /**
   * Create a log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): LogEntry {
    return {
      level,
      message,
      context: this.context,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  /**
   * Output to console
   */
  private consoleOutput(entry: LogEntry): void {
    if (!this.enableConsole) return;

    // Only log to console in development mode for security
    if (!IS_DEV) return;

    const prefix = entry.context ? `[${entry.context}]` : '';
    const timestamp = `[${entry.timestamp}]`;

    switch (entry.level) {
      case 'debug':
        console.debug(`${timestamp}${prefix}`, entry.message, entry.data ?? '');
        break;
      case 'info':
        console.info(`${timestamp}${prefix}`, entry.message, entry.data ?? '');
        break;
      case 'warn':
        console.warn(`${timestamp}${prefix}`, entry.message, entry.data ?? '');
        break;
      case 'error':
        console.error(`${timestamp}${prefix}`, entry.message, entry.data ?? '');
        break;
    }
  }

  /**
   * Send to external logging service (production)
   */
  private async sendToService(entry: LogEntry): Promise<void> {
    if (!IS_PROD || !LOG_ENDPOINT) return;

    try {
      // Non-blocking send
      fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't let logging break the app
      });
    } catch {
      // Silently fail
    }
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: unknown): void {
    const entry = this.createEntry('debug', message, data);
    this.consoleOutput(entry);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: unknown): void {
    const entry = this.createEntry('info', message, data);
    this.consoleOutput(entry);
    this.sendToService(entry);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    const entry = this.createEntry('warn', message, data);
    this.consoleOutput(entry);
    this.sendToService(entry);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown): void {
    const errorData =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;

    const entry = this.createEntry('error', message, errorData);
    this.consoleOutput(entry);
    this.sendToService(entry);
  }

  /**
   * Create a child logger with additional context
   */
  child(context: string): Logger {
    const parentContext = this.context;
    return new Logger({
      context: parentContext ? `${parentContext}:${context}` : context,
      enableConsole: this.enableConsole,
    });
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

/** Default application logger */
export const logger = new Logger({ context: 'App' });

/** Create a logger for a specific module/component */
export function createLogger(context: string): Logger {
  return new Logger({ context });
}

// ============================================================================
// Performance Logging
// ============================================================================

/**
 * Measure and log the execution time of a function
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T,
  loggerInstance: Logger = logger,
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  loggerInstance.debug(`${label} completed in ${duration.toFixed(2)}ms`);
  return result;
}

/**
 * Measure and log the execution time of an async function
 */
export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>,
  loggerInstance: Logger = logger,
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  loggerInstance.debug(`${label} completed in ${duration.toFixed(2)}ms`);
  return result;
}

export default logger;

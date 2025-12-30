/**
 * Centralized logging utility for production-ready error handling
 * 
 * In development: Logs to console for debugging
 * In production: Uses structured logging ready for monitoring services
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: any;
}

/**
 * Log an error with optional context
 * @param message - Error message
 * @param error - Error object or additional context
 * @param context - Additional structured context
 */
export function logError(
  message: string,
  error?: Error | unknown,
  context?: LogContext
): void {
  log('error', message, error, context);
}

/**
 * Log a warning with optional context
 * @param message - Warning message
 * @param context - Additional structured context
 */
export function logWarn(message: string, context?: LogContext): void {
  log('warn', message, undefined, context);
}

/**
 * Log info with optional context
 * @param message - Info message
 * @param context - Additional structured context
 */
export function logInfo(message: string, context?: LogContext): void {
  log('info', message, undefined, context);
}

/**
 * Internal logging function
 */
function log(
  level: LogLevel,
  message: string,
  error?: Error | unknown,
  context?: LogContext
): void {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // Development: Verbose console logging
    const prefix = `[${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message);
        if (error) {
          console.error(error);
        }
        if (context) {
          console.error('Context:', context);
        }
        break;
      case 'warn':
        console.warn(prefix, message);
        if (context) {
          console.warn('Context:', context);
        }
        break;
      case 'info':
        console.info(prefix, message);
        if (context) {
          console.info('Context:', context);
        }
        break;
      case 'debug':
        console.debug(prefix, message);
        if (context) {
          console.debug('Context:', context);
        }
        break;
    }
  } else {
    // Production: Structured logging
    // This format is ready for log aggregation services like:
    // - Sentry, LogRocket, Datadog, etc.
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(error instanceof Error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }
        : error
          ? { error: String(error) }
          : {}),
      ...(context || {}),
    };

    // In production, write structured JSON logs
    // These can be parsed by log aggregation services
    console.error(JSON.stringify(logEntry));

    // TODO: Integrate with your monitoring service here
    // Examples:
    // - Sentry.captureException(error)
    // - LogRocket.error(message, context)
    // - Custom API endpoint for log collection
  }
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return String(error);
}


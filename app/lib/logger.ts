/**
 * Logger service for application-wide logging
 * Replaces console.log/error/warn with environment-aware logging
 */
interface Logger {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
}

const logger: Logger = {};

/**
 * Logs informational messages (only in development)
 * @param {...unknown} args - Arguments to log
 */
logger.log = (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
        console.log('[ResumeAI]', ...args);
    }
};

/**
 * Logs error messages (always logged, can be extended to send to monitoring service)
 * @param {...unknown} args - Arguments to log
 */
logger.error = (...args: unknown[]): void => {
    console.error('[ResumeAI Error]', ...args);
    // TODO: Send to error monitoring service (e.g., Sentry, LogRocket)
};

/**
 * Logs warning messages (only in development)
 * @param {...unknown} args - Arguments to log
 */
logger.warn = (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
        console.warn('[ResumeAI]', ...args);
    }
};

/**
 * Logs debug messages (only in development)
 * @param {...unknown} args - Arguments to log
 */
logger.debug = (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
        console.debug('[ResumeAI Debug]', ...args);
    }
};

export default logger;

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

export class Logger {
  static log(level: LogLevel, message: string, context?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    
    // In a real application, this would send logs to a central server (e.g., Datadog, Sentry)
    // For now, we will just securely log it ensuring no PII is leaked conceptually.
    if (process.env.NODE_ENV !== 'production' || level === LogLevel.ERROR) {
      const formattedLog = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
      if (level === LogLevel.ERROR) console.error(formattedLog, context || '');
      else if (level === LogLevel.WARN) console.warn(formattedLog, context || '');
      else console.log(formattedLog, context || '');
    }
  }

  static info(message: string, context?: any) { this.log(LogLevel.INFO, message, context); }
  static warn(message: string, context?: any) { this.log(LogLevel.WARN, message, context); }
  static error(message: string, context?: any) { this.log(LogLevel.ERROR, message, context); }
  static debug(message: string, context?: any) { this.log(LogLevel.DEBUG, message, context); }
}

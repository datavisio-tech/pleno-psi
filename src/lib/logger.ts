export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  correlationId?: string;
  userId?: string;
  clinicId?: string;
  module?: string;
  metadata?: Record<string, unknown> | null;
};

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getLogStatus(): "ON" | "OFF" {
  try {
    return (process?.env?.LOG_STATUS === "ON" ? "ON" : "OFF") as "ON" | "OFF";
  } catch (e) {
    return "OFF";
  }
}

function getLogLevel(): LogLevel {
  try {
    const v = (process?.env?.LOG_LEVEL || "").toLowerCase();
    if (v === "debug" || v === "info" || v === "warn" || v === "error")
      return v as LogLevel;
  } catch (e) {
    // ignore
  }
  return "info";
}

function shouldLog(level: LogLevel) {
  if (getLogStatus() !== "ON") return false;
  const configured = getLogLevel();
  return levelPriority[level] >= levelPriority[configured];
}

function outputToServer(entry: Record<string, unknown>) {
  try {
    if (
      typeof process !== "undefined" &&
      process?.stdout &&
      typeof process.stdout.write === "function"
    ) {
      process.stdout.write(JSON.stringify(entry) + "\n");
      return;
    }
  } catch (e) {
    // fallback to console
  }
  // fallback
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

function outputToClient(entry: Record<string, unknown>) {
  // Use console with structured payload
  // eslint-disable-next-line no-console
  if (entry.level === "error") console.error(entry);
  else if (entry.level === "warn") console.warn(entry);
  else if (entry.level === "debug") console.debug(entry);
  else console.info(entry);
}

function makeLoggerMethod(level: LogLevel) {
  return (message: string, ctx?: LogContext | Error | null) => {
    if (!shouldLog(level)) return;
    const isServer = typeof window === "undefined";
    const base = {
      timestamp: new Date().toISOString(),
      level,
      message,
    } as Record<string, unknown>;
    if (ctx instanceof Error) {
      base.meta = { name: ctx.name, message: ctx.message };
    } else if (ctx) {
      base.correlationId = ctx.correlationId;
      base.userId = ctx.userId;
      base.clinicId = ctx.clinicId;
      base.module = ctx.module;
      base.meta = ctx.metadata ?? null;
    }
    if (isServer) outputToServer(base);
    else outputToClient(base);
  };
}

export const logger = {
  debug: makeLoggerMethod("debug"),
  info: makeLoggerMethod("info"),
  warn: makeLoggerMethod("warn"),
  error: makeLoggerMethod("error"),
};

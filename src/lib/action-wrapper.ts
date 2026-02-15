import { logger } from "./logger";
import { headers } from "next/headers";

export function withLogging<
  T extends (...args: unknown[]) => Promise<unknown> | unknown,
>(actionName: string, fn: T): T {
  const wrapper = (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Try to extract ctx from last argument if present (pattern used by next-safe-action)
    const maybeCtx = args[args.length - 1] as unknown;
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === "object" && v !== null;
    const ctx =
      isRecord(maybeCtx) &&
      "ctx" in maybeCtx &&
      isRecord((maybeCtx as Record<string, unknown>).ctx)
        ? ((maybeCtx as Record<string, unknown>).ctx as Record<string, unknown>)
        : isRecord(maybeCtx)
          ? (maybeCtx as Record<string, unknown>)
          : undefined;

    const hdrs = headers();
    const correlationId = hdrs.get("x-correlation-id") ?? undefined;

    const requestCtx = {
      correlationId,
      userId:
        isRecord(ctx) &&
        isRecord(ctx["user"]) &&
        typeof (ctx["user"] as Record<string, unknown>)["id"] === "string"
          ? ((ctx["user"] as Record<string, unknown>)["id"] as string)
          : undefined,
      clinicId:
        isRecord(ctx) &&
        isRecord(ctx["user"]) &&
        isRecord((ctx["user"] as Record<string, unknown>)["clinic"]) &&
        typeof (
          (ctx["user"] as Record<string, unknown>)["clinic"] as Record<
            string,
            unknown
          >
        )["id"] === "string"
          ? ((
              (ctx["user"] as Record<string, unknown>)["clinic"] as Record<
                string,
                unknown
              >
            )["id"] as string)
          : undefined,
    } as const;

    logger.info(`${actionName} - start`, {
      correlationId: requestCtx.correlationId,
      userId: requestCtx.userId,
      clinicId: requestCtx.clinicId,
      module: actionName,
      metadata: { input: (args?.[0] as unknown) ?? null },
    });

    try {
      const result = await fn(...(args as Parameters<T>));
      logger.info(`${actionName} - success`, {
        correlationId: requestCtx.correlationId,
        userId: requestCtx.userId,
        clinicId: requestCtx.clinicId,
        module: actionName,
      });
      return result as ReturnType<T>;
    } catch (err) {
      logger.error(`${actionName} - error`, {
        correlationId: requestCtx.correlationId,
        userId: requestCtx.userId,
        clinicId: requestCtx.clinicId,
        module: actionName,
        metadata: { error: (err as Error).message },
      });
      throw err;
    }
  }) as unknown as T;

  return wrapper;
}

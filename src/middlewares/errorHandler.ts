import type { ErrorRequestHandler } from "express";

interface MaybeHttpError {
  body?: Record<string, unknown>;
  message?: unknown;
  status?: unknown;
}

// errorHandler reads { status, message, body }. 4xx messages are safe to
// surface; 5xx are logged and hidden.
// _next is required: Express only treats a 4-arg function as error middleware.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { body, message, status } = err as MaybeHttpError;
  const code = typeof status === "number" ? status : 500;
  if (code >= 500) {
    const e = err as Error;
    console.error("unhandled_error", { message: e.message, name: e.name, stack: e.stack });
  }
  res.status(code).json({
    error: code < 500 && typeof message === "string" ? message : "Internal server error",
    ...(body && code < 500 ? body : {}),
  });
};

// errorHandler reads { status, message, body }; body is merged into the JSON response.
export function httpError(
  status: number,
  message: string,
  body?: Record<string, unknown>,
): Error & { body?: Record<string, unknown>; status: number } {
  return Object.assign(new Error(message), { body, status });
}

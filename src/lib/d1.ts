import { env } from "../config/env.js";
import { httpError } from "./httpError.js";

interface D1ApiResponse<T> {
  errors?: { message: string }[];
  result?: D1QueryResult<T>[];
  success: boolean;
}

interface D1QueryResult<T> {
  results?: T[];
  success?: boolean;
}

// D1's HTTP API only accepts string params. Callers pass strings.
export async function d1All<T>(sql: string, params: string[] = []): Promise<T[]> {
  const statement = await query<T>(sql, params);
  return statement.results ?? [];
}

export async function d1Run(sql: string, params: string[] = []): Promise<void> {
  await query(sql, params);
}

async function query<T>(sql: string, params: string[]): Promise<D1QueryResult<T>> {
  const { cloudflareAccountId, cloudflareApiToken, cloudflareD1DatabaseId } = env;
  if (!cloudflareAccountId || !cloudflareApiToken || !cloudflareD1DatabaseId) {
    throw httpError(503, "D1 is not configured");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/d1/database/${cloudflareD1DatabaseId}/query`,
    {
      body: JSON.stringify({ params, sql }),
      headers: {
        authorization: `Bearer ${cloudflareApiToken}`,
        "content-type": "application/json",
      },
      method: "POST",
    },
  );

  let payload: D1ApiResponse<T>;
  try {
    payload = (await response.json()) as D1ApiResponse<T>;
  } catch {
    throw httpError(502, "The database is unavailable. Try again.");
  }

  const statement = payload.result?.[0];
  if (!response.ok || !payload.success || statement?.success === false) {
    console.error("d1_query_failed", {
      message: payload.errors?.[0]?.message ?? response.statusText,
      status: response.status,
    });
    throw httpError(502, "The database is unavailable. Try again.");
  }

  return statement ?? {};
}

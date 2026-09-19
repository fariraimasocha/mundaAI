import { d1All, d1Run } from "../lib/d1.js";
import { checkbackDueAt } from "./checkback.js";

export interface DueCheckback {
  advice: string;
  id: string;
  name: null | string;
  phone: string;
  problem: string;
}

export interface OpenCheckback {
  advice: string;
  id: string;
  problem: string;
}

interface DueRow {
  advice: string;
  id: string;
  name: null | string;
  phone: string;
  problem: string;
}

interface IdRow {
  id: string;
}

interface OpenRow {
  advice: string;
  id: string;
  problem: string;
}

let ready: null | Promise<void> = null;

export async function closeCheckback(id: string): Promise<void> {
  await ensureSchema();
  await d1Run("UPDATE checkbacks SET status = 'closed' WHERE id = ?", [id]);
}

export async function findAskedCheckback(phone: string): Promise<null | OpenCheckback> {
  await ensureSchema();
  const rows = await d1All<OpenRow>("SELECT id, problem, advice FROM checkbacks WHERE phone = ? AND status = 'asked' ORDER BY due_at DESC LIMIT 1", [
    phone,
  ]);
  const row = rows.at(0);
  if (!row) return null;
  return { advice: row.advice, id: row.id, problem: row.problem };
}

export async function listDueCheckbacks(now: string): Promise<DueCheckback[]> {
  await ensureSchema();
  const rows = await d1All<DueRow>(
    `SELECT checkbacks.id, checkbacks.phone, checkbacks.problem, checkbacks.advice, farmers.name
     FROM checkbacks
     LEFT JOIN farmers ON farmers.phone = checkbacks.phone
     WHERE checkbacks.status = 'pending' AND checkbacks.due_at <= ?
     ORDER BY checkbacks.due_at
     LIMIT 40`,
    [now],
  );
  return rows.map((row) => ({
    advice: row.advice,
    id: row.id,
    name: blank(row.name),
    phone: row.phone,
    problem: row.problem,
  }));
}

export async function markCheckbackAsked(id: string): Promise<void> {
  await ensureSchema();
  await d1Run("UPDATE checkbacks SET status = 'asked' WHERE id = ? AND status = 'pending'", [id]);
}

export async function scheduleCheckback(input: { advice: string; phone: string; problem: string }): Promise<void> {
  await ensureSchema();
  const now = new Date().toISOString();
  const dueAt = checkbackDueAt();
  const advice = input.advice.replace(/\s+/g, " ").trim().slice(0, 700);
  const existing = await d1All<IdRow>("SELECT id FROM checkbacks WHERE phone = ? AND status IN ('pending', 'asked') LIMIT 1", [input.phone]);
  const id = existing.at(0)?.id;
  if (id) {
    await d1Run("UPDATE checkbacks SET problem = ?, advice = ?, due_at = ?, status = 'pending', created_at = ? WHERE id = ?", [
      input.problem,
      advice,
      dueAt,
      now,
      id,
    ]);
    return;
  }
  await d1Run("INSERT INTO checkbacks (id, phone, problem, advice, due_at, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?)", [
    crypto.randomUUID(),
    input.phone,
    input.problem,
    advice,
    dueAt,
    now,
  ]);
}

function blank(value: null | string): null | string {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

async function createTable(): Promise<void> {
  await d1Run(
    `CREATE TABLE IF NOT EXISTS checkbacks (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL,
      problem TEXT NOT NULL,
      advice TEXT NOT NULL,
      due_at TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  );
  await d1Run("CREATE INDEX IF NOT EXISTS checkbacks_status_due ON checkbacks (status, due_at)");
  await d1Run("CREATE INDEX IF NOT EXISTS checkbacks_phone ON checkbacks (phone)");
}

async function ensureSchema(): Promise<void> {
  ready ??= createTable().catch((err: unknown) => {
    ready = null;
    throw err;
  });
  return ready;
}

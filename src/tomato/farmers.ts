import { d1All, d1Run } from "../lib/d1.js";

export interface Farmer {
  awaiting: "crop" | "name" | "plot" | "town" | null;
  crop: null | string;
  history: FarmerTurn[];
  location: null | string;
  name: null | string;
  observations: { at: string; problem: string }[];
  plot: null | string;
  town: null | string;
  updatedAt: null | string;
}

export interface FarmerTurn {
  role: "bot" | "farmer";
  text: string;
}

interface FarmerRow {
  awaiting: null | string;
  crop: null | string;
  history: null | string;
  location: null | string;
  name: null | string;
  plot: null | string;
  town: null | string;
  updated_at: null | string;
}

interface ObservationRow {
  observed_at: string;
  problem: string;
}

const queue = new Map<string, Promise<unknown>>();
let ready: null | Promise<void> = null;

export function remember(farmer: Farmer, role: FarmerTurn["role"], text: string): void {
  farmer.history.push({ role, text });
  farmer.history = farmer.history.slice(-8);
}

// One farmer at a time so two WhatsApp messages cannot overwrite each other.
export async function withFarmer<T>(phone: string, run: (farmer: Farmer) => Promise<T>): Promise<T> {
  const previous = queue.get(phone) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(async () => {
    await ensureSchema();
    const farmer = await loadFarmer(phone);
    try {
      return await run(farmer);
    } finally {
      await saveFarmer(phone, farmer);
    }
  });
  queue.set(phone, current);
  return current;
}

function asString(value: null | string | undefined): null | string {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

async function createTables(): Promise<void> {
    await d1Run(
      `CREATE TABLE IF NOT EXISTS farmers (
        phone TEXT PRIMARY KEY,
        name TEXT,
        location TEXT,
        town TEXT,
        crop TEXT,
        plot TEXT,
        awaiting TEXT,
        history TEXT NOT NULL DEFAULT '[]',
        updated_at TEXT
      )`,
    );
    await d1Run(
      `CREATE TABLE IF NOT EXISTS farmer_observations (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL,
        problem TEXT NOT NULL,
        observed_at TEXT NOT NULL
      )`,
    );
    await d1Run("CREATE INDEX IF NOT EXISTS farmer_observations_phone ON farmer_observations (phone)");
    await d1Run("CREATE INDEX IF NOT EXISTS farmer_observations_problem ON farmer_observations (problem)");
    await d1Run("CREATE INDEX IF NOT EXISTS farmers_location ON farmers (location)");
}

function emptyFarmer(): Farmer {
  return {
    awaiting: null,
    crop: null,
    history: [],
    location: null,
    name: null,
    observations: [],
    plot: null,
    town: null,
    updatedAt: null,
  };
}

async function ensureSchema(): Promise<void> {
  ready ??= createTables().catch((err: unknown) => {
    ready = null;
    throw err;
  });
  return ready;
}

function isAwaiting(value: null | string): value is Farmer["awaiting"] {
  return value === "crop" || value === "name" || value === "plot" || value === "town" || value === null;
}

function isTurn(value: unknown): value is FarmerTurn {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (record.role === "bot" || record.role === "farmer") && typeof record.text === "string";
}

async function loadFarmer(phone: string): Promise<Farmer> {
  const [rows, observations] = await Promise.all([
    d1All<FarmerRow>(
      "SELECT name, location, town, crop, plot, awaiting, history, updated_at FROM farmers WHERE phone = ?",
      [phone],
    ),
    d1All<ObservationRow>(
      "SELECT problem, observed_at FROM farmer_observations WHERE phone = ? ORDER BY observed_at",
      [phone],
    ),
  ]);
  const row = rows.at(0);
  if (!row) return emptyFarmer();

  let history: FarmerTurn[] = [];
  try {
    const parsed: unknown = JSON.parse(row.history ?? "[]");
    if (Array.isArray(parsed)) history = parsed.filter(isTurn).slice(-8);
  } catch {
    history = [];
  }

  const awaiting = asString(row.awaiting);
  return {
    awaiting: isAwaiting(awaiting) ? awaiting : null,
    crop: asString(row.crop),
    history,
    location: asString(row.location) ?? asString(row.town),
    name: asString(row.name),
    observations: observations.map((item) => ({ at: item.observed_at, problem: item.problem })),
    plot: asString(row.plot),
    town: asString(row.town),
    updatedAt: asString(row.updated_at),
  };
}

async function saveFarmer(phone: string, farmer: Farmer): Promise<void> {
  await d1Run(
    `INSERT INTO farmers (phone, name, location, town, crop, plot, awaiting, history, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(phone) DO UPDATE SET
       name = excluded.name,
       location = excluded.location,
       town = excluded.town,
       crop = excluded.crop,
       plot = excluded.plot,
       awaiting = excluded.awaiting,
       history = excluded.history,
       updated_at = excluded.updated_at`,
    [
      phone,
      sqlText(farmer.name),
      sqlText(farmer.location),
      sqlText(farmer.town),
      sqlText(farmer.crop),
      sqlText(farmer.plot),
      sqlText(farmer.awaiting),
      JSON.stringify(farmer.history),
      sqlText(farmer.updatedAt),
    ],
  );

  await d1Run("DELETE FROM farmer_observations WHERE phone = ?", [phone]);
  await Promise.all(
    farmer.observations.map((observation) =>
      d1Run("INSERT INTO farmer_observations (id, phone, problem, observed_at) VALUES (?, ?, ?, ?)", [
        crypto.randomUUID(),
        phone,
        observation.problem,
        observation.at,
      ]),
    ),
  );
}

function sqlText(value: null | string): string {
  return value ?? "";
}

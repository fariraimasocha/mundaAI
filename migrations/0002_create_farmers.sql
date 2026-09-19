CREATE TABLE IF NOT EXISTS farmers (
  phone TEXT PRIMARY KEY,
  name TEXT,
  location TEXT,
  town TEXT,
  crop TEXT,
  plot TEXT,
  awaiting TEXT,
  history TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT
);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS farmer_observations (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  problem TEXT NOT NULL,
  observed_at TEXT NOT NULL
);

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS farmer_observations_phone ON farmer_observations (phone);

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS farmer_observations_problem ON farmer_observations (problem);

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS farmers_location ON farmers (location);

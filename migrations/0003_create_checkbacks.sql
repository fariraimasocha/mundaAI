CREATE TABLE IF NOT EXISTS checkbacks (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  problem TEXT NOT NULL,
  advice TEXT NOT NULL,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS checkbacks_status_due ON checkbacks (status, due_at);

--> statement-breakpoint

CREATE INDEX IF NOT EXISTS checkbacks_phone ON checkbacks (phone);

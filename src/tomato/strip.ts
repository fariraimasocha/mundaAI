import type { Farmer } from "./farmers.js";

import { matchPlace } from "./places.js";
import { plantCount } from "./plan.js";

export interface StrippedFacts {
  crop: null | string;
  location: null | string;
  name: null | string;
  plotSize: null | string;
  problem: null | string;
}

const EMPTY: StrippedFacts = {
  crop: null,
  location: null,
  name: null,
  plotSize: null,
  problem: null,
};

const PROBLEMS: { name: string; pattern: RegExp }[] = [
  { name: "late blight", pattern: /late blight/i },
  { name: "early blight", pattern: /early blight/i },
  { name: "tuta absoluta", pattern: /tuta|leaf miner/i },
  { name: "bacterial wilt", pattern: /bacterial wilt|fusarium/i },
  { name: "leaf curl", pattern: /leaf curl/i },
  { name: "red spider mite", pattern: /red spider|spider mite/i },
  { name: "septoria", pattern: /septoria/i },
  { name: "blossom end rot", pattern: /blossom end rot/i },
  { name: "bollworm", pattern: /bollworm/i },
];

export function applyFacts(farmer: Farmer, facts: StrippedFacts): void {
  if (facts.name) farmer.name = facts.name;
  if (facts.location) {
    farmer.location = facts.location;
    farmer.town = facts.location;
  }
  if (facts.crop) farmer.crop = facts.crop;
  if (facts.plotSize) farmer.plot = facts.plotSize;
  if (facts.problem && farmer.observations.at(-1)?.problem !== facts.problem) {
    farmer.observations.push({ at: new Date().toISOString(), problem: facts.problem });
    farmer.observations = farmer.observations.slice(-50);
  }
  farmer.updatedAt = new Date().toISOString();
}

// Local only. A Gemini call here was using up the rate limit before the reply.
export function stripFacts(text: string): StrippedFacts {
  const trimmed = text.trim();
  if (!trimmed) return EMPTY;
  const named = /(?:my name is|i am|i'm)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i.exec(trimmed);
  const count = plantCount(trimmed);
  return {
    crop: /\btomatoes?\b/i.test(trimmed) ? "tomato" : null,
    location: matchPlace(trimmed)?.label ?? null,
    name: named?.[1] ?? null,
    plotSize: count === null ? null : `${String(count)} plants`,
    problem: PROBLEMS.find((item) => item.pattern.test(trimmed))?.name ?? null,
  };
}

// Five days after a named tomato problem, ask about that same leaf.
// The cron sends the ask. This file only decides the words and the outcome.

export const CHECKBACK_MS = 5 * 24 * 60 * 60 * 1000;

export const FIVE_DAY_NOTE = "I will ask again in five days. Send a photo of this same leaf then.";

const FILLER = new Set([
  "a",
  "bit",
  "change",
  "changed",
  "getting",
  "is",
  "it",
  "its",
  "little",
  "looks",
  "much",
  "no",
  "not",
  "now",
  "s",
  "still",
  "the",
  "there",
  "very",
  "yes",
]);

const BETTER = new Set(["better", "healed", "healing", "improved", "improving"]);
const SAME = new Set(["same", "unchanged"]);
const WORSE = new Set(["spread", "spreading", "worse", "worsening"]);

export type CheckOutcome = "better" | "same" | "unclear" | "worse";

export interface PhotoRead {
  problem: null | string;
  status: "disease" | "healthy" | "not_tomato" | "unavailable" | "unclear";
}

export function answersCheckback(text: string | undefined, hasImage: boolean): boolean {
  if (hasImage) return true;
  return readOutcome(text ?? "") !== null;
}

export function checkbackDueAt(from = new Date()): string {
  return new Date(from.getTime() + CHECKBACK_MS).toISOString();
}

export function diagnosisProblem(input: {
  cropProblem: null | string;
  cropStatus: null | PhotoRead["status"];
  intent: string;
  reply: string;
}): null | string {
  if (input.cropStatus === "healthy" || input.cropStatus === "not_tomato" || input.cropStatus === "unclear") {
    return null;
  }
  if (input.cropStatus === "disease" && input.cropProblem && input.cropProblem !== "healthy") {
    return input.cropProblem;
  }
  if (input.intent !== "diagnose") return null;
  const match = /this looks like \*?([^*\n.]{2,60})/i.exec(input.reply);
  const name = match?.[1]?.replace(/[*.]/g, "").trim() ?? "";
  if (name.length < 2 || /\bhealthy\b/i.test(name)) return null;
  return name;
}

export function officerCase(input: {
  advice: string;
  name: null | string;
  phone: string;
  photoUrl: null | string;
  plot: null | string;
  problem: string;
  seen: null | string;
  town: null | string;
}): string {
  const seen = input.seen && input.seen !== "healthy" && !sameProblem(input.problem, input.seen) ? `Now looks like: ${input.seen}` : null;
  return [
    "Check-back, worse.",
    `Name: ${input.name ?? "unknown"}`,
    `Phone: ${input.phone}`,
    `Town: ${input.town ?? "unknown"}`,
    `Plants: ${input.plot ?? "unknown"}`,
    `Problem: ${input.problem}`,
    seen,
    `Earlier advice: ${input.advice.replace(/\s+/g, " ").trim().slice(0, 500)}`,
    `New photo: ${input.photoUrl ?? "in the farmer chat"}`,
    "Reply in this farmer's WhatsApp chat.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function photoOutcome(previous: string, check: PhotoRead): CheckOutcome {
  if (check.status === "healthy") return "better";
  if (check.status !== "disease" || !check.problem) return "unclear";
  return sameProblem(previous, check.problem) ? "same" : "worse";
}

export function readOutcome(text: string): CheckOutcome | null {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0 || words.length > 6) return null;
  const marks = words.filter((word) => BETTER.has(word) || SAME.has(word) || WORSE.has(word));
  if (marks.length !== 1) return null;
  if (!words.every((word) => FILLER.has(word) || BETTER.has(word) || SAME.has(word) || WORSE.has(word))) {
    return null;
  }
  const mark = marks[0];
  if (!mark) return null;
  if (WORSE.has(mark)) return "worse";
  if (BETTER.has(mark)) return "better";
  return "same";
}

export function settleCheckback(input: {
  advice: string;
  fromPhoto: boolean;
  name: null | string;
  outcome: CheckOutcome;
  phone: string;
  photoUrl: null | string;
  plot: null | string;
  problem: string;
  said: boolean;
  seen: null | string;
  town: null | string;
}): { close: boolean; farmerReply: string; officerText: null | string } {
  const first = input.name?.split(" ")[0];
  if (input.outcome === "worse") {
    const who = first ? `${first}, this` : "This";
    return {
      close: true,
      farmerReply: `${who} is worse. I have sent your town, plant count, and what we already said to agrictech officer Fari. He will reply in this chat.`,
      officerText: officerCase(input),
    };
  }
  if (input.outcome === "better") {
    const who = first ? `${first}, that` : "That";
    return {
      close: true,
      farmerReply: `${who} leaf is better. Check twice a week, and send a photo if it comes back.`,
      officerText: null,
    };
  }
  if (input.outcome === "same" && input.said) {
    return {
      close: true,
      farmerReply: `It is still ${input.problem}. Keep picking off the worst leaves. If it gets worse, say worse and I will pass it to Fari.`,
      officerText: null,
    };
  }
  if (input.outcome === "same" && input.fromPhoto) {
    return {
      close: false,
      farmerReply: `I can still see ${input.problem}. Reply better, worse, or the same.`,
      officerText: null,
    };
  }
  return {
    close: false,
    farmerReply: "I cannot tell if that is better or worse. Reply better, worse, or the same.",
    officerText: null,
  };
}

export function templateParam(value: string, fallback: string): string {
  const cleaned = value
    .replace(/[\n\r\t*]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned.slice(0, 200) : fallback;
}

function sameProblem(left: string, right: string): boolean {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  return a.includes(b) || b.includes(a);
}

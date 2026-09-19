import { env } from "../config/env.js";

const CROP_MIN = 0.4;
const DISEASE_MIN = 0.2;
const HEALTHY_MIN = 0.45;

const OTHER_PROBLEMS = [
  "early blight",
  "late blight",
  "bacterial wilt",
  "fusarium wilt",
  "fusarium",
  "yellow leaf curl",
  "septoria",
  "leaf miner",
  "tuta",
  "red spider",
  "nematode",
  "bollworm",
  "powdery mildew",
  "bacterial spot",
];

export interface CropCheck {
  diseases: { name: string; probability: number }[];
  holdPlant: boolean;
  problem: null | string;
  status: "disease" | "healthy" | "not_tomato" | "unavailable" | "unclear";
}

export interface VerifiedReply {
  action: "answer" | "ask_plot" | "ask_town" | "fari";
  holdPlant: boolean;
  intent: "advice" | "buy" | "diagnose" | "other";
  reply: string;
  understood: boolean;
}

interface Suggestion {
  name: string;
  probability: number;
  text: string;
}

const UNAVAILABLE: CropCheck = {
  diseases: [],
  holdPlant: false,
  problem: null,
  status: "unavailable",
};

export function applyVerified<T extends VerifiedReply>(advice: T, check: CropCheck): T {
  if (check.status === "healthy") {
    const reply = mentionsOtherProblem(advice.reply, "healthy")
      ? "This looks healthy in the photo. If one leaf is brown, send a closer daylight photo of that leaf."
      : advice.reply;
    return { ...advice, action: "answer", holdPlant: false, intent: "diagnose", reply, understood: true };
  }
  if (check.status !== "disease" || !check.problem) return advice;

  const problem = check.problem;
  const kept = advice.reply
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0 && !mentionsOtherProblem(sentence, problem));
  let reply = kept.join("\n").trim();
  if (!reply.toLowerCase().includes(problem.toLowerCase())) {
    reply = `This looks like ${problem}.\n${reply}`.trim();
  }
  return {
    ...advice,
    action: advice.action === "fari" ? "answer" : advice.action,
    holdPlant: check.holdPlant || advice.holdPlant,
    intent: advice.intent === "other" ? "diagnose" : advice.intent,
    reply,
    understood: true,
  };
}

export function cropHealthFacts(check: CropCheck): string {
  if (check.status === "healthy") {
    return "Crop health check: verified healthy. Do not name a disease.";
  }
  if (check.status !== "disease" || !check.problem) return "";
  const suggestions = check.diseases
    .slice(0, 3)
    .map((item) => `${item.name} (${item.probability.toFixed(2)})`)
    .join(", ");
  return [
    `Crop health check: verified problem is "${check.problem}".`,
    `Suggestions: ${suggestions}.`,
    "Name only the verified problem. Do not name a different disease.",
    `holdPlant must be ${check.holdPlant ? "true" : "false"}.`,
  ].join(" ");
}

// crop.health is the disease name. Gemini may explain it, not replace it.
export async function identifyCrop(image: { bytes: Buffer; mimeType: string }): Promise<CropCheck> {
  const key = env.kindwiseApiKey;
  if (!key) {
    console.error("crop_health_failed", { reason: "missing_key" });
    return UNAVAILABLE;
  }

  try {
    const url = new URL("https://crop.kindwise.com/api/v1/identification");
    url.searchParams.set("details", "common_names");
    url.searchParams.set("language", "en");
    const response = await fetch(url, {
      body: JSON.stringify({
        images: [`data:${image.mimeType};base64,${image.bytes.toString("base64")}`],
      }),
      headers: {
        "Api-Key": key,
        "content-type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) {
      console.error("crop_health_failed", { status: response.status });
      return UNAVAILABLE;
    }
    return parseCropHealth(await response.json());
  } catch (err: unknown) {
    console.error("crop_health_failed", { reason: err instanceof Error ? err.name : "unknown" });
    return UNAVAILABLE;
  }
}

export function parseCropHealth(payload: unknown): CropCheck {
  if (!isRecord(payload) || !isRecord(payload.result)) return UNAVAILABLE;
  const crops = readSuggestions(payload.result.crop);
  const diseases = readSuggestions(payload.result.disease);
  const listed = diseases.map((item) => ({ name: item.name, probability: item.probability }));
  const crop = crops.at(0);
  if (crop && crop.probability >= CROP_MIN && !isTomato(crop.text)) {
    return { diseases: listed, holdPlant: false, problem: null, status: "not_tomato" };
  }

  const top = diseases.at(0);
  if (!top || top.probability < DISEASE_MIN) {
    return { diseases: listed, holdPlant: false, problem: null, status: "unclear" };
  }
  if (/\bhealthy\b/i.test(top.name)) {
    if (top.probability < HEALTHY_MIN) {
      return { diseases: listed, holdPlant: false, problem: null, status: "unclear" };
    }
    return { diseases: listed, holdPlant: false, problem: "healthy", status: "healthy" };
  }
  return {
    diseases: listed,
    holdPlant: /bacterial wilt|fusarium|yellow leaf curl/i.test(top.name),
    problem: top.name,
    status: "disease",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTomato(text: string): boolean {
  return text.includes("tomato") || text.includes("solanum lycopersicum");
}

function mentionsOtherProblem(sentence: string, problem: string): boolean {
  const lower = sentence.toLowerCase();
  const allowed = problem.toLowerCase();
  return OTHER_PROBLEMS.some(
    (name) => name !== allowed && !allowed.includes(name) && !name.includes(allowed) && lower.includes(name),
  );
}

function readSuggestions(value: unknown): Suggestion[] {
  if (!isRecord(value) || !Array.isArray(value.suggestions)) return [];
  const found: Suggestion[] = [];
  for (const item of value.suggestions) {
    if (!isRecord(item) || typeof item.name !== "string" || typeof item.probability !== "number") continue;
    const details = isRecord(item.details) ? item.details : null;
    const common = Array.isArray(details?.common_names)
      ? details.common_names.filter((name): name is string => typeof name === "string")
      : [];
    const scientific = typeof item.scientific_name === "string" ? item.scientific_name : "";
    const name = item.name.trim();
    if (!name) continue;
    found.push({
      name,
      probability: item.probability,
      text: [name, scientific, ...common].join(" ").toLowerCase(),
    });
  }
  return found.sort((left, right) => right.probability - left.probability);
}

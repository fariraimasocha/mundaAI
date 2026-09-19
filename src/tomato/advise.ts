import { env } from "../config/env.js";
import { httpError } from "../lib/httpError.js";
import { HOLD_PLANT, NOT_TOMATO, PHOTO_UNCHECKED, RETAKE_PHOTO } from "./copy.js";
import { applyVerified, type CropCheck, cropHealthFacts, identifyCrop } from "./cropHealth.js";
import { diseaseCard, explainQuestion } from "./explain.js";
import { looksLikePlan, planReply } from "./plan.js";
import { TOMATO_SYSTEM_PROMPT } from "./prompt.js";

const MODEL = "gemini-3.6-flash";

export interface Advice {
  action: "answer" | "ask_plot" | "ask_town" | "fari";
  holdPlant: boolean;
  intent: "advice" | "buy" | "diagnose" | "other";
  plot: null | string;
  reply: string;
  town: null | string;
  understood: boolean;
}

interface AdviseInput {
  crop?: null | string;
  cropCheck?: CropCheck | null;
  history: { role: "bot" | "farmer"; text: string }[];
  image?: { bytes: Buffer; mimeType: string };
  imageUrl?: string;
  name?: null | string;
  plot: null | string;
  statedPlot?: null | number;
  text?: string;
  town: null | string;
  weather: null | string;
}

export async function adviseTomato(input: AdviseInput): Promise<Advice> {
  const cropCheck = input.cropCheck ?? (input.image ? await identifyCrop(input.image) : null);
  if (cropCheck?.status === "unavailable") return fixed(PHOTO_UNCHECKED, "answer", true);
  if (cropCheck?.status === "not_tomato") return fixed(NOT_TOMATO, "fari", false);
  if (cropCheck?.status === "unclear") return fixed(RETAKE_PHOTO, "answer", true);
  const named = cropCheck ? checkedReply(input, cropCheck) : null;
  if (named) return named;

  const key = env.geminiApiKey;
  if (!key) {
    const fallback = cropCheck ? checkedReply(input, cropCheck) : null;
    if (fallback) return fallback;
    throw httpError(503, "Gemini is not configured");
  }

  const facts = [
    `Known name: ${input.name ?? "unknown"}`,
    `Known crop: ${input.crop ?? "unknown"}`,
    `Known town: ${input.town ?? "unknown"}`,
    `Plant count in this message: ${input.statedPlot === undefined || input.statedPlot === null ? "none. If you need a number, ask how many. Do not reuse an older plot." : String(input.statedPlot)}`,
    `Older plot on file, ignore unless they refer to it: ${input.plot ?? "none"}`,
    `Weather: ${input.weather ?? "not available — do not recommend a spray or a purchase"}`,
    cropCheck ? cropHealthFacts(cropCheck) : "",
    input.imageUrl ? `Photo: ${input.imageUrl}` : "",
    `Farmer message: ${input.text ?? "(no text)"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const parts: Record<string, unknown>[] = [{ text: facts }];
  if (input.imageUrl) {
    parts.push({
      file_data: {
        file_uri: input.imageUrl,
        mime_type: input.image?.mimeType ?? "image/jpeg",
      },
    });
  } else if (input.image) {
    parts.push({
      inline_data: {
        data: input.image.bytes.toString("base64"),
        mime_type: input.image.mimeType,
      },
    });
  }

  const contents = [
    ...input.history.map((turn) => ({
      parts: [{ text: turn.text }],
      role: turn.role === "farmer" ? "user" : "model",
    })),
    { parts, role: "user" },
  ];

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        body: JSON.stringify({
          contents,
          generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
          systemInstruction: { parts: [{ text: TOMATO_SYSTEM_PROMPT }] },
        }),
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": key,
        },
        method: "POST",
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch (err: unknown) {
    console.error("gemini_failed", { reason: err instanceof Error ? err.name : "timeout" });
    return whenGeminiBusy(input, cropCheck);
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error("gemini_failed", { detail: detail.slice(0, 300), status: response.status });
    return whenGeminiBusy(input, cropCheck);
  }

  let advice: Advice;
  try {
    advice = parseAdvice(await geminiText(response));
  } catch (err: unknown) {
    console.error("gemini_failed", { reason: err instanceof Error ? err.message : "bad_json" });
    return whenGeminiBusy(input, cropCheck);
  }
  if (cropCheck) return applyVerified(advice, cropCheck);
  return advice;
}

function asAction(value: unknown): Advice["action"] {
  if (value === "answer" || value === "ask_plot" || value === "ask_town" || value === "fari") {
    return value;
  }
  return "fari";
}

function asIntent(value: unknown): Advice["intent"] {
  if (value === "advice" || value === "buy" || value === "diagnose" || value === "other") {
    return value;
  }
  return "other";
}

function asText(value: unknown): null | string {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function checkedReply(input: AdviseInput, cropCheck: CropCheck): Advice | null {
  const first = input.name?.split(" ")[0];
  if (cropCheck.status === "disease" && cropCheck.problem) {
    const title = first
      ? `*${first}, this looks like ${cropCheck.problem}.*`
      : `*This looks like ${cropCheck.problem}.*`;
    const steps = "*Do this*\nPick off the worst leaves and fruit. Do not compost them.\nWater the soil, not the leaves.";
    const hold = cropCheck.holdPlant ? `\n\n${HOLD_PLANT}` : "";
    return fixed(`${title}\n${steps}${hold}`, "answer", true, cropCheck.holdPlant);
  }
  if (cropCheck.status === "healthy") {
    const title = first ? `*${first}, this looks healthy.*` : "*This looks healthy.*";
    return fixed(`${title}\nSend another photo if a leaf turns brown.`, "answer", true);
  }
  return null;
}

function fixed(
  reply: string,
  action: Advice["action"],
  understood: boolean,
  holdPlant = false,
): Advice {
  return {
    action,
    holdPlant,
    intent: action === "fari" ? "other" : "diagnose",
    plot: null,
    reply,
    town: null,
    understood,
  };
}

async function geminiText(response: Response): Promise<string> {
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) {
    throw httpError(502, "Tomato advice failed");
  }
  const candidate: unknown = payload.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) {
    throw httpError(502, "Tomato advice failed");
  }
  const part: unknown = candidate.content.parts[0];
  if (!isRecord(part) || typeof part.text !== "string") {
    throw httpError(502, "Tomato advice failed");
  }
  return part.text;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAdvice(raw: string): Advice {
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) {
    return { action: "fari", holdPlant: false, intent: "other", plot: null, reply: "", town: null, understood: false };
  }
  return {
    action: asAction(parsed.action),
    holdPlant: parsed.holdPlant === true,
    intent: asIntent(parsed.intent),
    plot: asText(parsed.plot),
    reply: asText(parsed.reply) ?? "",
    town: asText(parsed.town),
    understood: parsed.understood === true,
  };
}

function whenGeminiBusy(input: AdviseInput, cropCheck: CropCheck | null): Advice {
  const named = cropCheck ? checkedReply(input, cropCheck) : null;
  if (named) return named;
  const text = input.text ?? "";
  if (looksLikePlan(text)) {
    const reply = planReply({ count: input.statedPlot ?? null, name: input.name, text });
    const advice = fixed(reply, "answer", true);
    if (input.statedPlot) advice.plot = `${String(input.statedPlot)} plants`;
    return advice;
  }
  const card = explainQuestion(text, input.name) ?? diseaseCard(text, input.name);
  if (card) return fixed(card, "answer", true);
  return fixed("I am busy for a moment. Ask me again in a minute.", "answer", true);
}

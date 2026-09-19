import { HOLD_PLANT } from "./copy.js";

const BANNED = [
  /\bpull(?:ing)?\s+(?:out\s+|up\s+)?(?:the\s+|any\s+|this\s+|your\s+)?(?:whole\s+)?plants?\b/i,
  /\buproot(?:ing)?\b/i,
  /\bburn\s+(?:the\s+|your\s+|any\s+)?(?:plants?|crop|field|them)\b/i,
  /\bthrow\s+(?:out\s+|away\s+)?(?:the\s+|your\s+)?plants?\b/i,
  /\bdestroy\s+the\s+plants?\b/i,
  /\bdig\s+(?:out|up)\s+the\s+plants?\b/i,
];

const PHRASES = ["simura mbesa", "pisa zvirimwa", "khipha isitshalo", "shisa isitshalo"];

// Drops a sentence that tells the farmer to destroy the whole plant.
// "Pick off the leaves" stays. The Fari line is kept, because it says do not pull.
export function guardReply(reply: string, holdPlant: boolean): string {
  const paragraphs = reply
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split(/\n|(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0 && !isBanned(sentence))
        .join("\n"),
    )
    .filter((paragraph) => paragraph.length > 0);
  let text = paragraphs.join("\n\n").trim();
  if (holdPlant && !text.includes("0781840930")) {
    text = text ? `${text}\n\n${HOLD_PLANT}` : HOLD_PLANT;
  }
  return text;
}

function isBanned(sentence: string): boolean {
  if (/do not pull|don't pull|do not burn|0781840930/i.test(sentence)) return false;
  const lower = sentence.toLowerCase();
  if (PHRASES.some((phrase) => lower.includes(phrase))) return true;
  return BANNED.some((pattern) => pattern.test(sentence));
}

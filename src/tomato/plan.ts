// Practical tomato start-up, scaled to a plant count. No spray dose: that still
// needs a town and real weather. Spacing is 50 cm in the row and 1 m between
// rows, so each plant takes about half a square metre. Compound D is scaled
// from about 1,000 kg per hectare.

const PLAN =
  /\b(want to (grow|plant|start)|how (do i|to|can i)|what (do i|should i|can i) (need|buy|get)|seedlings?|spacing|how far|transplant|when (should|do|can) i (plant|sow|transplant)|manure|fertili[sz]|compound [cd]|stakes?|watering|how often.{0,20}water|prepare (the )?(land|soil|bed)|start(ing)? (a |my )?(tomato|crop|garden)|grow(ing)? tomatoes|\d[\d,]*\s*plants?)\b/i;

export function looksLikePlan(text: string): boolean {
  if (looksLikeSymptom(text)) return false;
  return PLAN.test(text);
}

export function looksLikeSymptom(text: string): boolean {
  return /\b(leaf|leaves|brown|yellow|spot|spots|wilt|blight|tuta|fruit|photo|picture|curl|hole|holes|rot|mite|dying|dead|sick|mine|mines)\b/i.test(
    text,
  );
}

export function planReply(input: { count: null | number; name?: null | string; text: string }): string {
  const topic = topicOf(input.text);
  if (!input.count && topic !== "when") {
    return "How many plants do you want? Then I can list the seedlings, manure, and stakes.";
  }
  const count = input.count ?? 0;
  if (topic === "water") return waterReply(count);
  if (topic === "space") return spaceReply(count);
  if (topic === "feed") return feedReply(count);
  if (topic === "when") return whenReply(input.name);
  return fullPlan(count, input.name);
}

export function plantCount(text: string): null | number {
  const plants = /(\d[\d,]*)\s*(?:tomato\s+)?plants?\b/i.exec(text);
  if (plants?.[1]) {
    const count = Number(plants[1].replaceAll(",", ""));
    if (count >= 1 && count <= 200_000) return count;
  }
  const hectares = /(\d+(?:\.\d+)?)\s*(?:ha|hectare|hectares)\b/i.exec(text);
  if (hectares?.[1]) {
    const count = Math.round(Number(hectares[1]) * 20_000);
    if (count >= 1 && count <= 200_000) return count;
  }
  return null;
}

function area(count: number): number {
  return Math.round(count * 0.5);
}

function compoundKg(count: number): number {
  return Math.max(1, Math.round(count * 0.05));
}

function feedReply(count: number): string {
  return [
    title(count, null, "Manure and fertiliser"),
    `${kilos(count)} well-rotted kraal manure.`,
    `${kilos(compoundKg(count))} Compound D for the whole plot.`,
    "Mix both into the soil before you plant. Do not let them touch the stem.",
  ].join("\n");
}

function fullPlan(count: number, name?: null | string): string {
  const seedlings = Math.ceil((count * 11) / 10);
  return [
    title(count, name, null),
    "*Get this*",
    `${num(seedlings)} healthy seedlings. Short and green, not tall and yellow.`,
    `${num(count)} stakes, about 1.5 m, and sisal twine.`,
    `${kilos(count)} well-rotted kraal manure.`,
    `${kilos(compoundKg(count))} Compound D for the whole plot.`,
    "",
    "*Plant them*",
    `50 cm between plants, 1 m between rows. That is about ${num(area(count))} square metres.`,
    "Mix the manure and Compound D into the soil. Do not let them touch the stem.",
    "Water the hole, then the soil every morning for 2 weeks if there is no rain. Do not wet the leaves.",
    "Stake within 2 weeks. If it is a tall type, pinch the side shoots. If it is a bush type, leave them.",
    "",
    "*Then*",
    "Look twice a week for leaf mines and brown spots. Send a photo when you see one.",
    "Ask me for a spray after you tell me your town. I will not guess a dose.",
  ].join("\n");
}

function kilos(kg: number): string {
  if (kg >= 1000) {
    const tonnes = Math.round(kg / 100) / 10;
    return `${num(tonnes)} tonnes`;
  }
  return `${num(kg)} kg`;
}

function num(value: number): string {
  return String(value);
}

function spaceReply(count: number): string {
  return [
    "*Spacing*",
    "50 cm between plants, 1 m between rows.",
    `For ${num(count)} plants that is about ${num(area(count))} square metres.`,
  ].join("\n");
}

function title(count: number, name: null | string | undefined, label: null | string): string {
  const first = name?.split(" ")[0];
  const subject = label ?? `for ${num(count)} tomato plants`;
  return first ? `*${first}, ${subject}*` : `*${subject.charAt(0).toUpperCase()}${subject.slice(1)}*`;
}

function topicOf(text: string): "feed" | "full" | "space" | "water" | "when" {
  if (/\b(water|watering)\b/i.test(text)) return "water";
  if (/\b(spacing|how far)\b/i.test(text)) return "space";
  if (/\b(manure|fertili[sz]|compound)\b/i.test(text)) return "feed";
  if (/\b(when|transplant|sow)\b/i.test(text) && !/\b(need|buy|get|grow)\b/i.test(text)) return "when";
  return "full";
}

function waterReply(count: number): string {
  const line =
    count > 0
      ? `For ${num(count)} plants, water the soil at the base, not the leaves.`
      : "Water the soil at the base, not the leaves.";
  return [
    "*Water*",
    line,
    "Every morning for 2 weeks after planting if there is no rain.",
    "After that, every second day when it is hot and dry. Skip a day if the soil is still damp.",
  ].join("\n");
}

function whenReply(name?: null | string): string {
  const first = name?.split(" ")[0];
  const titleLine = first ? `*${first}, when to plant*` : "*When to plant*";
  return [
    titleLine,
    "Transplant when the seedling is about 15 cm, with 4 true leaves.",
    "If you can water, the dry months stay cleaner.",
    "If you plant into the rains, the leaves will spot. Ask me before you spray.",
  ].join("\n");
}

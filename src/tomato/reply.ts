import { storeCropImage } from "../lib/storeImage.js";
import { adviseTomato } from "./advise.js";
import { answersCheckback, diagnosisProblem, FIVE_DAY_NOTE } from "./checkback.js";
import { findAskedCheckback, scheduleCheckback } from "./checkbackStore.js";
import { ASK_CROP, ASK_NAME, ASK_PLOT, ASK_TOWN, OFFICER_REPLY, RETAKE_PHOTO, THANKS_REPLY } from "./copy.js";
import { identifyCrop } from "./cropHealth.js";
import { type Farmer, remember, withFarmer } from "./farmers.js";
import { respondToCheckback } from "./followUp.js";
import { guardReply } from "./guard.js";
import { matchPlace } from "./places.js";
import { looksLikeSymptom, plantCount } from "./plan.js";
import { applyFacts, stripFacts } from "./strip.js";
import { lookupWeather } from "./weather.js";

interface FarmerMessage {
  from: string;
  image?: { bytes: Buffer; mimeType: string };
  text?: string;
}

type Step = "crop" | "name" | "plot" | "town";

export async function replyToFarmer(message: FarmerMessage): Promise<string> {
  return withFarmer(message.from, async (farmer) => {
    const text = message.text?.trim();

    if (text && isGreeting(text) && !message.image) {
      const reply = profileReply(farmer);
      remember(farmer, "farmer", text);
      remember(farmer, "bot", reply);
      return reply;
    }

    if (text && isThanks(text) && !message.image) {
      const name = farmer.name?.split(" ")[0];
      const reply = name ? `You are welcome, ${name}. Send a photo if it gets worse.` : THANKS_REPLY;
      remember(farmer, "farmer", text);
      remember(farmer, "bot", reply);
      farmer.awaiting = null;
      return reply;
    }

    const open = await findAskedCheckback(message.from);
    if (open && answersCheckback(text, Boolean(message.image))) {
      const reply = await respondToCheckback({
        farmer,
        image: message.image,
        open,
        phone: message.from,
        text,
      });
      remember(farmer, "farmer", text ?? "Sent a photo of the crop.");
      remember(farmer, "bot", reply);
      return reply.slice(0, 3500);
    }

    if (text && !message.image && farmer.awaiting) {
      const facts = stripFacts(text);
      applyFacts(farmer, facts);
      const pending = missingStep(farmer);
      const symptom = Boolean(facts.problem) || looksLikeSymptom(text);
      if (!symptom && text.length <= 80) fillAwaited(farmer, text);
      const still = missingStep(farmer);
      if (!symptom && still) {
        const reply = profileReply(farmer);
        remember(farmer, "farmer", text);
        remember(farmer, "bot", reply);
        return reply;
      }
      if (!symptom && pending && !still) {
        farmer.awaiting = null;
        const reply = doneReply(farmer);
        remember(farmer, "farmer", text);
        remember(farmer, "bot", reply);
        return reply;
      }
    } else if (text) {
      applyFacts(farmer, stripFacts(text));
    }

    const stated = text ? plantCount(text) : null;
    if (stated) {
      farmer.plot = `${String(stated)} plants`;
      farmer.crop ??= "tomato";
    }

    const image = message.image;
    const cropCheck = image ? await identifyCrop(image) : null;
    const ready = cropCheck !== null && cropCheck.status !== "unavailable";
    if (image && ready) keepUpload(image);

    let imageUrl: string | undefined;
    let weather: null | string = null;
    if (!ready && (image || wantsWeather(text))) {
      const side = await Promise.all([
        image ? storeCropImage(image) : Promise.resolve(undefined),
        farmer.town ? lookupWeather(farmer.town) : Promise.resolve(null),
      ]);
      imageUrl = side[0];
      weather = side[1];
    }
    const advice = await adviseTomato({
      crop: farmer.crop,
      cropCheck,
      history: farmer.history,
      image,
      imageUrl,
      name: farmer.name,
      plot: farmer.plot,
      statedPlot: stated,
      text,
      town: farmer.town,
      weather,
    });

    if (advice.town) {
      farmer.town = advice.town;
      farmer.location = advice.town;
    }
    if (advice.plot) farmer.plot = advice.plot;

    let followUp = advice;
    if (!weather && advice.intent === "buy" && farmer.town && farmer.plot) {
      const retryWeather = await lookupWeather(farmer.town);
      if (retryWeather) {
        followUp = await adviseTomato({
          crop: farmer.crop,
          cropCheck,
          history: farmer.history,
          image,
          imageUrl,
          name: farmer.name,
          plot: farmer.plot,
          statedPlot: stated,
          text,
          town: farmer.town,
          weather: retryWeather,
        });
        if (followUp.plot) farmer.plot = followUp.plot;
        if (followUp.town) {
          farmer.town = followUp.town;
          farmer.location = followUp.town;
        }
      }
    }

    let reply = followUp.reply.trim();
    if (reply === RETAKE_PHOTO && farmer.history.some((turn) => turn.role === "bot" && turn.text.includes("close photo in daylight"))) {
      reply = OFFICER_REPLY;
    }
    reply = guardReply(reply, followUp.holdPlant);
    if (!reply || followUp.action === "fari") {
      if (!includesOfficer(reply)) reply = reply ? `${reply}\n\n${OFFICER_REPLY}` : OFFICER_REPLY;
      farmer.awaiting = null;
    } else if (!farmer.town && (followUp.intent === "buy" || followUp.action === "ask_town")) {
      farmer.awaiting = "town";
      if (!reply) reply = ASK_TOWN;
    } else if (!farmer.plot && (followUp.intent === "buy" || followUp.action === "ask_plot")) {
      farmer.awaiting = "plot";
      if (!reply) reply = ASK_PLOT;
    } else if (followUp.action === "ask_town") {
      farmer.awaiting = "town";
    } else if (followUp.action === "ask_plot") {
      farmer.awaiting = "plot";
    } else {
      farmer.awaiting = null;
    }

    const problem = diagnosisProblem({
      cropProblem: cropCheck?.problem ?? null,
      cropStatus: cropCheck?.status ?? null,
      intent: followUp.intent,
      reply,
    });
    if (problem && followUp.action !== "fari") {
      try {
        await scheduleCheckback({ advice: reply, phone: message.from, problem });
        reply = `${reply}\n\n${FIVE_DAY_NOTE}`;
      } catch (err: unknown) {
        console.error("checkback_schedule_failed", err instanceof Error ? err.message : "unknown");
      }
    }

    remember(farmer, "farmer", text ?? "Sent a photo of the crop.");
    remember(farmer, "bot", reply);
    return reply.slice(0, 3500);
  });
}

function doneReply(farmer: Farmer): string {
  const name = farmer.name ?? "there";
  return `Thanks ${name}. You are in ${farmer.location ?? "your area"}, growing ${farmer.crop ?? "your crop"}, on ${farmer.plot ?? "your plot"}. Send a photo, tell me what is wrong, or ask what you need to start.`;
}

function fillAwaited(farmer: Farmer, text: string): void {
  if (farmer.awaiting === "name" && !farmer.name) farmer.name = text;
  if (farmer.awaiting === "town" && !farmer.location) {
    const place = matchPlace(text);
    if (!place) return;
    farmer.location = place.label;
    farmer.town = place.capital;
  }
  if (farmer.awaiting === "crop" && !farmer.crop) farmer.crop = text;
  if (farmer.awaiting === "plot" && !farmer.plot) farmer.plot = text;
}

function includesOfficer(reply: string): boolean {
  return reply.includes("0781840930");
}

function isGreeting(text: string): boolean {
  return /^(hie|hi+|hey+|hello|howzit|mhoro|makadii+|makadini|hesi|sawubona)[!.?\s]*$/i.test(text);
}

const THANKS_WORDS = new Set([
  "a",
  "alright",
  "cheers",
  "cool",
  "for",
  "help",
  "k",
  "lot",
  "mazvita",
  "much",
  "ndatenda",
  "ngiyabonga",
  "noted",
  "ok",
  "okay",
  "okk",
  "olk",
  "sharp",
  "siyabonga",
  "so",
  "sure",
  "ta",
  "thank",
  "thanks",
  "thanx",
  "the",
  "thx",
  "you",
]);

export function isThanks(text: string): boolean {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0 || words.length > 6) return false;
  const grateful = [
    "ok",
    "okay",
    "okk",
    "olk",
    "k",
    "thanks",
    "thank",
    "thanx",
    "thx",
    "ta",
    "ndatenda",
    "mazvita",
    "siyabonga",
    "ngiyabonga",
    "noted",
    "sharp",
    "cool",
    "alright",
    "sure",
  ];
  return words.every((word) => THANKS_WORDS.has(word)) && words.some((word) => grateful.includes(word));
}

function keepUpload(image: { bytes: Buffer; mimeType: string }): void {
  void storeCropImage(image).catch((err: unknown) => {
    console.error("uploadthing_failed", err instanceof Error ? err.message : "unknown");
  });
}

function missingStep(farmer: Farmer): null | Step {
  if (!farmer.name) return "name";
  if (!farmer.location) return "town";
  if (!farmer.crop) return "crop";
  if (!farmer.plot) return "plot";
  return null;
}

function profileReply(farmer: Farmer): string {
  const step = missingStep(farmer);
  farmer.awaiting = step;
  if (step === "name") return ASK_NAME;
  if (step === "town") return ASK_TOWN;
  if (step === "crop") return ASK_CROP;
  if (step === "plot") return ASK_PLOT;
  const crop = farmer.crop ?? "plants";
  return `Hie ${farmer.name ?? ""}. Send a photo, tell me what is wrong with the ${crop}, or ask what you need to start.`.replace("Hie .", "Hie.");
}

function wantsWeather(text: string | undefined): boolean {
  return /\b(spray|dose|mancozeb|fungicide|insecticide|chemical|rain)\b/i.test(text ?? "");
}

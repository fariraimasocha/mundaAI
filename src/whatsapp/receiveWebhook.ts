import { RequestHandler } from "express";

import { OFFICER_REPLY, PHOTO_UNCHECKED } from "../tomato/copy.js";
import { replyToFarmer } from "../tomato/reply.js";
import { downloadWhatsappMedia } from "./media.js";
import { sendWhatsappText } from "./send.js";

interface Incoming {
  from: string;
  imageId?: string;
  text?: string;
}

async function handleIncoming(message: Incoming): Promise<void> {
  try {
    const image = message.imageId ? await downloadWhatsappMedia(message.imageId) : undefined;
    const reply = await replyToFarmer({ from: message.from, image, text: message.text });
    await sendWhatsappText(message.from, reply);
  } catch (err: unknown) {
    console.error("tomato_reply_failed", err);
    await sendWhatsappText(message.from, message.imageId ? PHOTO_UNCHECKED : OFFICER_REPLY);
  }
}

function incomingMessages(body: unknown): Incoming[] {
  if (!isRecord(body) || !Array.isArray(body.entry)) return [];

  const found: Incoming[] = [];
  for (const entry of body.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) continue;
    for (const change of entry.changes) {
      if (!isRecord(change) || !isRecord(change.value) || !Array.isArray(change.value.messages)) {
        continue;
      }
      for (const message of change.value.messages) {
        if (!isRecord(message) || typeof message.from !== "string") continue;
        if (message.type === "text" && isRecord(message.text) && typeof message.text.body === "string") {
          found.push({ from: message.from, text: message.text.body });
          continue;
        }
        if (message.type === "image" && isRecord(message.image) && typeof message.image.id === "string") {
          const caption = typeof message.image.caption === "string" ? message.image.caption : undefined;
          found.push({ from: message.from, imageId: message.image.id, text: caption });
          continue;
        }
        found.push({ from: message.from });
      }
    }
  }
  return found;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Answer Meta immediately. Advice, weather, and the photo read happen after.
export const receiveWebhook: RequestHandler = (req, res) => {
  const messages = incomingMessages(req.body);
  res.sendStatus(200);
  for (const message of messages) {
    void handleIncoming(message).catch((err: unknown) => {
      console.error("tomato_reply_failed", err);
    });
  }
};

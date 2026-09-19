import type { Farmer } from "./farmers.js";

import { storeCropImage } from "../lib/storeImage.js";
import { sendWhatsappText } from "../whatsapp/send.js";
import { photoOutcome, readOutcome, settleCheckback } from "./checkback.js";
import { closeCheckback, type OpenCheckback } from "./checkbackStore.js";
import { OFFICER_REPLY } from "./copy.js";
import { identifyCrop } from "./cropHealth.js";

const FARI_WHATSAPP = "263781840930";

export async function respondToCheckback(input: {
  farmer: Farmer;
  image?: { bytes: Buffer; mimeType: string };
  open: OpenCheckback;
  phone: string;
  text?: string;
}): Promise<string> {
  const said = input.text ? readOutcome(input.text) : null;
  let seen: null | string = null;
  let fromPhoto = false;
  let outcome = said;
  if (input.image) {
    const check = await identifyCrop(input.image);
    seen = check.status === "healthy" ? "healthy" : check.problem;
    if (!outcome) {
      outcome = photoOutcome(input.open.problem, { problem: check.problem, status: check.status });
      fromPhoto = true;
    }
  }

  const photoUrl = outcome === "worse" ? await publicPhoto(input.image) : null;
  const settled = settleCheckback({
    advice: input.open.advice,
    fromPhoto,
    name: input.farmer.name,
    outcome: outcome ?? "unclear",
    phone: input.phone,
    photoUrl,
    plot: input.farmer.plot,
    problem: input.open.problem,
    said: said !== null,
    seen,
    town: input.farmer.town,
  });
  if (settled.close) await closeCheckback(input.open.id);

  if (!settled.officerText) return settled.farmerReply;
  try {
    await sendWhatsappText(FARI_WHATSAPP, settled.officerText);
    return settled.farmerReply;
  } catch (err: unknown) {
    console.error("officer_notify_failed", err instanceof Error ? err.message : "unknown");
    return `${settled.farmerReply}\n\n${OFFICER_REPLY}`;
  }
}

async function publicPhoto(image: undefined | { bytes: Buffer; mimeType: string }): Promise<null | string> {
  if (!image) return null;
  try {
    return await storeCropImage(image);
  } catch (err: unknown) {
    console.error("checkback_photo_failed", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

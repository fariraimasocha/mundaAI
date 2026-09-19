import { env } from "../config/env.js";
import { httpError } from "../lib/httpError.js";

const GRAPH_VERSION = "v22.0";

export async function downloadWhatsappMedia(mediaId: string): Promise<{ bytes: Buffer; mimeType: string }> {
  const token = env.whatsappAccessToken;
  if (!token) throw httpError(503, "WhatsApp is not configured");

  const meta = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!meta.ok) throw httpError(502, "WhatsApp media lookup failed");

  const body: unknown = await meta.json();
  if (typeof body !== "object" || body === null) throw httpError(502, "WhatsApp media lookup failed");
  const url = "url" in body && typeof body.url === "string" ? body.url : null;
  const mimeType = "mime_type" in body && typeof body.mime_type === "string" ? body.mime_type : "image/jpeg";
  if (!url) throw httpError(502, "WhatsApp media lookup failed");

  const file = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!file.ok) throw httpError(502, "WhatsApp media download failed");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > 5_000_000) throw httpError(413, "Image is too large");
  return { bytes, mimeType };
}

import { env } from "../config/env.js";
import { httpError } from "../lib/httpError.js";
import { templateParam } from "../tomato/checkback.js";

const GRAPH_VERSION = "v22.0";

export async function sendWhatsappTemplate(to: string, bodyParams: string[]): Promise<void> {
  const name = env.whatsappCheckbackTemplate;
  if (!name) throw httpError(503, "WhatsApp check-back template is not configured");
  await postMessage({
    messaging_product: "whatsapp",
    template: {
      components: [
        {
          parameters: bodyParams.map((text) => ({ text: templateParam(text, "there"), type: "text" })),
          type: "body",
        },
      ],
      language: { code: "en" },
      name,
    },
    to,
    type: "template",
  });
}

export async function sendWhatsappText(to: string, body: string): Promise<void> {
  await postMessage({
    messaging_product: "whatsapp",
    text: { body },
    to,
    type: "text",
  });
}

async function postMessage(payload: Record<string, unknown>): Promise<void> {
  const { whatsappAccessToken, whatsappPhoneNumberId } = env;
  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    throw httpError(503, "WhatsApp is not configured");
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${whatsappPhoneNumberId}/messages`, {
    body: JSON.stringify(payload),
    headers: {
      authorization: `Bearer ${whatsappAccessToken}`,
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("whatsapp_send_failed", { detail, status: response.status });
    throw httpError(502, "WhatsApp reply failed");
  }
}

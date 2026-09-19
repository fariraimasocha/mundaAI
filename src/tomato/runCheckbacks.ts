import { sendWhatsappTemplate } from "../whatsapp/send.js";
import { templateParam } from "./checkback.js";
import { listDueCheckbacks, markCheckbackAsked } from "./checkbackStore.js";

// The approved WhatsApp template body must be:
// {{1}}, five days ago this looked like {{2}}. Send a daylight photo of that same leaf, and reply better, worse, or the same.
export async function runDueCheckbacks(now = new Date()): Promise<number> {
  const due = await listDueCheckbacks(now.toISOString());
  let sent = 0;
  for (const row of due) {
    const name = templateParam(row.name ?? "", "there");
    const problem = templateParam(row.problem, "the leaf problem");
    try {
      await sendWhatsappTemplate(row.phone, [name, problem]);
      await markCheckbackAsked(row.id);
      sent += 1;
    } catch (err: unknown) {
      console.error("checkback_send_failed", {
        id: row.id,
        reason: err instanceof Error ? err.message : "unknown",
      });
    }
  }
  return sent;
}

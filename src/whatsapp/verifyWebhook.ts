import { RequestHandler } from "express";

import { env } from "../config/env.js";

// Meta's webhook setup sends GET /webhook?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
// The response body must be the challenge, as plain text, only when the token matches.
export const verifyWebhook: RequestHandler = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const tokenMatches =
    typeof token === "string" &&
    env.whatsappVerifyToken !== undefined &&
    token === env.whatsappVerifyToken;

  if (mode === "subscribe" && tokenMatches && typeof challenge === "string") {
    res.status(200).type("text/plain").send(challenge);
    return;
  }

  res.sendStatus(403);
};

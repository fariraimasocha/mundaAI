import { httpServerHandler } from "cloudflare:node";

import { app } from "./app.js";
import { runDueCheckbacks } from "./tomato/runCheckbacks.js";

// Workers route requests into this server. The port is local to the isolate.
// The cron is 04:00 UTC, which is 06:00 in Zimbabwe.
const port = 3000;
app.listen(port);

const server = httpServerHandler({ port });

export default {
  fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> | Response {
    return server.fetch(request, env, ctx);
  },
  async scheduled(): Promise<void> {
    await runDueCheckbacks();
  },
};

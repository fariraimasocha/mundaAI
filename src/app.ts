import express from "express";
import helmet from "helmet";
import { createRouteHandler } from "uploadthing/express";

import { errorHandler } from "./middlewares/errorHandler.js";
import { middleware } from "./middlewares/middlewares.js";
import { uploadRouter } from "./uploadthing.js";
import { receiveWebhook } from "./whatsapp/receiveWebhook.js";
import { verifyWebhook } from "./whatsapp/verifyWebhook.js";

export const app = express();

// Behind a reverse proxy: trust one hop so the real client IP is used.
app.set("trust proxy", 1);

app.use(helmet());

// Mount before express.json so UploadThing can read its own request body.
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  }),
);

app.use(express.json({ limit: "100kb" }));

app.get("/", middleware);
app.get("/webhook", verifyWebhook);
app.post("/webhook", receiveWebhook);

app.use(errorHandler);

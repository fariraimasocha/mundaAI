import { createUploadthing, type FileRouter } from "uploadthing/express";

import { saveUpload } from "./lib/uploads.js";

const f = createUploadthing();

export const uploadRouter = {
  cropImage: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "8MB",
    },
  }).onUploadComplete(async ({ file }) => {
    await saveUpload(file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

import { UTApi, UTFile } from "uploadthing/server";

import { env } from "../config/env.js";
import { httpError } from "./httpError.js";
import { saveUpload } from "./uploads.js";

// WhatsApp photos are not sent through the /api/uploadthing route, so they
// never showed on the dashboard. This stores the bytes and returns the public URL.
export async function storeCropImage(image: { bytes: Buffer; mimeType: string }): Promise<string> {
  const token = env.uploadthingToken;
  if (!token) throw httpError(503, "UploadThing is not configured");

  const file = new UTFile([image.bytes], `crop.${extension(image.mimeType)}`, { type: image.mimeType });
  const result = await new UTApi({ token }).uploadFiles(file);
  // The success type says data is always set. A failed upload still returns error at runtime.
  if (result.data === null) {
    console.error("uploadthing_failed", { message: result.error.message });
    throw httpError(502, "Image upload failed");
  }

  void saveUpload({
    key: result.data.key,
    name: result.data.name,
    size: result.data.size,
    ufsUrl: result.data.ufsUrl,
  }).catch((err: unknown) => {
    console.error("upload_row_failed", err instanceof Error ? err.message : "unknown");
  });

  return result.data.ufsUrl;
}

function extension(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

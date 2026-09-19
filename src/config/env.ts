// Validate env at import time so the process fails fast on boot rather than on
// the first request that happens to need a missing key.

// Treat an empty or whitespace-only env var as unset, so a stray `KEY=` line in
// .env falls back to the default instead of overriding it with "".
function nonBlank(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export const env = {
  cloudflareAccountId: nonBlank(process.env.CLOUDFLARE_ACCOUNT_ID),
  cloudflareApiToken: nonBlank(process.env.CLOUDFLARE_API_TOKEN),
  cloudflareD1DatabaseId: nonBlank(process.env.CLOUDFLARE_D1_DATABASE_ID),
  geminiApiKey: nonBlank(process.env.GEMINI_API_KEY),
  kindwiseApiKey: nonBlank(process.env.KINDWISE_API_KEY),
  nodeEnv: nonBlank(process.env.NODE_ENV) ?? "development",
  port: nonBlank(process.env.PORT) ?? "3000",
  uploadthingToken: nonBlank(process.env.UPLOADTHING_TOKEN),
  whatsappAccessToken: nonBlank(process.env.WHATSAPP_ACCESS_TOKEN),
  whatsappCheckbackTemplate: nonBlank(process.env.WHATSAPP_CHECKBACK_TEMPLATE) ?? "crop_checkback",
  whatsappPhoneNumberId: nonBlank(process.env.WHATSAPP_PHONE_NUMBER_ID),
  whatsappVerifyToken: nonBlank(process.env.WHATSAPP_VERIFY_TOKEN),
};

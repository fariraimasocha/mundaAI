# mundaAI

WhatsApp backend for smallholder tomato growers, mostly in Zimbabwe. A farmer texts the bot or sends a leaf photo. mundaAI asks for the missing farm details, checks the photo, looks up local weather, and replies with tomato advice. If it cannot tell, it hands the farmer to an agrictech officer.

## What it does

- Receives WhatsApp Cloud API messages on `GET /webhook` and `POST /webhook`.
- Collects name, town, crop, and plot size, and stores the farmer in Cloudflare D1.
- Sends leaf photos to Kindwise crop.health, then asks Gemini for a tomato-only reply.
- Uses Open-Meteo so spray advice follows today's weather.
- Stores crop photos with UploadThing when that token is set.

There is no public website. `GET /` returns `mundaAI up` so you can confirm the process is running.

## Technologies

- Node.js 22, TypeScript, Express 5
- WhatsApp Cloud API
- Google Gemini
- Kindwise crop.health
- Cloudflare D1 (Wrangler)
- UploadThing
- Open-Meteo
- pnpm

## Install and run

You need Node.js 22 (see `.nvmrc`) and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
cp .env.example .env
```

Fill `.env` from the comments in `.env.example`. The keys you need:

| Variable | Used for |
| --- | --- |
| `GEMINI_API_KEY` | Advice replies |
| `KINDWISE_API_KEY` | Photo checks |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification |
| `WHATSAPP_ACCESS_TOKEN` | Sending replies |
| `WHATSAPP_PHONE_NUMBER_ID` | Sending replies |
| `CLOUDFLARE_ACCOUNT_ID` | D1 |
| `CLOUDFLARE_API_TOKEN` | D1 (D1 Read and D1 Write) |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 |
| `UPLOADTHING_TOKEN` | Photo storage |

Apply the local database migrations, then start the server:

```bash
pnpm d1:migrate:local
pnpm dev
```

The server listens on port `3000` unless you set `PORT`. Open [http://localhost:3000](http://localhost:3000). You should see `mundaAI up`.

Point the WhatsApp webhook at `https://<your-public-host>/webhook` and use the same string as `WHATSAPP_VERIFY_TOKEN`.

Other commands:

```bash
pnpm test          # unit tests
pnpm type-check    # TypeScript
pnpm build         # compile to dist/
pnpm start         # run the compiled server
pnpm d1:migrate:remote
```

## Project structure

```
src/index.ts       process entry
src/app.ts         Express routes
src/config/        environment checks
src/whatsapp/      webhook verify, inbound messages, media download
src/tomato/        farmer memory, photo check, weather, advice
src/lib/           D1 client and upload helpers
src/middlewares/   health check and error handler
migrations/        D1 SQL
docs/              design notes
.env.example       required variables, no secrets
package.json       scripts and dependencies
pnpm-lock.yaml     locked dependency versions
wrangler.jsonc     Cloudflare D1 binding
```

`data/` is local only and is listed in `.gitignore`.

## Team

- Farirai Masocha

## Deployed app

https://mundaai.farirai.workers.dev

`GET /` returns `mundaAI up`. Point the WhatsApp webhook at `https://mundaai.farirai.workers.dev/webhook`.

To deploy again after a code change:

```bash
pnpm deploy
```

Secrets are not in the repo. Upload them with Wrangler from your local `.env` (same keys as `.env.example`) using `pnpm exec wrangler secret bulk`. Do not commit `.env`.

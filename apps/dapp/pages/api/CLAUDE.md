# Dapp API Routes

Next.js API routes serving as backend proxies and webhooks.

## Key Files

- `upload-start.ts` — IPFS pinning proxy (frontend uploads through here, not directly to IPFS)
- `chat.ts` — OpenAI-powered support chatbot endpoint (used by ChatBubble component). Requires `OPENAI_API_KEY`.
- `neynar-search.ts` — Farcaster user search proxy via Neynar API. Requires `NEYNAR_API_KEY`.
- `notify.ts` — multi-channel notification dispatcher (Telegram bot, Farcaster cast, generic webhook). Requires `TELEGRAM_BOT_TOKEN`, `NEYNAR_API_KEY`, `NEYNAR_SIGNER_UUID`, `NOTIFY_API_SECRET`.
- `farcaster.ts` — Farcaster frame/notification endpoint
- `bot/webhook.ts` — Neynar Farcaster bot webhook handler. Requires `NEYNAR_API_KEY`, `NEYNAR_BOT_SIGNER_UUID`, `NEYNAR_WEBHOOK_SECRET`.

## Patterns

- All routes that need CORS use `withCors()` wrapper from `../../utils/cors`
- Environment variables accessed via `process.env` (no validation library — manual checks)
- Errors return JSON `{ error: string }` with appropriate HTTP status codes

## Gotchas

- API keys are server-side only (no `NEXT_PUBLIC_` prefix) — never exposed to client
- `notify.ts` supports multiple notification channels in a single request — check the handler for supported event types

# Dapp Utils

Utility functions specific to the dapp (not shared across packages).

## Key Files

- `cors.ts` — `withCors()` higher-order function for Next.js API routes. Handles CORS preflight, origin whitelisting (supports wildcard subdomains), method filtering, and credential headers. Wraps any `NextApiHandler`.

## Patterns

- API routes use `withCors()(handler)` or `withCors({ allowedMethods: ['POST'], allowedOrigins: ['*.example.com'] })(handler)`
- Defaults: GET only, all origins (`*`), no credentials
- Preflight responses cached for 10 minutes (Access-Control-Max-Age: 600)

## Gotchas

- `withCors` skips CORS headers entirely if no `Origin` header is present in the request
- Cannot combine `credentials: true` with `allowedOrigins: ['*']` — will return 500

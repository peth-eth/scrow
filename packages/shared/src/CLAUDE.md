# Shared Package

Minimal shared utilities used across all packages. Currently contains only logging.

## Key Files

- `log.ts` — `logError(message, ...params)` and `logDebug(message, ...params)`. Debug logging is gated behind `NEXT_PUBLIC_DEBUG_LOGS === 'true'`.
- `index.ts` — barrel export for `log.ts`

## Patterns

- Both functions accept variadic args matching `console.error`/`console.debug` signatures
- `logError` always logs; `logDebug` only logs when env var is set
- Used by `@smartinvoicexyz/types` (metadata validators) and `@smartinvoicexyz/utils`

## Gotchas

- Despite the `NEXT_PUBLIC_` prefix, `logDebug` runs in both client and server contexts
- This package has eslint-disable comments for `no-console` — intentional, since logging is its purpose

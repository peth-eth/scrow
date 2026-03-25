# Types Package

Shared TypeScript type definitions used across all packages.

## Key Files

- `invoice.ts` — `FormInvoice` (form state shape), `InvoiceDetails` (resolved invoice with metadata, deposits, releases, etc.)
- `metadata.ts` — IPFS metadata types (`InvoiceMetadata`, `BasicMetadata`, `Milestone`, `Document`) plus validators (`validateInvoiceMetadata`, `validateDocument`, etc.)
- `form.ts` — form utility types (`ChangeEvent` re-export, `ValueOf<T>` helper)
- `overlay.ts` — modal/overlay types (`ModalType`, `Modals`, `OverlayContextType`, `UseToastReturn`, `ToastProps`)
- `token.ts` — `IToken` type (chainId, address, symbol, name, decimals, logoURI)
- `farcaster.ts` — `FarcasterUser` type for Neynar API responses
- `notification.ts` — `NotificationEvent` union type for invoice lifecycle events
- `ipfs.ts` — `KeyRestrictions` type for IPFS pinning API permissions
- `index.ts` — barrel export for all type modules

## Patterns

- All types are re-exported through `index.ts`
- Metadata types include runtime validators (not just compile-time types)
- `InvoiceDetails` extends raw subgraph `Invoice` type from `@smartinvoicexyz/graphql`

## Gotchas

- `metadata.ts` validators use `logDebug` from shared package — imports a runtime dependency
- `ChangeEvent` is re-exported from React in `form.ts` (not a custom type)
- `overlay.ts` contains both types AND a runtime const (`ModalTypes`) — not purely a type file

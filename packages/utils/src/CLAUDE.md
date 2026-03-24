# Utils Package

Utility functions used across all packages. Pure logic, no React components.

## Key Files

- `web3.ts` — wagmi config, chain helpers (`chainById`, `chainByName`, `parseChainId`), public client setup, wallet connectors (RainbowKit + Farcaster MiniApp)
- `invoice.ts` — invoice data transformation: `totalDeposited`, `depositedMilestones`, converts raw subgraph `Invoice` to `InvoiceDetails` with resolved metadata
- `helpers.ts` — resolver helpers (`getResolverInfo`, `getResolverFee`, `getResolverTypes`), token lookups (`getWrappedNativeToken`), address/URL parsing
- `form.ts` — yup validation schemas (`projectDetailsSchema`, etc.), form utilities (`schemaContext`)
- `date.ts` — date formatting and parsing (`getDateString`, `parseToDate`, `oneMonthFromNow`, `sevenDaysFromNow`)
- `tx.ts` — transaction helpers (`parseTxLogs`, `errorToastHandler`)
- `resolvers.ts` — resolver address/type resolution
- `browser.ts` — browser-only utilities
- `misc.ts` — miscellaneous helpers

## IPFS (`ipfs/`)

- `pinning.ts` — pin JSON metadata to IPFS (via upload API)
- `fetchFromIPFS.ts` — fetch content from IPFS gateway
- `conversion.ts` — convert between IPFS URI formats (`uriToDocument`, `ipfsToGateway`)

## Patterns

- Heavy use of lodash (`_`) for object manipulation
- All chain-aware functions take `chainId: number` and validate via `isSupportedChainId`
- Invoice transformation is the central data pipeline: raw subgraph data -> `InvoiceDetails`
- Yup schemas are used by forms package for step-level validation
- `wagmiConfig` is exported and used by the dapp's `_app.tsx`

## Gotchas

- `web3.ts` requires env vars: `NEXT_PUBLIC_WALLETCONNECT_ID`, `NEXT_PUBLIC_INFURA_ID`, `NEXT_PUBLIC_ALCHEMY_ID`
- IPFS pinning goes through `/api/upload-start` API route in the dapp, not directly to IPFS

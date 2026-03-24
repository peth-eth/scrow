# Hooks Package

React hooks for smart contract interactions and data fetching. Uses wagmi v2 + viem.

## Hooks

### Contract Write Hooks
- `useInvoiceCreate` — creates escrow invoices via factory contract
- `useInstantCreate` — creates instant (non-escrow) invoices
- `useDeposit` — deposit funds into an invoice (native or ERC20)
- `useRelease` — release milestone payments to provider
- `useLock` — lock funds in a dispute
- `useResolve` — resolve a disputed invoice (arbitrator only)
- `useWithdraw` — withdraw funds after safety valve date
- `useAddMilestones` — add milestones to existing invoice
- `useEscrowZap` — create + fund in one tx via zap contract
- `useVerify` — verify an invoice on-chain

### Data Fetching Hooks
- `useInvoiceDetails` — fetch single invoice details (subgraph + IPFS metadata)
- `useInstantDetails` — fetch instant invoice on-chain details
- `useInvoices` — fetch paginated invoice list for a user
- `useInvoiceStatus` — derive human-readable status from invoice state
- `useIpfsDetails` — fetch and parse IPFS metadata for an invoice
- `useTokenBalance` — fetch ERC20 balance for an address
- `useTokenData` — fetch token name/symbol/decimals
- `useTokenMetadata` — combined token metadata hook
- `useFetchTokens` — fetch all supported tokens for current chain
- `useSubgraphHealth` — check subgraph sync status
- `useInvoiceTemplates` — CRUD for locally-stored invoice templates
- `useRateForResolver` — fetch arbitration fee for a resolver

### Utility Hooks
- `useDebounce` — debounce a value
- `useDetailsPin` — pin invoice metadata to IPFS
- `useFarcasterSearch` — search Farcaster profiles (via API route)
- `useNotify` — send Farcaster notifications via API
- `useIsClient` — SSR-safe client detection

## Patterns

- All write hooks follow: `useSimulateContract` -> `useWriteContract` -> `waitForSubgraphSync`
- Return shape: `{ handleX, isLoading, prepareError, writeError }`
- Accept `toast: UseToastReturn` for user feedback via sonner
- Accept `onTxSuccess` callback for post-tx logic
- Error handling via `errorToastHandler` from utils
- Types for errors: `SimulateContractErrorType`, `WriteContractErrorType` (in `types.ts`)

## Key Files
- `helpers.ts` — `fetchTokenBalance`, `fetchTokenMetadata` (used by hooks internally)
- `prefetchInvoiceDetails.ts` — server-side prefetch for SSR/SSG

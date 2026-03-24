# Constants Package

Static configuration, ABIs, and constant definitions.

## Key Files

- `config.ts` — per-chain network config: subgraph URLs, factory addresses, resolver addresses, supported tokens, zap/DAO/treasury addresses. Defines `NetworkConfig` type and `SUPPORTED_CHAINS`/`SUPPORTED_CHAIN_IDS`. Supported chains: Ethereum, Gnosis, Polygon, Arbitrum, Optimism, Base, Sepolia.
- `form.ts` — form flow definitions: `INVOICE_TYPES` (Updatable, UpdatableV2, Escrow, Instant), `PAYMENT_TYPES` (native/token), `ESCROW_STEPS` (5-step wizard), `INSTANT_STEPS` (4-step wizard), late fee interval options
- `invoice.ts` — invoice-related constants (late fee intervals)
- `baseUrl.ts` — base URL for the app
- `tx.ts` — transaction-related constants
- `misc.ts` — miscellaneous constants

## ABIs (`abi/`)

Typed ABI arrays for contract interaction via viem:
- `ISmartInvoiceFactoryAbi` — factory for creating invoices
- `ISmartInvoiceEscrowAbi` — escrow invoice contract
- `ISmartInvoiceInstantAbi` — instant invoice contract
- `ISmartInvoiceSplitEscrowAbi` — split escrow variant
- `ISmartInvoiceUpdatableAbi` — updatable invoice contract
- `IERC20Abi` — standard ERC20
- `EscrowZapAbi` — zap contract (create + fund in one tx)

## Content (`content/`)

- `toasts.ts` — toast message templates (TOASTS constant) used across all hooks

## Patterns

- Resolver types: `lexdao`, `kleros`, `smart-invoice`, `custom`
- Chain config accessed via helper functions in utils (not imported directly)
- ABIs are typed const arrays compatible with viem's `useSimulateContract`

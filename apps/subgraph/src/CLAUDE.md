# Subgraph Source

The Graph subgraph for indexing Smart Invoice contract events.

## Structure

- `schema.graphql` — GraphQL schema defining `Invoice`, `Deposit`, `Release`, `Resolution`, `Dispute`, `Agreement`, etc.
- `abis/` — Contract ABIs organized by version:
  - `00/` — v0 contracts (SmartInvoice, SmartInvoiceFactory)
  - `01/` — v1 contracts (Escrow, Instant, SplitEscrow, Updatable, UpdatableV2, Factory)
  - `ERC20.json` — standard ERC20 ABI
- `config/` — per-network deployment configs (base, gnosis, mainnet, matic, optimism, arbitrum, sepolia, holesky)
- `mappings/` — event handler mappings:
  - `00/` — v0 handlers (factory.ts, invoice.ts, helpers.ts)
  - `01/` — v1 handlers (factory.ts, invoice.ts, utils.ts, helpers/)
  - `token.ts` — ERC20 token event handlers

## Patterns

- Mappings use AssemblyScript (The Graph's subset) — NOT regular TypeScript
- Each contract version has separate ABI + mapping files
- Factory mappings handle invoice creation events and create new data sources
- Invoice mappings handle deposits, releases, locks, resolutions, withdrawals

## Gotchas

- AssemblyScript has different semantics than TypeScript (no closures, limited stdlib)
- Config files are JSON with contract addresses and start blocks per network
- `subgraph.yaml` (in parent dir) references these source files — update it when adding new handlers

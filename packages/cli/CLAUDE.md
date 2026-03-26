# CLI Package

Standalone CLI for creating and managing sCrow escrow contracts on Base.

## Commands

- `scrow create` — create escrow contract (pins metadata to IPFS, calls factory)
- `scrow release` — release a milestone payment
- `scrow deposit` — deposit funds (ETH or ERC-20)
- `scrow status <address>` — view contract details from subgraph
- `scrow list <address>` — list contracts for a wallet

## Auth

Requires `SCROW_PRIVATE_KEY` environment variable (hex private key with 0x prefix).

## Structure

- `src/index.ts` — CLI entry point (commander)
- `src/config.ts` — Base chain addresses, tokens, URLs
- `src/client.ts` — viem public/wallet client setup
- `src/subgraph.ts` — GraphQL queries to Goldsky subgraph
- `src/ipfs.ts` — Pin metadata to Pinata via dapp's upload-start API
- `src/commands/` — individual command implementations

## Key Patterns

- Uses viem directly (no wagmi/React)
- IPFS pinning goes through the dapp's `/api/upload-start` for Pinata JWT
- Factory address: `0xf9822818143948237a60a1a1cefc85d6f1b929df` (Base)
- Escrow type: `split-escrow` (bytes32)
- Subgraph: Goldsky-hosted on Base

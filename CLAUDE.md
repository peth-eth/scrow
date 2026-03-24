# Scrow (Smart Invoice)

Crypto escrow/invoicing platform. Monorepo with pnpm workspaces.

## Architecture

- `apps/dapp` — Next.js frontend (Pages Router)
- `apps/contracts` — Solidity smart contracts (DO NOT MODIFY)
- `apps/subgraph` — The Graph subgraph
- `packages/hooks` — React hooks for contract interactions (wagmi/viem)
- `packages/forms` — Form components for invoice create/manage flows
- `packages/ui` — Shared UI components (atoms/molecules/organisms)
- `packages/utils` — Utility functions (IPFS, web3, invoice logic, yup schemas)
- `packages/constants` — ABIs, chain config, form step definitions
- `packages/graphql` — Subgraph queries via Apollo + Zeus codegen
- `packages/types` — Shared TypeScript types
- `packages/shared` — Shared logging utilities

## Key Commands

- `pnpm dapp:dev` — run the dapp locally
- `pnpm dapp:build` — build packages then dapp
- `pnpm packages:build` — build all packages
- `pnpm build` — build everything
- `pnpm lint` / `pnpm format` — lint and format
- `pnpm typecheck` — type check all packages

## UI Migration: Chakra UI -> Tailwind + shadcn/ui

Recently migrated from Chakra UI to Tailwind CSS + shadcn/ui. Key points:
- `apps/dapp/components/ui/` — shadcn components (Button, Dialog, Badge, etc.)
- `packages/ui/` — plain HTML + Tailwind classes (NO shadcn imports)
- `packages/forms/` — plain HTML + Tailwind (NO shadcn imports)
- Toasts use `sonner` (configured in `_app.tsx`, wrapped in `packages/ui/src/hooks/useToast.tsx`)
- Some Chakra-era naming persists (e.g. `ChakraNextLink.tsx`) — these are Tailwind now

## Key Patterns

- All hooks return `{ handleX, isLoading, prepareError, writeError }` pattern
- Forms use `react-hook-form` with `yup` validation (schemas in `packages/utils`)
- Contract calls: `useSimulateContract` -> `useWriteContract` -> `waitForSubgraphSync`
- Package scope: `@smartinvoicexyz/*`

## Package-Level CLAUDE.md

See CLAUDE.md in each package's `src/` directory for detailed docs.

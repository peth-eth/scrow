# UI Package

Shared UI components. Uses plain HTML + Tailwind CSS + sonner for toasts. NO shadcn imports.

## Structure

### `atoms/` — Basic building blocks
- `Layout` — app shell with Header, Footer, SubgraphHealthAlert, ConnectWeb3 guard
- `Container` — centered content wrapper
- `ConnectWeb3` — wallet connection prompt
- `AccountAvatar` — user avatar (used in RainbowKit)
- `AccountLink` — linked address display
- `ChakraNextLink` — Next.js link wrapper (Chakra name is legacy, now Tailwind)
- `InvoiceNotFound` — 404 state for invoices
- `Loader` / `Spinner` — loading indicators
- `ShareButton` — copy-to-clipboard share
- `StepInfo` — step indicator for multi-step forms
- `TokenDescriptor` — token name + icon display

### `forms/` — Form input wrappers (react-hook-form integrated)
- `Input` — text input with label, tooltip, error display
- `NumberInput` — numeric input
- `Textarea` — multiline text
- `Select` / `ReactSelect` — native select and react-select wrapper
- `DatePicker` — date input
- `Checkbox` — checkbox with label
- `LinkInput` — URL input with validation

### `molecules/` — Composed components
- `Header` / `Footer` — app header and footer
- `Modal` — generic modal (plain HTML/Tailwind, not shadcn Dialog)
- `InvoiceBadge` — status badge for invoices
- `InvoiceStatusLabel` — human-readable status text
- `InvoiceMetaDetails` — invoice metadata display (dates, resolver, etc.)
- `InvoicePDF` / `InvoicesStyles` — PDF generation support
- `NetworkBadge` — chain indicator
- `NetworkChangeAlertModal` — prompt to switch chains
- `SubgraphHealthAlert` / `SubgraphStatus` — subgraph sync warnings
- `ErrorBoundary` — React error boundary
- `WhatIsThisModal` — info modal explaining escrow

### `organisms/` — Full-page sections
- `InvoiceDashboardTable` — paginated invoice list with filters
- `GenerateInvoicePDF` — PDF export functionality
- `VerifyInvoice` — invoice verification view

### `icons/` — SVG icon components
All icons accept `boxSize`, `className`, and standard SVG props. Types in `types.ts`.

### `hooks/`
- `useToast` — wraps sonner toast with `success/error/warning/loading/info` methods

### `theme/` — Legacy theme config
- `colors.ts` — color constants
- `components/` — component style overrides (Button, Input, etc.) — legacy from Chakra migration

## Patterns

- All form components accept `localForm: UseFormReturn` from react-hook-form
- Styling is plain Tailwind classes — no CSS modules, no styled-components
- Toast via sonner: `useToast()` returns `{ success, error, warning, loading, info }`
- `theme/` directory contains leftover Chakra theme configs — may be removed in future

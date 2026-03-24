# Dapp (Next.js Frontend)

Next.js app using Pages Router. Deployed to Netlify.

## Pages

- `/` — landing/home page
- `/create` — multi-step invoice creation wizard (escrow + instant)
- `/invoices` — dashboard table of user's invoices
- `/invoice/[chainId]/[invoiceId]` — invoice detail page with action modals
- `/invoice/[chainId]/[invoiceId]/locked` — locked invoice view (dispute state)
- `/contracts` — smart contract addresses reference

## API Routes (`pages/api/`)

- `upload-start.ts` — IPFS pinning proxy
- `farcaster.ts` — Farcaster frame/notification endpoint
- `neynar-search.ts` — Farcaster user search proxy (for arbitrator picker)
- `notify.ts` — send notifications

## UI: Tailwind + shadcn/ui

Migrated from Chakra UI. Two UI layers:
- **shadcn components** (`components/ui/`) — Button, Dialog, Badge, Card, Table, Tabs, Dropdown, etc. Used in dapp pages.
- **Package UI** (`@smartinvoicexyz/ui`) — plain Tailwind components shared across packages. Does NOT import from shadcn.

shadcn config: `components.json` at dapp root. Utility helper: `lib/utils.ts` (cn function).

### Available shadcn components:
accordion, alert, avatar, badge, button, card, checkbox, dialog, dropdown-menu, input, label, select, separator, table, tabs, tooltip

## Contexts

- `OverlayContext` — manages modal state for invoice actions (deposit, lock, release, resolve, withdraw, addMilestones, depositTip)
- `FrameContext` — Farcaster frame/mini-app context

## Providers Stack (`_app.tsx`)

ThemeProvider (next-themes) > WagmiProvider > QueryClientProvider > RainbowKitProvider > ErrorBoundary > FrameProvider > OverlayContextProvider > Layout

## Styling

- `styles/globals.css` — Tailwind base + custom CSS variables
- `tailwind.config.ts` / `postcss.config.js` — Tailwind configuration
- Dark mode via `next-themes` with class strategy

## Patterns

- Invoice pages use `getServerSideProps` with `prefetchInvoiceDetails` for SSR
- Action modals opened via `useOverlay()` hook from OverlayContext
- shadcn Button/Badge/Dialog used in page-level code; package forms use `@smartinvoicexyz/ui` inputs
- Toasts via sonner `<Toaster>` in `_app.tsx`, triggered by `useToast()` from ui package

## Key Component

- `SaveTemplateModal` (`components/SaveTemplateModal.tsx`) — save/load invoice templates

# Dapp Pages

Next.js Pages Router pages. All pages use `getServerSideProps` (SSR).

## Key Files

- `_app.tsx` — app shell with provider stack: ThemeProvider > WagmiProvider > QueryClientProvider > HydrationBoundary > RainbowKitProvider > ErrorBoundary > FrameProvider > OverlayContextProvider > Layout. Also mounts Toaster (sonner), ChatBubble, and ReactQueryDevtools.
- `_document.tsx` — custom document
- `index.tsx` — landing page with hero, "How It Works" steps, and CTA buttons
- `invoices.tsx` — dashboard page, renders `InvoiceDashboardTable` from ui package
- `contracts.tsx` — displays factory + token contract addresses per chain (tabbed)
- `create/` — multi-step invoice creation wizard
- `invoice/[chainId]/[invoiceId]/index.tsx` — invoice detail page (uses `prefetchInvoiceDetails` SSR)
- `invoice/[chainId]/[invoiceId]/locked.tsx` — locked/disputed invoice view
- `api/` — API routes (see `api/CLAUDE.md`)

## Patterns

- All pages export `getServerSideProps` (even if just `{ props: {} }`)
- Invoice detail pages prefetch data server-side via `prefetchInvoiceDetails` and pass `dehydratedState`
- Page components import shadcn primitives from `../components/ui/`
- Shared UI comes from `@smartinvoicexyz/ui` package

## Gotchas

- `_app.tsx` defers rendering until client-side mount (`mounted` state) to avoid hydration mismatches with wallet/theme state
- Font (Outfit) loaded via `next/font/google` with CSS variable `--font-outfit`

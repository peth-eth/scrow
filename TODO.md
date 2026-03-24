# Scrow UX Overhaul TODO

## Phase 1: Clarity & Fees ✅
- [x] Show platform fee (1%) in PaymentsForm (Step 3)
- [x] Show arbitration fee info (5% on disputes) in EscrowDetailsForm
- [x] Rename "Safety Valve Date" → "Withdrawal Deadline" across app
- [x] Rename "Resolver" → "Arbitrator" across app
- [x] Rename "Locked" status → "Disputed" across app
- [x] Rename "Lock Funds" button → "Raise Dispute"
- [x] Add role badge ("You are the Client/Provider/Arbitrator") on invoice detail
- [x] Add ? tooltips: escrow concept, dispute process, release, withdraw, fees
- [x] Remove /contracts from main nav (already not in nav)

## Phase 2: Chakra → shadcn/ui + Roadmapr Theme (foundation laid)
- [x] Set up Tailwind CSS + shadcn/ui config with Roadmapr colors
- [ ] Migrate layout components (Container, Header, Footer)
- [ ] Migrate form components (Input, Select, Checkbox, Button)
- [ ] Migrate feedback components (Alert, Toast, Spinner, Modal)
- [ ] Migrate data display (Table, Accordion, Badge, Avatar)
- [ ] Add dark mode toggle
- [ ] Redesign invoice detail page (Overview | Payments | Disputes tabs)

## Phase 3: UX Polish ✅
- [x] Add step progress bar to create flow
- [x] Redesign home page with value prop + hero
- [x] Add invoice list filters (role, status)
- [x] Improve Release/Withdraw/Lock modals with context
- [x] Add "What happens next?" section on success page

## Phase 4: New Features ✅
- [x] Activity notifications system (Telegram + Farcaster DCs)
- [x] Invoice template: save, load, reuse
- [ ] In-app contextual help / chatbot (future)

## Robustness Fixes ✅
- [x] Fix SSR localStorage crash in sync.ts
- [x] Fix token metadata crash (allowFailure: true)
- [x] Fix IPFS retry + safe JSON parsing
- [x] Fix notification timeout (5s AbortController)
- [x] Fix subgraph sync timeout handling
- [x] Deduplicate FarcasterUser/NotificationEvent types
- [x] Extract ARBITRATION_FEE_PERCENT constant
- [x] Parallelize notification sends
- [x] Add AbortController to useFarcasterSearch
- [x] Use Chakra useOutsideClick in FarcasterArbitratorPicker

## Remaining Robustness (future)
- [ ] Add error aggregation in useInvoiceDetails
- [ ] Fix BigInt serialization in prefetchInvoiceDetails
- [ ] Add milestone amount validation (> 0) in PaymentsForm
- [ ] Handle duplicate error toasts in useInvoiceCreate

## Before Deploying
- [ ] Set PLATFORM_FEE_ADDRESS in packages/constants/src/config.ts
- [ ] Add NEYNAR_API_KEY to production .env
- [ ] Add TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID to production .env
- [ ] Install new dependencies: tailwindcss, tailwindcss-animate, autoprefixer, clsx, tailwind-merge

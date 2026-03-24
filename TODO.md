# Scrow UX Overhaul TODO

## Phase 1: Clarity & Fees
- [ ] Show platform fee (1%) in PaymentsForm (Step 3)
- [ ] Show arbitration fee info (5% on disputes) in EscrowDetailsForm
- [ ] Rename "Safety Valve Date" → "Withdrawal Deadline" across app
- [ ] Rename "Resolver" → "Arbitrator" across app
- [ ] Rename "Locked" status → "Disputed" across app
- [ ] Rename "Lock Funds" button → "Raise Dispute"
- [ ] Add role badge ("You are the Client/Provider/Arbitrator") on invoice detail
- [ ] Add ? tooltips: escrow concept, dispute process, release, withdraw, fees
- [ ] Remove /contracts from main nav (keep as hidden route)

## Phase 2: Chakra → shadcn/ui + Roadmapr Theme
- [ ] Install shadcn/ui + Tailwind CSS in dapp
- [ ] Configure Roadmapr color scheme (purple primary, dark default)
- [ ] Migrate layout components (Container, Header, Footer)
- [ ] Migrate form components (Input, Select, Checkbox, Button)
- [ ] Migrate feedback components (Alert, Toast, Spinner, Modal)
- [ ] Migrate data display (Table, Accordion, Badge, Avatar)
- [ ] Add dark mode toggle
- [ ] Redesign invoice detail page (Overview | Payments | Disputes tabs)

## Phase 3: UX Polish
- [ ] Add step progress bar to create flow
- [ ] Redesign home page with value prop + hero
- [ ] Add invoice list filters (role, status, date sort)
- [ ] Improve Release/Withdraw/Lock modals with context
- [ ] Add "What happens next?" section on success page

## Phase 4: New Features
- [ ] Activity notifications system (Farcaster DC / Telegram)
- [ ] Invoice template: save, load, reuse
- [ ] In-app contextual help system

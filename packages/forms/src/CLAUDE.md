# Forms Package

Form components for invoice creation and management flows. Uses react-hook-form + yup.

## Invoice Create Flow (Escrow)

Multi-step wizard driven by `ESCROW_STEPS` from constants:
1. `ProjectDetailsForm` — title, description, document link, dates
2. `EscrowDetailsForm` — resolver selection, token, safety valve
3. `PaymentsForm` — milestone amounts
4. `FormConfirmation` — review all details before submit
5. `RegisterSuccess` — post-creation success view

## Invoice Create Flow (Instant)

Shorter wizard driven by `INSTANT_STEPS`:
1. `ProjectDetailsForm` (shared with escrow)
2. `InstantPaymentForm` — payment token, amount, deadline, late fees
3. `InstantPaymentDetails` — confirmation view

## Invoice Detail Page Forms (Modal Actions)

These are modal forms opened from the invoice detail page via `OverlayContext`:
- `DepositFunds` — deposit into an escrow invoice
- `DepositTip` — tip on top of invoice amount
- `ReleaseFunds` — release a milestone
- `LockFunds` — lock funds for dispute
- `ResolveFunds` — arbitrator resolves a dispute
- `WithdrawFunds` — withdraw after safety valve
- `AddMilestones` — add milestones to existing invoice

## Button Managers

- `InvoiceButtonManager` — renders action buttons based on invoice state/role (client/provider/resolver)
- `InstantButtonManager` — same for instant invoices

## Other

- `FarcasterArbitratorPicker` — search and select a Farcaster user as arbitrator

## Patterns

- Uses plain HTML + Tailwind CSS (NOT shadcn/ui imports)
- Each form has a local `useForm()` for step-local validation + parent `invoiceForm` for wizard state
- Yup schemas live in `@smartinvoicexyz/utils` (e.g. `projectDetailsSchema`)
- Form inputs come from `@smartinvoicexyz/ui` (Input, Select, DatePicker, etc.)
- All action forms accept `invoice: InvoiceDetails` and `toast: UseToastReturn`

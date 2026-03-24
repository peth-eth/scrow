# Creating an Instant Invoice

An instant invoice is a simple one-time payment request with a deadline and optional late fee. No milestones, no arbitrator, no escrow complexity.

## When to Use Instant vs Escrow

| | Instant | Escrow |
|---|---|---|
| Payment structure | Single lump sum | Multiple milestones |
| Dispute protection | None | Arbitrator resolves disputes |
| Late fees | Built-in, configurable | Not available |
| Best for | Quick jobs, retainers, simple payments | Multi-phase projects, high-value work |

Use instant when trust is already established or the job is straightforward. Use escrow when you need milestone-based protection.

## What You Need

- A wallet connected to Base, Gnosis, or Arbitrum
- Your client's wallet address

## The 4-Step Wizard

### Step 1: Project Details

Same fields as the escrow flow:

- **Title** (required)
- **Description** (required)
- **Project Proposal, Agreement or Specification** (optional URL)
- **Start Date** (defaults to today)
- **Estimated End Date** (defaults to 7 days from now)
- **Deadline** -- the date when payment is due. After this date, late fees start accruing. Defaults to one month from now.

Note: instant invoices show "Deadline" instead of "Withdrawal Deadline" -- they serve different purposes.

Click **Next: payment details** to continue.

### Step 2: Payment Details

Set the payment terms:

- **Client Address** -- the wallet that will pay you
- **Service Provider Address** -- your wallet (where funds are sent)
- **Total Payment Due** -- the amount owed, in tokens (e.g. 500 USDC)
- **Payment Token** -- which cryptocurrency to pay in
- **Late Fee** -- an optional fee charged per interval after the deadline passes (e.g. 10 USDC)
- **Late Fee Interval** -- how often the late fee is charged. Options: every day, every 2 days, every week, every 2 weeks, or every 4 weeks.

Click **Next: confirm invoice** to continue.

### Step 3: Confirmation

Review the summary:

- Client and provider addresses
- Payment amount and token
- Deadline
- Late fee and interval (if set)

Click **Next: create invoice** to submit. Your wallet prompts for a transaction signature.

### Step 4: Invoice Created

Same success screen as the escrow flow -- you get an invoice ID and a shareable link. Send the link to your client.

## How Late Fees Work

If the client has not paid by the deadline, the late fee amount is added to the total owed for every interval that passes. For example: 10 USDC late fee with a "every week" interval means the total increases by 10 USDC each week after the deadline.

Late fees accrue automatically on-chain. The client sees the updated total when they go to pay.

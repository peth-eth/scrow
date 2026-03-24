# Raising a Dispute

If something goes wrong during a project, either the client or the provider can raise a dispute to freeze funds and bring in an arbitrator.

## What You Need

- To be the **client** or the **provider** on the invoice
- Funds currently held in the escrow (you cannot dispute an empty invoice)
- A wallet connected to the correct chain

## What Happens When You Raise a Dispute

1. All remaining funds in the escrow are **frozen** -- no releases or withdrawals can happen.
2. The arbitrator assigned during invoice creation is notified.
3. The arbitrator reviews the case, the project agreement, and your dispute reasoning.
4. The arbitrator decides how to split the frozen funds between client and provider.
5. A 5% arbitration fee is deducted from the frozen amount and sent to the arbitrator.

## How to Raise a Dispute

1. Open the invoice page and click the **Lock** button. A modal titled **Raise Dispute** appears.
2. Fill in the form:
   - **Dispute Reason** (required) -- explain why you are raising the dispute. Be specific. The arbitrator reads this.
   - **Dispute Attachment** (optional) -- a URL linking to supporting evidence (screenshots, chat logs, deliverables, etc.).
3. The modal shows the arbitrator address and reminds you of the resolution fee.
4. Click **Raise Dispute** to confirm. The button shows the total amount being locked (e.g. "Raise Dispute 500.0000 USDC"). Your wallet prompts for a transaction.

## The 5% Arbitration Fee

The arbitrator receives 5% of the disputed funds as compensation for resolving the case. This fee is deducted from whatever amount the arbitrator distributes.

For example, if 1,000 USDC is locked:
- Arbitration fee: 50 USDC (to the arbitrator)
- Remaining 950 USDC is split between client and provider per the ruling

This fee only applies when a dispute is raised. Normal milestone releases only have the 1% platform fee.

## Kleros-Specific Requirements

If you chose Kleros as your arbitrator during invoice creation:

- The total invoice value must be **at least $1,000 USD** at the time of locking. Smart Invoice will not escalate claims below this threshold.
- You must also fill out a **Google Form** in addition to raising the on-chain dispute. A link to the form appears in the modal after you submit.
- Kleros uses decentralized jurors. The court you selected during creation (General, Solidity, or Javascript) determines who reviews your case and the juror rewards.

## What Happens After Raising

- The invoice enters a "locked" state visible to all parties.
- No further milestone releases or deposits can happen.
- The arbitrator (or Kleros court) reviews the dispute at their own pace.
- Once the arbitrator makes a ruling, they call the resolve function on-chain to distribute funds.
- After resolution, the invoice is settled and cannot be disputed again.

## Before You Dispute

Disputes are irreversible. Once you lock funds, only the arbitrator can unlock them. Consider reaching out to the other party first. A dispute should be a last resort, not a negotiation tactic.

The arbitrator's terms of service are linked at the bottom of the dispute modal. Review them before proceeding.

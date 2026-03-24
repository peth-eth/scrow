# Resolving a Dispute

How the arbitrator settles a dispute and distributes locked funds.

## Who Can Resolve

Only the **arbitrator** assigned to the invoice can resolve a dispute. Neither the client nor the provider can do this. The arbitrator was chosen when the invoice was created (see [Choosing an Arbitrator](./choosing-an-arbitrator.md)).

## When You Can Resolve

The invoice must be in a **locked (disputed)** state. If the invoice is not disputed, the Resolve Dispute form will show "Invoice is not disputed" and no action is available.

## The Resolve Form

When you open the resolve modal, you will see:

1. **Resolution Comments** (required) — Explain your reasoning. Up to 10,000 characters. Both parties will see this.
2. **Resolution link** (optional) — A URL to supporting documentation, evidence, or a detailed write-up.
3. **Client Award** — The amount returned to the client.
4. **Provider Award** — The amount sent to the provider.
5. **Arbitration Fee** — Auto-calculated, non-editable. This is your fee for resolving the dispute.

## How Funds Are Distributed

The total locked balance is split three ways:

- **Arbitration Fee (5%)** — Deducted automatically from the locked balance and sent to the arbitrator. This field is read-only; you cannot change it.
- **Client Award + Provider Award** — The remaining balance (total minus the 5% fee) is yours to divide between client and provider however you see fit.

The Client Award and Provider Award fields are linked. When you increase one, the other decreases automatically. The two must add up to the available balance (total minus arbitration fee).

## After Resolution

- The transaction executes on-chain, distributing funds to all three parties in a single transaction.
- A notification is sent with the resolution details (e.g., "Client: 80, Provider: 20").
- The invoice status updates to resolved.
- The resolution is final and cannot be reversed.

## Example

An invoice has 1,000 USDC locked in dispute:

| Recipient | Amount |
|-----------|--------|
| Arbitrator (5%) | 50 USDC |
| Client Award | 570 USDC |
| Provider Award | 380 USDC |
| **Total** | **1,000 USDC** |

The arbitrator decides the split. There is no formula — it is a judgment call based on the evidence.

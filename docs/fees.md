# Fees

What sCrow charges and when.

## Platform Fee: 1%

A **1% fee** is deducted from every milestone release. When a client releases a milestone payment to the provider, 1% of that amount goes to the platform.

- Calculated in basis points: 100 out of 10,000 (1%).
- Applied automatically on-chain. You will see it reflected during invoice creation.
- Paid in the same token as the invoice (e.g., if the invoice is in USDC, the fee is in USDC).

### Example

You release a 1,000 USDC milestone:

| | Amount |
|---|--------|
| Provider receives | 990 USDC |
| Platform fee (1%) | 10 USDC |

## Arbitration Fee: 5%

A **5% fee** is charged **only if a dispute occurs**. It is deducted from the locked (disputed) funds and paid to the arbitrator who resolves the dispute.

- Only applies when the invoice enters a locked/disputed state and is resolved by the arbitrator.
- The arbitrator sees this as a read-only "Arbitration Fee" field in the resolve form.
- If no dispute happens, this fee is never charged.

### Example

A dispute involves 2,000 USDC locked in escrow:

| | Amount |
|---|--------|
| Arbitrator fee (5%) | 100 USDC |
| Available for client + provider | 1,900 USDC |

The arbitrator decides how to split the remaining 1,900 USDC between client and provider.

## Gas Fees

All on-chain actions (creating invoices, depositing, releasing, locking, resolving, withdrawing) require gas. Gas fees are paid by the user initiating the transaction and go to the blockchain network, not to sCrow.

Gas costs vary by chain. Base and Gnosis tend to have the lowest fees. Arbitrum is also relatively cheap. Choose your chain accordingly.

## Summary

| Fee | Amount | When | Paid by |
|-----|--------|------|---------|
| Platform fee | 1% | Every milestone release | Deducted from release |
| Arbitration fee | 5% | Only during dispute resolution | Deducted from locked funds |
| Gas | Varies | Every on-chain action | User initiating the tx |

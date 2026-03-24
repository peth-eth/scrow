# Withdrawing Funds

How the client reclaims remaining escrow funds after the withdrawal deadline.

## When Withdrawal Is Available

You can withdraw when **both** conditions are met:

1. **The Withdrawal Deadline has passed.** This is the safety valve date set when the invoice was created. It is the latest date by which all work should be complete.
2. **There is no active dispute.** If the invoice is locked (disputed), you must wait for the arbitrator to resolve it first.

## Who Can Withdraw

Only the **client** (the wallet address that funded the escrow) can withdraw.

## What Happens

The withdraw modal shows:

- **"Amount To Be Withdrawn"** — The full remaining token balance in the escrow, displayed with the token symbol (e.g., "500 USDC").

Click **Withdraw** and confirm the transaction in your wallet. The entire remaining balance is sent to the client address in a single transaction.

A notification is sent confirming the withdrawal amount and token.

## Why This Exists

The withdrawal deadline is a safety net. If a provider disappears or work stalls, you are not locked out of your funds forever. Once the deadline passes, you can reclaim whatever has not been released.

If work is still in progress and both parties agree, create a new invoice with a later deadline rather than withdrawing mid-project.

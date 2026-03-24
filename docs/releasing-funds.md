# Releasing Funds

Releasing funds sends the current milestone payment from the escrow contract to the provider's wallet.

## What You Need

- To be the **client** on the invoice (only the client can release)
- Funds deposited in the escrow that cover the current milestone
- A wallet connected to the correct chain

## How to Release

1. Open the invoice page and click the **Release** button. A modal titled **Release Funds** appears.
2. The modal shows the **Amount To Be Released** -- this is the current milestone amount (or the full remaining balance if it is the last milestone).
3. Below the amount, you will see the platform fee breakdown. For example: "A 1% platform fee (0.50 USDC) will be deducted from this release."
4. Click **Release** to confirm. Your wallet prompts for a transaction signature.
5. After the transaction confirms, funds are sent to the provider's address minus the platform fee.

## Platform Fee

A 1% fee is deducted from every release. The fee is calculated in basis points (100 out of 10,000).

| Milestone Amount | Fee (1%) | Provider Receives |
|---|---|---|
| 100 USDC | 1 USDC | 99 USDC |
| 500 USDC | 5 USDC | 495 USDC |
| 1,000 USDC | 10 USDC | 990 USDC |

The fee is taken at the contract level during the release transaction. You do not need to calculate or send it separately.

## What "Release" Means On-Chain

When you click Release, the smart contract:

1. Calculates the current milestone amount from the stored milestone array
2. Deducts the 1% platform fee and sends it to the platform treasury
3. Transfers the remaining amount to the provider's address
4. Advances the milestone counter so the next release sends the next milestone

This is a single on-chain transaction. Once confirmed, it cannot be reversed.

## Who Can Release

Only the client wallet address set during invoice creation can call release. The provider cannot release funds to themselves. This is the core protection of the escrow -- the client controls when funds flow out.

If there is a dispute, releases are blocked until the arbitrator resolves it.

## Releasing the Last Milestone

On the final milestone, if the escrow balance exceeds the milestone amount (e.g. from overfunding), the entire remaining balance is released to the provider.

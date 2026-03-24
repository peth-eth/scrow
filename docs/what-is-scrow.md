# What is sCrow?

sCrow is a trustless escrow platform for web3 freelancers. You create an invoice, your client deposits funds into a smart contract, and payments release as milestones are completed. No accounts, no KYC -- just connect your wallet.

## How It Works

1. **You create an invoice** with project details, milestones, and a payment token.
2. **Your client deposits funds** into the escrow smart contract.
3. **Client releases milestones** as you deliver work.
4. **If something goes wrong**, either side can raise a dispute. An arbitrator reviews the case and distributes funds fairly.

Funds sit in a smart contract the entire time -- neither party can run off with the money.

## Supported Chains

sCrow is deployed on three networks:

- **Base** -- low fees, fast transactions
- **Gnosis** -- xDai-native, very cheap
- **Arbitrum** -- Ethereum L2, widely used

Your wallet network determines which chain you create on. You can switch networks at any time before creating an invoice.

## Fee Structure

- **Platform fee:** 1% deducted from each milestone release. If a milestone is 100 USDC, the provider receives 99 USDC.
- **Arbitration fee:** 5% of disputed funds, only charged if a dispute is raised and resolved. No dispute = no arbitration fee.

There are no fees to create an invoice or deposit funds.

## No Accounts Required

sCrow has no sign-up, no email, no KYC. You connect your wallet (via RainbowKit), create an invoice, and share the link. Your client connects their wallet to deposit and interact with the invoice.

All invoice metadata is stored on IPFS and is publicly visible. If your project details are sensitive, use a private document link in the agreement field.

## Invoice Types

sCrow supports two invoice types:

- **Escrow Invoice** -- milestone-based payments with arbitration protection. Best for multi-phase projects.
- **Instant Invoice** -- single payment with a deadline and optional late fees. Best for simple one-off jobs.

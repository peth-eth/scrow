# Choosing an Arbitrator

How to pick who resolves disputes on your invoice.

## Overview

During invoice creation (Step 2 — Escrow Details), you choose an **Arbitration Provider**. This is the person or system that will settle any disputes. You will see three buttons: **Community**, **Kleros**, and **Custom Address**.

The arbitrator only gets involved if a dispute is filed. If everything goes smoothly, they never need to act.

## Community (Farcaster Search)

**Best for: most bounties and freelance work.**

This is the default mode. It searches Farcaster for a user and auto-resolves their connected ETH wallet address.

- A default arbitrator (**@peth**) is pre-selected when you open the form.
- To change it, click **Change**, then type a Farcaster username in the search box.
- Select a user from the dropdown. Their profile picture and username will display.
- If a user has no connected Ethereum wallet, they will appear grayed out with "(no wallet)" and cannot be selected.

The selected user's ETH address is used as the arbitrator on-chain. They will need to connect that same wallet to resolve any dispute.

## Kleros

**Best for: high-value invoices over $1,000.**

Kleros is a decentralized arbitration protocol. Instead of a single person, a panel of anonymous jurors reviews the dispute.

- A warning banner appears: "Only choose Kleros if total invoice value is greater than 1000 USD."
- Select a **Kleros Court** from the dropdown:
  - **General Court** — 3 jurors, 13 DAI/USDC per juror
  - **Solidity Court** — 2 jurors, 30 DAI/USDC per juror
  - **Javascript Court** — 2 jurors, 30 DAI/USDC per juror
- You must check the box agreeing to Kleros's terms of service.

Kleros is more formal and slower than a community arbitrator, but it is trustless and suitable for large amounts.

## Custom Address

**Best for: when you have a specific trusted third party.**

Paste any Ethereum address into the **Arbitration Provider Address** field. This could be a friend, a DAO multisig, a legal entity, or anyone both parties trust.

No verification is performed on the address. Make sure it is correct and that the person behind it knows they may be called on to arbitrate.

## The 5% Arbitration Fee

Regardless of which mode you choose, the form displays a note:

> If a dispute occurs, the arbitrator receives a 5% resolution fee from the disputed funds.

This fee is only charged if a dispute actually happens. See [Fees](./fees.md) for details.

## How to Pick

| Situation | Recommended Mode |
|-----------|-----------------|
| Standard freelance work, bounties | **Community** (default @peth) |
| Invoice over $1,000, no trusted arbitrator | **Kleros** |
| Both parties trust a specific person or org | **Custom Address** |

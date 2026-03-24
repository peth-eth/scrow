# FAQ

Common questions about using sCrow.

---

**Is sCrow free?**

No. There is a 1% platform fee on every milestone release and a 5% arbitration fee if a dispute occurs. See [Fees](./fees.md) for details.

---

**What chains are supported?**

Base, Gnosis, and Arbitrum are the currently active chains. The contracts are also deployed on Ethereum mainnet, Polygon, and Optimism, but these are not enabled in the current UI.

---

**Do I need an account?**

No. Connect any Ethereum-compatible wallet (MetaMask, Rainbow, Coinbase Wallet, etc.) and you are ready to go. There is no signup, no email, no profile to create.

---

**Is my data private?**

Invoice metadata (title, description, milestone details, document links) is stored on **IPFS**, which is public. Anyone with the IPFS hash can view it. If you have privacy concerns, keep sensitive details in your linked project document and set appropriate access permissions there.

---

**Can I use Bitcoin?**

No. sCrow runs on EVM-compatible chains only. You need ERC-20 tokens or the chain's native currency (e.g., ETH on Base, xDAI on Gnosis).

---

**What if the arbitrator does not respond?**

The **Withdrawal Deadline** is your safety net. This is a date you set when creating the invoice. Once it passes, the client can withdraw all remaining funds from the escrow regardless of dispute status. No arbitrator action is needed.

---

**Can I add milestones after creation?**

Yes. The invoice detail page has an **Add Milestones** action that lets you append new milestones to an existing invoice.

---

**What tokens can I use?**

Any ERC-20 token available on the selected chain, plus the chain's native wrapped token (WETH, wxDAI, etc.). The token is chosen during invoice creation in the Payments step.

---

**How do notifications work?**

sCrow sends notifications on key events: deposits, releases, disputes, resolutions, and withdrawals. Notifications are delivered via an API endpoint that supports Farcaster and Telegram. They are best-effort — if a notification fails to send, it will not block the transaction.

---

**What is the Withdrawal Deadline?**

A date set during invoice creation. It is the latest date by which all work and payments should be complete. After this date passes, the client can withdraw any remaining funds from the escrow — even if milestones have not been released. This protects the client from funds being locked indefinitely. If work is ongoing, both parties should agree on a new invoice with an extended deadline.

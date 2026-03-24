# Creating an Escrow Invoice

Create a milestone-based escrow invoice to protect both you and your client. Funds lock in a smart contract and release as work is delivered.

## What You Need

- A wallet connected to Base, Gnosis, or Arbitrum
- Your client's wallet address
- A plan for milestones and amounts

## The 5-Step Wizard

### Step 1: Project Details

Fill in the basics about your project:

- **Title** -- the name of the project (required)
- **Description** -- scope, deliverables, expectations (required)
- **Project Proposal, Agreement or Specification** -- a URL to an external document (optional, but recommended)
- **Start Date** -- when work begins (defaults to today)
- **Estimated End Date** -- when you expect to finish (defaults to 7 days from now)
- **Withdrawal Deadline** -- the safety valve date. If the project is not completed or disputed by this date, the client can withdraw all remaining funds. Set this well into the future to give yourself enough time. Defaults to one month from now.

Click **Next: payment details** to continue.

### Step 2: Escrow Details

Set the parties and choose an arbitrator:

- **Client Address** -- your client's wallet address (the address that will deposit and release funds)
- **Service Provider Address** -- your wallet address (where released funds are sent)
- **Arbitration Provider** -- who resolves disputes if one is raised. Three options:
  - **Community** -- search for an arbitrator by their Farcaster username. The default suggestion is `peth`.
  - **Kleros** -- decentralized court system. Only use if the total invoice value exceeds $1,000. You pick a court (General, Solidity, or Javascript) and agree to Kleros terms of service.
  - **Custom Address** -- paste any wallet address as your arbitrator.

A note appears reminding you that the arbitrator receives a 5% fee from disputed funds, only if a dispute actually occurs.

Click **Next: set payment amounts** to continue.

### Step 3: Payment Details

Choose your payment token and define milestones:

- **Payment Token** -- the cryptocurrency you want to be paid in. Available tokens depend on your connected network.
- **Milestones** -- each milestone has a title, amount, and optional description. The form starts with two milestones. Click **Add a new milestone** to add more, or the trash icon to remove one.

The bottom of the form shows:
- Total milestone count and sum
- Platform fee reminder (1% on each release)
- Arbitration fee reminder (5%, only on disputes)

Click **Next: confirmation** to continue.

### Step 4: Confirmation

Review everything before submitting:

- Project title, description, and document link
- Client and provider addresses
- Platform fee (1%) and arbitration fee (5% on disputes)
- Start date, end date, and withdrawal deadline
- Arbitration provider address
- Milestone count and first payment due

If everything looks correct, click **Next: create invoice**. Your wallet will prompt you to sign the transaction. After confirmation, the app waits for the chain to confirm and the subgraph to index.

You can also click **Save as Template** to save the current form values for reuse later.

### Step 5: Invoice Created

You will see:
- A link to your transaction on the block explorer
- Your invoice ID (copyable)
- A shareable invoice link (copyable)

Share the invoice link with your client so they can deposit funds.

## Templates

On Step 1, if you have saved templates, a **Load Template** dropdown appears at the top. Templates save: title, description, document, milestones, token, and resolver settings. Useful if you invoice the same client repeatedly.

## Important Notes

- All invoice data is stored publicly on IPFS. Anyone with the link can view it.
- Switching your wallet network mid-wizard resets you to Step 1.
- The withdrawal deadline is a safety net for the client, not a project deadline. Set it far enough out that you will not be caught off guard.

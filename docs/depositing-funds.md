# Depositing Funds

Once a provider shares an invoice link with you, you deposit funds into the escrow contract to kick off the project.

## What You Need

- The invoice link from your provider
- A wallet connected to the same chain the invoice was created on
- Enough tokens (or native currency) to cover at least the next milestone

## How to Deposit

1. Open the invoice link in your browser and connect your wallet.
2. Click the **Deposit** button on the invoice page. A modal titled **Pay Invoice** appears.
3. Choose how much to deposit using one of two methods:

### Option A: Check Milestones

Each milestone is listed with a checkbox and its amount. Check the milestones you want to fund. The deposit amount updates automatically.

Already-funded milestones appear grayed out and cannot be re-selected.

### Option B: Enter a Manual Amount

Below the milestone checkboxes, you will see **Enter a Manual Deposit Amount** with a number input. Type any amount you want to deposit.

You can also choose between the ERC-20 token (e.g. USDC) or the native token (e.g. ETH) using the dropdown next to the amount field. This option only appears if the invoice token is the wrapped version of the chain's native currency (e.g. WETH on Base).

4. The modal shows three values at the bottom:
   - **Total Deposited** -- how much has already been deposited
   - **Total Due** -- the current milestone amount still owed
   - **Your Balance** -- your wallet balance in the selected token

5. Click **Deposit** to confirm. Your wallet prompts for a transaction signature.

## What Happens After Deposit

- The funds are transferred to the escrow smart contract. Neither you nor the provider can unilaterally withdraw them.
- The provider can now see the deposit on the invoice page.
- The client (you) can release milestone payments as work is delivered.
- If the invoice is fully funded, no further deposits are needed until milestones are added.

## Native Token Wrapping

If the invoice uses a wrapped native token (like WETH), you can deposit using the chain's native currency (ETH). The contract wraps it automatically. A tooltip explains: "Your ETH will be automagically wrapped to WETH tokens."

## Warnings

- If your deposit exceeds the total amount due, a warning appears: "Your deposit is greater than the total amount due!"
- If your balance is less than the deposit amount, a warning appears and the Deposit button is disabled.

## Minimum Deposit

You need to deposit at least enough to cover the next milestone. The modal reminds you: "At a minimum, you'll need to deposit enough to cover the first/next project payment."

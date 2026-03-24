# Invoice Templates

Save and reuse invoice settings so you do not have to fill out the same details every time.

## What Templates Are

A template is a snapshot of your invoice form fields. If you regularly create invoices with the same structure (e.g., same milestones, same token, same arbitrator), save it as a template and load it with one click next time.

## How to Save a Template

1. Fill out the invoice creation form as usual (Steps 1 through 3).
2. On **Step 4** (the confirmation/review step), click **"Save as Template"** at the bottom.
3. Enter a name for the template (e.g., "Monthly Design Retainer") and confirm.
4. A success toast will confirm the template was saved.

## How to Load a Template

1. Start creating a new invoice. On **Step 1**, if you have any saved templates, a **"Load Template"** button appears near the top.
2. Click it to open a dropdown listing all your saved templates by name.
3. Select one. The form fields will be populated with the template's saved values.
4. A success toast confirms the template was loaded.
5. You can still edit any field before submitting — the template is just a starting point.

## What Gets Saved

| Field | Saved? |
|-------|--------|
| Title | Yes |
| Description | Yes |
| Document link | Yes |
| Milestones (amounts + titles + descriptions) | Yes |
| Payment token | Yes |
| Resolver type (Community/Kleros/Custom) | Yes |
| Resolver address | Yes |
| Client/Provider addresses | No |
| Dates (deadlines) | No |

## Storage

Templates are stored **locally in your browser** using localStorage. They are not uploaded to IPFS or stored on-chain.

This means:

- Templates are tied to your browser and device. Switching browsers or clearing site data will delete them.
- They are free — no gas cost, no transaction needed.
- They are private — no one else can see your templates.

## Deleting Templates

Templates can be deleted programmatically but there is no delete button in the current UI. To clear all templates, clear your browser's site data for the sCrow domain.

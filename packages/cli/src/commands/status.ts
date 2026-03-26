import { formatUnits } from 'viem';

import { TOKENS } from '../config.js';
import { fetchInvoice, fetchInvoicesByAddress } from '../subgraph.js';

function findTokenSymbol(tokenAddress: string): {
  symbol: string;
  decimals: number;
} {
  const lower = tokenAddress.toLowerCase();
  for (const [symbol, info] of Object.entries(TOKENS)) {
    if (info.address.toLowerCase() === lower) {
      return { symbol, decimals: info.decimals };
    }
  }
  return { symbol: tokenAddress.slice(0, 10) + '...', decimals: 18 };
}

export async function showStatus(contract: string) {
  const invoice = await fetchInvoice(contract);
  if (!invoice) {
    console.error(`Contract not found: ${contract}`);
    return process.exit(1);
  }

  const { symbol, decimals } = findTokenSymbol(invoice.token);
  const current = parseInt(invoice.currentMilestone, 10);
  const total = invoice.amounts.length;

  console.log(`\n  sCrow Contract: ${invoice.id}`);
  console.log(`  ${'─'.repeat(50)}`);
  console.log(`  Token:       ${symbol}`);
  console.log(`  Client:      ${invoice.client}`);
  console.log(`  Provider:    ${invoice.provider}`);
  console.log(`  Resolver:    ${invoice.resolver}`);
  console.log(`  Locked:      ${invoice.isLocked ? 'YES (disputed)' : 'No'}`);
  console.log(`  Progress:    ${current}/${total} milestones released`);
  console.log(
    `  Released:    ${formatUnits(BigInt(invoice.released), decimals)} ${symbol}`,
  );
  console.log(
    `  Total:       ${formatUnits(BigInt(invoice.total), decimals)} ${symbol}`,
  );

  const termDate = new Date(parseInt(invoice.terminationTime, 10) * 1000);
  console.log(`  Safety Valve: ${termDate.toISOString().split('T')[0]}`);

  if (invoice.amounts.length > 0) {
    console.log(`\n  Milestones:`);
    invoice.amounts.forEach((amt, i) => {
      const status = i < current ? '✓' : i === current ? '→' : ' ';
      console.log(
        `    ${status} ${i + 1}. ${formatUnits(BigInt(amt), decimals)} ${symbol}`,
      );
    });
  }

  if (invoice.deposits.length > 0) {
    console.log(`\n  Recent Deposits:`);
    invoice.deposits.slice(0, 5).forEach(d => {
      const date = new Date(parseInt(d.timestamp, 10) * 1000)
        .toISOString()
        .split('T')[0];
      console.log(
        `    ${date}  ${formatUnits(BigInt(d.amount), decimals)} ${symbol}  from ${d.sender.slice(0, 8)}...`,
      );
    });
  }

  console.log('');
}

export async function listContracts(address: string) {
  const invoices = await fetchInvoicesByAddress(address);
  if (invoices.length === 0) {
    console.log(`No contracts found for ${address}`);
    return;
  }

  console.log(`\n  Contracts for ${address.slice(0, 8)}...${address.slice(-6)}`);
  console.log(`  ${'─'.repeat(60)}`);

  for (const inv of invoices) {
    const { symbol, decimals } = findTokenSymbol(inv.token);
    const current = parseInt(inv.currentMilestone, 10);
    const total = inv.amounts.length;
    const released = formatUnits(BigInt(inv.released), decimals);
    const totalAmt = formatUnits(BigInt(inv.total), decimals);
    const locked = inv.isLocked ? ' [DISPUTED]' : '';
    const role =
      inv.client.toLowerCase() === address.toLowerCase()
        ? 'client'
        : 'provider';

    console.log(
      `  ${inv.id.slice(0, 10)}...  ${current}/${total} milestones  ${released}/${totalAmt} ${symbol}  (${role})${locked}`,
    );
  }

  console.log('');
}

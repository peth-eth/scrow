import { type Address } from 'viem';

import { getAccount, getPublicClient, getWalletClient } from '../client.js';
import { fetchInvoice } from '../subgraph.js';

const ESCROW_ABI = [
  {
    inputs: [{ name: '_milestone', type: 'uint256' }],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

type ReleaseOptions = {
  contract: string;
  milestone?: string;
};

export async function releaseContract(opts: ReleaseOptions) {
  const invoice = await fetchInvoice(opts.contract);
  if (!invoice) {
    console.error(`Contract not found: ${opts.contract}`);
    return process.exit(1);
  }

  const current = parseInt(invoice.currentMilestone, 10);
  const total = invoice.amounts.length;
  const milestoneIdx = opts.milestone
    ? parseInt(opts.milestone, 10)
    : current;

  console.log(
    `Releasing milestone ${milestoneIdx + 1} of ${total}`,
  );

  const account = getAccount();
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();

  const contractAddress = opts.contract as Address;

  if (opts.milestone !== undefined) {
    const { request } = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: ESCROW_ABI,
      functionName: 'release',
      args: [BigInt(milestoneIdx)],
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Transaction: https://basescan.org/tx/${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
  } else {
    const { request } = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: ESCROW_ABI,
      functionName: 'release',
      args: [],
    });
    const hash = await walletClient.writeContract(request);
    console.log(`Transaction: https://basescan.org/tx/${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
  }

  console.log('Milestone released.');
}

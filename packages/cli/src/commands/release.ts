import { type Address, encodeFunctionData } from 'viem';

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

  console.error(`Releasing milestone ${milestoneIdx + 1} of ${total}`);

  const calldata = opts.milestone !== undefined
    ? encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'release',
        args: [BigInt(milestoneIdx)],
      })
    : encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'release',
        args: [],
      });

  const tx = {
    to: opts.contract as Address,
    data: calldata,
    value: '0',
    chainId: 8453,
  };

  console.error('\nUnsigned transaction ready. Sign and broadcast with your wallet.\n');
  console.log(JSON.stringify(tx, null, 2));
}

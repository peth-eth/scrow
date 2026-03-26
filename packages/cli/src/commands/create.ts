import {
  type Address,
  encodeAbiParameters,
  parseUnits,
  decodeEventLog,
} from 'viem';

import { getAccount, getPublicClient, getWalletClient } from '../client.js';
import {
  DEFAULT_RESOLVER,
  ESCROW_TYPE,
  FACTORY_ADDRESS,
  PLATFORM_FEE_ADDRESS,
  PLATFORM_FEE_BPS,
  TOKENS,
  WRAPPED_NATIVE_TOKEN,
} from '../config.js';
import { pinMetadata } from '../ipfs.js';

const FACTORY_ABI = [
  {
    inputs: [
      { name: '_recipient', type: 'address' },
      { name: '_amounts', type: 'uint256[]' },
      { name: '_data', type: 'bytes' },
      { name: '_type', type: 'bytes32' },
    ],
    name: 'create',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'id', type: 'uint256' },
      { indexed: true, name: 'invoice', type: 'address' },
    ],
    name: 'LogNewInvoice',
    type: 'event',
  },
] as const;

type CreateOptions = {
  client: string;
  provider: string;
  token: string;
  milestones: string;
  title: string;
  description?: string;
  resolver?: string;
  safetyDays?: string;
};

export async function createContract(opts: CreateOptions) {
  const tokenKey = opts.token.toUpperCase();
  const tokenInfo = TOKENS[tokenKey];
  if (!tokenInfo) {
    console.error(
      `Unknown token: ${opts.token}. Supported: ${Object.keys(TOKENS).join(', ')}`,
    );
    return process.exit(1);
  }

  const milestoneAmounts = opts.milestones.split(',').map(s => s.trim());
  const milestoneWei = milestoneAmounts.map(a =>
    parseUnits(a, tokenInfo.decimals),
  );
  const safetyDays = parseInt(opts.safetyDays || '30', 10);
  const terminationTime = BigInt(
    Math.floor(Date.now() / 1000) + safetyDays * 24 * 60 * 60,
  );

  console.log('Pinning metadata to IPFS...');
  const { bytes32: detailsHash } = await pinMetadata({
    title: opts.title,
    description: opts.description,
    milestones: milestoneAmounts.map((a, i) => ({
      title: `Milestone ${i + 1}`,
      amount: a,
    })),
  });

  const resolver = (opts.resolver || DEFAULT_RESOLVER) as Address;

  const escrowData = encodeAbiParameters(
    [
      { type: 'address' },
      { type: 'uint8' },
      { type: 'address' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'bytes32' },
      { type: 'address' },
      { type: 'bool' },
      { type: 'address' },
      { type: 'address' },
      { type: 'uint256' },
    ],
    [
      opts.client as Address,
      0,
      resolver,
      tokenInfo.address,
      terminationTime,
      detailsHash,
      WRAPPED_NATIVE_TOKEN,
      true,
      FACTORY_ADDRESS,
      PLATFORM_FEE_ADDRESS,
      PLATFORM_FEE_BPS,
    ],
  );

  const account = getAccount();
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();

  console.log('Simulating transaction...');
  const { request } = await publicClient.simulateContract({
    account,
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'create',
    args: [
      opts.provider as Address,
      milestoneWei,
      escrowData,
      ESCROW_TYPE,
    ],
  });

  console.log('Sending transaction...');
  const hash = await walletClient.writeContract(request);
  console.log(`Transaction: https://basescan.org/tx/${hash}`);

  console.log('Waiting for confirmation...');
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Extract invoice address from LogNewInvoice event
  let invoiceAddress: string | undefined;
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: FACTORY_ABI,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === 'LogNewInvoice') {
        invoiceAddress = (decoded.args as { invoice: string }).invoice;
        break;
      }
    } catch {
      // Not our event, skip
    }
  }

  console.log('\nContract created!');
  console.log(`Address: ${invoiceAddress || 'check transaction logs'}`);
  console.log(`View: https://scrow-pi.vercel.app/invoice/8453/${invoiceAddress}`);
}

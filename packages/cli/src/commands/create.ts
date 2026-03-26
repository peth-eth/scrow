import {
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseUnits,
} from 'viem';

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

  console.error('Pinning metadata to IPFS...');
  const { cid, bytes32: detailsHash } = await pinMetadata({
    title: opts.title,
    description: opts.description,
    milestones: milestoneAmounts.map((a, i) => ({
      title: `Milestone ${i + 1}`,
      amount: a,
    })),
  });
  console.error(`IPFS: ${cid}`);

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

  const calldata = encodeFunctionData({
    abi: FACTORY_ABI,
    functionName: 'create',
    args: [
      opts.provider as Address,
      milestoneWei,
      escrowData,
      ESCROW_TYPE,
    ],
  });

  const tx = {
    to: FACTORY_ADDRESS,
    data: calldata,
    value: '0',
    chainId: 8453,
  };

  // JSON to stdout (agents parse this), status messages to stderr
  console.error('\nUnsigned transaction ready. Sign and broadcast with your wallet.');
  console.error(`Factory: ${FACTORY_ADDRESS}`);
  console.error(`Chain: Base (8453)\n`);
  console.log(JSON.stringify(tx, null, 2));
}

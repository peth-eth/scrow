import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { CHAIN } from './config.js';

export function getPrivateKey(): `0x${string}` {
  const key = process.env.SCROW_PRIVATE_KEY;
  if (!key) {
    console.error(
      'Error: SCROW_PRIVATE_KEY environment variable is required.\n' +
        'Set it with: export SCROW_PRIVATE_KEY=0x...',
    );
    process.exit(1);
  }
  return key.startsWith('0x') ? (key as `0x${string}`) : `0x${key}`;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getPublicClient() {
  return createPublicClient({
    chain: CHAIN,
    transport: http(),
  }) as ReturnType<typeof createPublicClient>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getWalletClient() {
  const account = privateKeyToAccount(getPrivateKey());
  return createWalletClient({
    account,
    chain: CHAIN,
    transport: http(),
  }) as ReturnType<typeof createWalletClient>;
}

export function getAccount() {
  return privateKeyToAccount(getPrivateKey());
}

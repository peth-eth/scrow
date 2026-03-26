import { createPublicClient, http } from 'viem';

import { CHAIN } from './config.js';

export function getPublicClient() {
  return createPublicClient({
    chain: CHAIN,
    transport: http(),
  }) as ReturnType<typeof createPublicClient>;
}

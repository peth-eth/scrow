import { type Address, type Hex, toHex } from 'viem';
import { base } from 'viem/chains';

export const CHAIN = base;

export const FACTORY_ADDRESS: Address =
  '0xf9822818143948237a60a1a1cefc85d6f1b929df';

export const WRAPPED_NATIVE_TOKEN: Address =
  '0x4200000000000000000000000000000000000006';

export const PLATFORM_FEE_ADDRESS: Address =
  '0x0000000000000000000000000000000000000000';

export const PLATFORM_FEE_BPS = 100n;

export const DEFAULT_RESOLVER: Address =
  '0x18542245ca523dff96af766047fe9423e0bed3c0';

export const ESCROW_TYPE: Hex = toHex('split-escrow', { size: 32 });

export const SUBGRAPH_URL =
  'https://api.goldsky.com/api/public/project_cm39qflfrtz7e01xibgnuczby/subgraphs/smart-invoice-base/latest/gn';

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud';

// Well-known token addresses on Base
export const TOKENS: Record<string, { address: Address; decimals: number }> = {
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
  },
  USDT: {
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    decimals: 6,
  },
  DAI: {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    decimals: 18,
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
};

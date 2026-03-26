import { type Address, encodeFunctionData, parseUnits } from 'viem';

import { TOKENS } from '../config.js';
import { fetchInvoice } from '../subgraph.js';

const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

type DepositOptions = {
  contract: string;
  amount: string;
  token: string;
};

export async function depositFunds(opts: DepositOptions) {
  const invoice = await fetchInvoice(opts.contract);
  if (!invoice) {
    console.error(`Contract not found: ${opts.contract}`);
    return process.exit(1);
  }

  const tokenKey = opts.token.toUpperCase();
  const isNative = tokenKey === 'ETH';
  const contractAddress = opts.contract as Address;

  if (isNative) {
    const amount = parseUnits(opts.amount, 18);
    console.error(`Depositing ${opts.amount} ETH into ${contractAddress}`);

    const tx = {
      to: contractAddress,
      data: '0x',
      value: amount.toString(),
      chainId: 8453,
    };

    console.error('\nUnsigned transaction ready. Sign and broadcast with your wallet.\n');
    console.log(JSON.stringify(tx, null, 2));
  } else {
    const tokenInfo = TOKENS[tokenKey];
    if (!tokenInfo) {
      console.error(
        `Unknown token: ${opts.token}. Supported: ETH, ${Object.keys(TOKENS).join(', ')}`,
      );
      return process.exit(1);
    }

    const amount = parseUnits(opts.amount, tokenInfo.decimals);
    console.error(`Depositing ${opts.amount} ${tokenKey} into ${contractAddress}`);

    const calldata = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [contractAddress, amount],
    });

    const tx = {
      to: tokenInfo.address,
      data: calldata,
      value: '0',
      chainId: 8453,
    };

    console.error('\nUnsigned transaction ready. Sign and broadcast with your wallet.\n');
    console.log(JSON.stringify(tx, null, 2));
  }
}

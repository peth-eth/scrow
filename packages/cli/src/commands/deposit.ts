import { type Address, parseUnits } from 'viem';

import { getAccount, getPublicClient, getWalletClient } from '../client.js';
import { CHAIN, TOKENS } from '../config.js';
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

  const account = getAccount();
  const publicClient = getPublicClient();
  const walletClient = getWalletClient();
  const contractAddress = opts.contract as Address;

  if (isNative) {
    const amount = parseUnits(opts.amount, 18);
    console.log(`Depositing ${opts.amount} ETH...`);

    const hash = await walletClient.sendTransaction({
      account,
      chain: CHAIN,
      to: contractAddress,
      value: amount,
    });
    console.log(`Transaction: https://basescan.org/tx/${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
  } else {
    const tokenInfo = TOKENS[tokenKey];
    if (!tokenInfo) {
      console.error(
        `Unknown token: ${opts.token}. Supported: ETH, ${Object.keys(TOKENS).join(', ')}`,
      );
      return process.exit(1);
    }

    const amount = parseUnits(opts.amount, tokenInfo.decimals);
    console.log(`Depositing ${opts.amount} ${tokenKey}...`);

    const { request } = await publicClient.simulateContract({
      account,
      address: tokenInfo.address,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [contractAddress, amount],
    });

    const hash = await walletClient.writeContract(request);
    console.log(`Transaction: https://basescan.org/tx/${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
  }

  console.log('Deposit confirmed.');
}

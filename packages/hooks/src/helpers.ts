import { SMART_INVOICE_INSTANT_ABI } from '@smartinvoicexyz/constants/src/abi/ISmartInvoiceInstantAbi';
import { Config, readContract, readContracts } from '@wagmi/core';
import { erc20Abi, Hex } from 'viem';

export const fetchTokenBalance = async (
  config: Config,
  address: Hex,
  tokenAddress: Hex,
  chainId: number,
): Promise<bigint> =>
  readContract(config, {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    chainId,
  });

export const fetchTokenMetadata = async (
  config: Config,
  tokenAddress: Hex | undefined,
  chainId: number | undefined,
): Promise<[number, string, string] | undefined> => {
  if (!tokenAddress || !chainId) {
    return undefined;
  }

  try {
    const results = await readContracts(config, {
      allowFailure: true,
      contracts: [
        {
          address: tokenAddress,
          chainId,
          abi: erc20Abi,
          functionName: 'decimals',
        },
        {
          address: tokenAddress,
          chainId,
          abi: erc20Abi,
          functionName: 'name',
        },
        {
          address: tokenAddress,
          chainId,
          abi: erc20Abi,
          functionName: 'symbol',
        },
      ],
    });

    const decimals =
      results[0].status === 'success' ? (results[0].result as number) : 18;
    const name =
      results[1].status === 'success'
        ? (results[1].result as string)
        : tokenAddress;
    const symbol =
      results[2].status === 'success' ? (results[2].result as string) : '???';

    return [decimals, name, symbol] as [number, string, string];
  } catch {
    return [18, tokenAddress, '???'] as [number, string, string];
  }
};

type InstantInvoiceContractData = [
  bigint,
  bigint,
  boolean,
  bigint,
  bigint,
  bigint,
];

export const fetchInstantInvoice = async (
  config: Config,
  address: Hex | undefined,
  chainId: number | undefined,
): Promise<InstantInvoiceContractData | undefined> => {
  if (!address || !chainId) {
    return undefined;
  }
  const instantEscrowContract = {
    address,
    abi: SMART_INVOICE_INSTANT_ABI,
    chainId,
  };

  const results = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        ...instantEscrowContract,
        functionName: 'getTotalDue',
      },
      {
        ...instantEscrowContract,
        functionName: 'totalFulfilled',
      },
      {
        ...instantEscrowContract,
        functionName: 'fulfilled',
      },
      {
        ...instantEscrowContract,
        functionName: 'deadline',
      },
      {
        ...instantEscrowContract,
        functionName: 'lateFee',
      },
      {
        ...instantEscrowContract,
        functionName: 'lateFeeTimeInterval',
      },
    ],
  });

  return results;
};

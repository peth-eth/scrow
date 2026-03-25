import { IERC20_ABI, PAYMENT_TYPES, TOASTS } from '@smartinvoicexyz/constants';
import { InvoiceDetails, UseToastReturn } from '@smartinvoicexyz/types';
import { errorToastHandler } from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Hex } from 'viem';
import {
  useChainId,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import {
  optimisticInvoiceUpdate,
  syncSubgraphInBackground,
} from './backgroundSync';
import { SimulateContractErrorType, WriteContractErrorType } from './types';

export const useDeposit = ({
  invoice,
  amount,
  hasAmount,
  paymentType,
  onTxSuccess,
  toast,
}: {
  invoice: InvoiceDetails;
  amount: bigint;
  hasAmount: boolean;
  paymentType: string;
  onTxSuccess?: () => void;
  toast: UseToastReturn;
}): {
  handleDeposit: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const chainId = useChainId();
  const queryClient = useQueryClient();

  const { tokenMetadata, address } = _.pick(invoice, [
    'tokenMetadata',
    'address',
  ]);

  const publicClient = usePublicClient();

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: tokenMetadata?.address as Hex,
    abi: IERC20_ABI,
    functionName: 'transfer',
    args: [address as Hex, amount],
    query: {
      enabled: hasAmount && paymentType === PAYMENT_TYPES.TOKEN,
    },
  });

  const handleTxSuccess = async (hash: Hex) => {
    toast.loading(TOASTS.useDeposit.waitingForTx);
    const receipt = await publicClient?.waitForTransactionReceipt({ hash });

    if (receipt && publicClient) {
      // Optimistically update the cached invoice with the new deposit
      optimisticInvoiceUpdate({
        queryClient,
        chainId: publicClient.chain.id,
        invoiceAddress: address as Hex,
        updater: prev => ({
          ...prev,
          deposits: [
            ...prev.deposits,
            {
              id: hash,
              txHash: hash,
              sender: '',
              amount,
              timestamp: BigInt(Math.floor(Date.now() / 1000)),
            },
          ],
        }),
      });

      // Fire onTxSuccess immediately — don't wait for subgraph
      onTxSuccess?.();

      // Sync subgraph in background
      syncSubgraphInBackground({
        chainId: publicClient.chain.id,
        blockNumber: receipt.blockNumber,
        queryClient,
        invoiceAddress: address as Hex,
        toast,
        toastMessage: TOASTS.useDeposit.waitingForIndex,
      });
    } else {
      onTxSuccess?.();
    }
  };

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: handleTxSuccess,
    },
  });

  const { isPending: sendLoading, sendTransactionAsync } = useSendTransaction({
    mutation: {
      onSuccess: handleTxSuccess,
    },
  });

  const handleDeposit = async (): Promise<Hex | undefined> => {
    try {
      if (paymentType === PAYMENT_TYPES.NATIVE) {
        const result = await sendTransactionAsync({
          to: address as Hex,
          value: amount,
        });
        return result;
      }

      if (!data) {
        throw new Error('useDeposit: simulation data is not available');
      }

      const result = await writeContractAsync(data.request);
      return result;
    } catch (error: unknown) {
      errorToastHandler('useDeposit', error as Error, toast);
      return undefined;
    }
  };

  return {
    handleDeposit,
    isLoading: prepareLoading || writeLoading || sendLoading,
    writeError,
    prepareError: paymentType === PAYMENT_TYPES.TOKEN ? prepareError : null,
  };
};

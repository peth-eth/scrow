import {
  SMART_INVOICE_UPDATABLE_ABI,
  TOASTS,
} from '@smartinvoicexyz/constants';
import { InvoiceDetails, UseToastReturn } from '@smartinvoicexyz/types';
import { errorToastHandler } from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback } from 'react';
import { Hex } from 'viem';
import {
  useChainId,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import {
  optimisticInvoiceUpdate,
  syncSubgraphInBackground,
} from './backgroundSync';
import { SimulateContractErrorType, WriteContractErrorType } from './types';

export const useRelease = ({
  invoice,
  milestone,
  onTxSuccess,
  toast,
}: {
  invoice: Partial<InvoiceDetails>;
  milestone?: number;
  onTxSuccess: () => void;
  toast: UseToastReturn;
}): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const specifiedMilestone = _.isNumber(milestone);

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    chainId,
    address: invoice?.address as Hex,
    abi: SMART_INVOICE_UPDATABLE_ABI,
    functionName: 'release', // specifyMilestones ? 'release(uint256)' : 'release',
    args: specifiedMilestone ? [BigInt(milestone)] : undefined, // optional args
    query: {
      enabled: !!invoice?.address,
    },
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        toast.loading(TOASTS.useRelease.waitingForTx);
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });

        if (receipt && publicClient) {
          // Optimistically update: increment currentMilestone and add release
          const releaseMilestone = specifiedMilestone
            ? BigInt(milestone)
            : (invoice?.currentMilestone ?? BigInt(0));
          const releaseAmount =
            invoice?.amounts?.[Number(releaseMilestone)] ?? BigInt(0);

          optimisticInvoiceUpdate({
            queryClient,
            chainId: publicClient.chain.id,
            invoiceAddress: invoice?.address as Hex,
            updater: prev => ({
              ...prev,
              currentMilestone: prev.currentMilestone + BigInt(1),
              released: prev.released + releaseAmount,
              releases: [
                ...prev.releases,
                {
                  id: hash,
                  txHash: hash,
                  milestone: releaseMilestone,
                  amount: releaseAmount,
                  timestamp: BigInt(Math.floor(Date.now() / 1000)),
                },
              ],
            }),
          });

          // Fire callback immediately
          onTxSuccess?.();

          // Sync in background
          syncSubgraphInBackground({
            chainId: publicClient.chain.id,
            blockNumber: receipt.blockNumber,
            queryClient,
            invoiceAddress: invoice?.address as Hex,
            toast,
            toastMessage: TOASTS.useRelease.waitingForIndex,
          });
        } else {
          onTxSuccess?.();
        }
      },
      onError: (error: Error) => errorToastHandler('useRelease', error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler('useRelease', error as Error, toast);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

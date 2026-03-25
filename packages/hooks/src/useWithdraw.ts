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
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi';

import { syncSubgraphInBackground } from './backgroundSync';
import { SimulateContractErrorType, WriteContractErrorType } from './types';

export const useWithdraw = ({
  invoice,
  onTxSuccess,
  toast,
}: {
  invoice: Partial<InvoiceDetails>;
  onTxSuccess: () => void;
  toast: UseToastReturn;
}): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  const { address } = _.pick(invoice, ['address']);

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: address as Hex,
    functionName: 'withdraw',
    abi: SMART_INVOICE_UPDATABLE_ABI,
    args: [],
    query: {
      enabled: !!address,
    },
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        toast.loading(TOASTS.useWithdraw.waitingForTx);
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });

        if (receipt && publicClient) {
          // Fire callback immediately — don't block on subgraph
          onTxSuccess?.();

          // Sync in background
          syncSubgraphInBackground({
            chainId: publicClient.chain.id,
            blockNumber: receipt.blockNumber,
            queryClient,
            invoiceAddress: address as Hex,
            toast,
            toastMessage: TOASTS.useWithdraw.waitingForIndex,
          });
        } else {
          onTxSuccess?.();
        }
      },
      onError: error => errorToastHandler('useWithdraw', error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler('useWithdraw', error as Error, toast);
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

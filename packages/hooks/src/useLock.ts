import {
  INVOICE_VERSION,
  SMART_INVOICE_UPDATABLE_ABI,
  TOASTS,
} from '@smartinvoicexyz/constants';
import {
  BasicMetadata,
  InvoiceDetails,
  UseToastReturn,
} from '@smartinvoicexyz/types';
import {
  errorToastHandler,
  getDateString,
  uriToDocument,
} from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
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
import { useDetailsPin } from './useDetailsPin';

export type FormLock = {
  description: string;
  document?: string;
};

export const useLock = ({
  invoice,
  localForm,
  onTxSuccess,
  toast,
  details,
}: {
  invoice: InvoiceDetails;
  localForm: UseFormReturn<FormLock>;
  onTxSuccess?: () => void;
  toast: UseToastReturn;
  details?: Hex | null;
}): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const currentChainId = useChainId();
  const queryClient = useQueryClient();
  const { chainId: invoiceChainId, metadata } = _.pick(invoice, [
    'chainId',
    'metadata',
  ]);

  const { description, document } = localForm.getValues();

  const publicClient = usePublicClient();

  const detailsData = useMemo(() => {
    if (details) {
      return null;
    }
    const now = Math.floor(new Date().getTime() / 1000);
    const title = `Dispute ${metadata?.title} at ${getDateString(now)}`;
    return {
      version: INVOICE_VERSION,
      id: _.join([title, now, INVOICE_VERSION], '-'),
      title,
      description,
      documents: document ? [uriToDocument(document)] : [],
      createdAt: now,
    } as BasicMetadata;
  }, [description, document, metadata, details]);

  const { data: detailsHash, isLoading: detailsLoading } = useDetailsPin(
    detailsData,
    true,
  );

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: invoice?.address as Hex,
    functionName: 'lock',
    abi: SMART_INVOICE_UPDATABLE_ABI,
    args: [details ?? (detailsHash as Hex)],
    query: {
      enabled:
        !!invoice?.address &&
        !!description &&
        (!!details || !!detailsHash) &&
        currentChainId === invoiceChainId,
    },
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        toast.loading(TOASTS.useLock.waitingForTx);
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });

        if (receipt && publicClient) {
          // Optimistically mark invoice as locked
          optimisticInvoiceUpdate({
            queryClient,
            chainId: publicClient.chain.id,
            invoiceAddress: invoice?.address as Hex,
            updater: prev => ({
              ...prev,
              isLocked: true,
              disputes: [
                ...prev.disputes,
                {
                  id: hash,
                  txHash: hash,
                  sender: '',
                  details: description,
                  ipfsHash: (details ?? detailsHash ?? '') as string,
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
            toastMessage: TOASTS.useLock.waitingForIndex,
          });
        } else {
          onTxSuccess?.();
        }
      },
      onError: error => errorToastHandler('useLock', error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler('useLock', error as Error, toast);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading || !(details || !detailsLoading),
    prepareError,
    writeError,
  };
};

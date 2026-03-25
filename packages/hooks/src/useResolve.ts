import {
  INVOICE_VERSION,
  SMART_INVOICE_UPDATABLE_ABI,
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
import { Hex, parseUnits } from 'viem';
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi';

import {
  optimisticInvoiceUpdate,
  syncSubgraphInBackground,
} from './backgroundSync';
import { SimulateContractErrorType, WriteContractErrorType } from './types';
import { useDetailsPin } from './useDetailsPin';

export type FormResolve = {
  description: string;
  document?: string;
  clientAward: number;
  providerAward: number;
  resolverAward: number;
};

export const useResolve = ({
  invoice,
  localForm,
  onTxSuccess,
  toast,
  details,
}: {
  invoice: Partial<InvoiceDetails>;
  localForm: UseFormReturn<FormResolve>;
  onTxSuccess: () => void;
  toast?: UseToastReturn;
  details?: Hex | null;
}): {
  writeAsync: () => Promise<Hex | undefined>;
  isLoading: boolean;
  prepareError: SimulateContractErrorType | null;
  writeError: WriteContractErrorType | null;
} => {
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const {
    document,
    description,
    clientAward: clientAwardForm,
    providerAward: providerAwardForm,
    resolverAward: resolverAwardForm,
  } = localForm.getValues();
  const { tokenBalance, address, isLocked, tokenMetadata, metadata } = _.pick(
    invoice,
    ['tokenBalance', 'tokenMetadata', 'address', 'isLocked', 'metadata'],
  );

  const detailsData = useMemo(() => {
    if (details) {
      return null;
    }
    const now = Math.floor(new Date().getTime() / 1000);
    const title = `Resolve ${metadata?.title} at ${getDateString(now)}`;
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

  const clientAward =
    clientAwardForm && tokenMetadata?.decimals
      ? parseUnits(clientAwardForm.toString(), tokenMetadata.decimals)
      : BigInt(0);
  const providerAward =
    providerAwardForm && tokenMetadata?.decimals
      ? parseUnits(providerAwardForm.toString(), tokenMetadata.decimals)
      : BigInt(0);
  const resolverAward =
    resolverAwardForm && tokenMetadata?.decimals
      ? parseUnits(resolverAwardForm.toString(), tokenMetadata.decimals)
      : BigInt(0);

  const fullBalance =
    tokenBalance?.value === clientAward + providerAward + resolverAward;

  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
  } = useSimulateContract({
    address: address as Hex,
    functionName: 'resolve',
    abi: SMART_INVOICE_UPDATABLE_ABI,
    args: [clientAward, providerAward, details ?? (detailsHash as Hex)],
    query: {
      enabled:
        !!address &&
        fullBalance &&
        isLocked &&
        tokenBalance.value > BigInt(0) &&
        (!!details || !!detailsHash) &&
        !!description,
    },
  });

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        const receipt = await publicClient?.waitForTransactionReceipt({
          hash,
        });

        if (!receipt) return;
        if (receipt && publicClient) {
          // Optimistically mark invoice as resolved (unlocked)
          optimisticInvoiceUpdate({
            queryClient,
            chainId: publicClient.chain.id,
            invoiceAddress: address as Hex,
            updater: prev => ({
              ...prev,
              isLocked: false,
              resolutions: [
                ...prev.resolutions,
                {
                  id: hash,
                  txHash: hash,
                  ipfsHash: (details ?? detailsHash ?? '') as string,
                  resolverType: prev.resolverType,
                  resolver: prev.resolver,
                  clientAward,
                  providerAward,
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
            invoiceAddress: address as Hex,
            toast,
          });
        }
      },
      onError: error => {
        if (toast) errorToastHandler('useResolve', error, toast);
      },
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      if (toast) errorToastHandler('useResolve', error as Error, toast);
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

import { Invoice, waitForSubgraphSync } from '@smartinvoicexyz/graphql';
import { UseToastReturn } from '@smartinvoicexyz/types';
import { QueryClient } from '@tanstack/react-query';
import { Hex } from 'viem';

import { createInvoiceDetailsQueryKey } from './useInvoiceDetails';

/**
 * Runs subgraph sync in the background after a transaction confirms.
 * Shows a "Syncing..." toast while waiting, then invalidates the cache
 * so React Query refetches fresh data.
 */
export const syncSubgraphInBackground = ({
  chainId,
  blockNumber,
  queryClient,
  invoiceAddress,
  toast,
  toastMessage,
}: {
  chainId: number;
  blockNumber: bigint;
  queryClient: QueryClient;
  invoiceAddress: Hex | undefined;
  toast?: UseToastReturn;
  toastMessage?: { title: string; description?: string };
}): void => {
  const syncMessage = toastMessage ?? {
    title: 'Syncing...',
    description: 'Waiting for the subgraph to index your transaction',
  };
  toast?.loading(syncMessage);

  waitForSubgraphSync(chainId, blockNumber)
    .then(() => {
      // Invalidate the invoice details query so it refetches from subgraph
      if (invoiceAddress) {
        queryClient.invalidateQueries({
          queryKey: createInvoiceDetailsQueryKey(chainId, invoiceAddress),
        });
      }
      toast?.success({
        title: 'Synced',
        description: 'Data is up to date',
        duration: 3000,
      });
    })
    .catch(err => {
      console.error('Background subgraph sync failed:', err);
      // Still invalidate so user can manually refresh
      if (invoiceAddress) {
        queryClient.invalidateQueries({
          queryKey: createInvoiceDetailsQueryKey(chainId, invoiceAddress),
        });
      }
    });
};

/**
 * Optimistically update the invoice in the React Query cache.
 * Applies an updater function to the cached Invoice data.
 * Returns the previous data for rollback if needed.
 */
export const optimisticInvoiceUpdate = ({
  queryClient,
  chainId,
  invoiceAddress,
  updater,
}: {
  queryClient: QueryClient;
  chainId: number | undefined;
  invoiceAddress: Hex | undefined;
  updater: (prev: Invoice) => Invoice;
}): Invoice | undefined => {
  const queryKey = createInvoiceDetailsQueryKey(chainId, invoiceAddress);
  const previous = queryClient.getQueryData<Invoice>(queryKey);

  if (previous) {
    queryClient.setQueryData<Invoice>(queryKey, old => {
      if (!old) return old;
      return updater(old);
    });
  }

  return previous;
};

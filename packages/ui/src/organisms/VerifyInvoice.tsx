import { TOASTS } from '@smartinvoicexyz/constants';
import {
  createInvoiceDetailsQueryKey,
  useVerify,
} from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { isAddress } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { Button } from '../atoms/Button';
import { useToast } from '../hooks';

type VerifyInvoiceProps = {
  invoice: Partial<InvoiceDetails>;
  verifiedStatus: boolean;
  isClient: boolean;
};

export function VerifyInvoice({
  invoice,
  verifiedStatus,
  isClient,
}: VerifyInvoiceProps) {
  const chainId = useChainId();
  const toast = useToast();
  const { address: account } = useAccount();
  const isConnected = !!account;
  const {
    address,
    chainId: invoiceChainId,
    dispute,
    resolution,
  } = _.pick(invoice, ['address', 'chainId', 'dispute', 'resolution']);
  const queryClient = useQueryClient();
  const validAddress = address && isAddress(address) ? address : undefined;

  const onTxSuccess = () => {
    toast.success(TOASTS.useVerify.success);
    // invalidate cache
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(chainId, address),
    });
  };

  const { writeAsync, isLoading } = useVerify({
    address: validAddress,
    chainId,
    toast,
    onTxSuccess,
  });

  const handleVerify = () => {
    writeAsync?.();
  };

  const isInvalidChain = chainId !== invoiceChainId;
  const isDisputed = (!!dispute || !!resolution) ?? false;

  if (
    verifiedStatus ||
    !isClient ||
    !isConnected ||
    isInvalidChain ||
    isDisputed
  )
    return null;

  return (
    <div className="flex flex-col gap-1 w-full items-start">
      <Button
        size="sm"
        className="px-2 py-1 text-xs uppercase font-normal font-mono"
        disabled={isLoading || !writeAsync}
        isLoading={isLoading}
        onClick={handleVerify}
      >
        {isLoading ? 'Loading...' : 'Enable Third-Party Deposits'}
      </Button>
    </div>
  );
}

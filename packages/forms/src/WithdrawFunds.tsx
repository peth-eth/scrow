import {
  createInvoiceDetailsQueryKey,
  useNotify,
  useWithdraw,
} from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { useToast } from '@smartinvoicexyz/ui';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { formatUnits } from 'viem';

export function WithdrawFunds({
  invoice,
  onClose,
}: {
  invoice: Partial<InvoiceDetails>;
  onClose: () => void;
}) {
  const toast = useToast();
  const { notify } = useNotify();

  const { tokenBalance } = _.pick(invoice, ['tokenBalance']);
  const queryClient = useQueryClient();

  const onTxSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(invoice.chainId, invoice.address),
    });
    notify({
      invoiceId: invoice.address as string,
      event: 'withdraw',
      amount: formatUnits(
        tokenBalance?.value ?? BigInt(0),
        tokenBalance?.decimals ?? 18,
      ),
      token: tokenBalance?.symbol,
    });
    onClose();
  };

  const { writeAsync: withdrawFunds, isLoading } = useWithdraw({
    invoice,
    onTxSuccess,
    toast,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="mb-4 text-2xl font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer">
        Withdraw Funds
      </h3>
      <p className="text-center text-sm mb-2 w-[70%]">
        Follow the instructions in your wallet to withdraw remaining funds from
        the escrow.
      </p>
      <p className="text-center text-xs text-muted-foreground mb-2 w-[70%]">
        The withdrawal deadline has passed and these funds are available for you
        to reclaim.
      </p>
      <div className="my-8 px-20 py-4 bg-black rounded-lg">
        <p className="text-primary-300 text-sm text-center">
          Amount To Be Withdrawn
        </p>
        <p className="text-yellow-400 text-base font-bold text-center">
          {`${formatUnits(tokenBalance?.value ?? BigInt(0), tokenBalance?.decimals ?? 18)} ${tokenBalance?.symbol}`}
        </p>
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      <button
        onClick={withdrawFunds}
        disabled={!withdrawFunds}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase"
      >
        Withdraw
      </button>
    </div>
  );
}

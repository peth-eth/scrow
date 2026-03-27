import { PLATFORM_FEE_BPS, TOASTS } from '@smartinvoicexyz/constants';
import {
  createInvoiceDetailsQueryKey,
  useNotify,
  useRelease,
} from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { Button, useToast } from '@smartinvoicexyz/ui';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { formatUnits } from 'viem';

// TODO handle release specified/multiple milestones

export const getReleaseAmount = (
  currentMilestone: number | undefined,
  amounts: bigint[] | undefined,
  balance: bigint | undefined,
) => {
  if (
    _.isUndefined(currentMilestone) ||
    currentMilestone >= _.size(amounts) ||
    // last milestone with extra balance
    (currentMilestone === _.size(amounts) - 1 &&
      balance &&
      amounts &&
      balance > amounts[currentMilestone])
  ) {
    // TODO coordinate useRelease to handle specific milestones
    return balance || BigInt(0);
  }
  return amounts ? BigInt(amounts?.[currentMilestone]) : BigInt(0);
};

export function ReleaseFunds({
  invoice,
  onClose,
}: {
  invoice: Partial<InvoiceDetails>;
  onClose: () => void;
}) {
  const toast = useToast();
  const { notify } = useNotify();

  const queryClient = useQueryClient();
  const { currentMilestoneNumber, amounts, tokenBalance } = _.pick(invoice, [
    'currentMilestoneNumber',
    'amounts',
    'tokenBalance',
  ]);

  const onTxSuccess = () => {
    toast.success(TOASTS.useRelease.success);
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(invoice.chainId, invoice.address),
    });
    notify({
      invoiceId: invoice.address as string,
      event: 'release',
      amount: formatUnits(
        getReleaseAmount(currentMilestoneNumber, amounts, tokenBalance?.value),
        tokenBalance?.decimals || 18,
      ),
      token: tokenBalance?.symbol,
    });
    onClose();
  };

  const { writeAsync: releaseFunds, isLoading } = useRelease({
    invoice,
    onTxSuccess,
    toast,
  });

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <h3 className="mb-4 text-2xl font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer">
        Release Funds
      </h3>
      <p className="text-center text-sm mb-4 w-3/5 text-muted-foreground">
        Follow the instructions in your wallet to release funds from the escrow
        to the provider account.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Funds will be sent to the provider.
      </p>
      <div className="my-8 px-4 md:px-20 py-4 bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm text-center">
          Amount To Be Released
        </p>
        <p className="text-primary text-xl font-bold text-center">{`${formatUnits(
          getReleaseAmount(
            currentMilestoneNumber,
            amounts,
            tokenBalance?.value,
          ),
          tokenBalance?.decimals || 18,
        )} ${tokenBalance?.symbol}`}</p>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {`A ${Number(PLATFORM_FEE_BPS) / 100}% platform fee (${formatUnits(
          (getReleaseAmount(currentMilestoneNumber, amounts, tokenBalance?.value) * PLATFORM_FEE_BPS) / 10000n,
          tokenBalance?.decimals || 18,
        )} ${tokenBalance?.symbol}) will be deducted from this release.`}
      </p>
      <Button
        onClick={releaseFunds}
        disabled={!releaseFunds || isLoading}
        isLoading={isLoading}
        className="uppercase"
      >
        Release
      </Button>
    </div>
  );
}

import { yupResolver } from '@hookform/resolvers/yup';
import {
  ARBITRATION_FEE_PERCENT,
  KLEROS_GOOGLE_FORM,
} from '@smartinvoicexyz/constants';
import {
  createInvoiceDetailsQueryKey,
  FormLock,
  useLock,
  useNotify,
} from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import {
  AccountLink,
  Button,
  LinkInput,
  Textarea,
  useToast,
} from '@smartinvoicexyz/ui';
import { lockFundsSchema } from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { formatUnits, Hex } from 'viem';
import { useChainId } from 'wagmi';

export function LockFunds({
  invoice,
  onClose,
}: {
  invoice: InvoiceDetails;
  onClose: () => void;
}) {
  const chainId = useChainId();
  const toast = useToast();
  const { notify } = useNotify();
  const queryClient = useQueryClient();

  const {
    resolver,
    resolverFee,
    resolverInfo,
    tokenBalance,
    address,
    chainId: invoiceChainId,
  } = _.pick(invoice, [
    'resolver',
    'resolverFee',
    'resolverInfo',
    'tokenBalance',
    'resolutionRate',
    'address',
    'chainId',
  ]);
  const localForm = useForm<FormLock>({
    resolver: yupResolver(lockFundsSchema),
  });
  const { watch, handleSubmit } = localForm;

  const description = watch('description');

  const onTxSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(invoiceChainId, address),
    });
    notify({
      invoiceId: address as string,
      event: 'dispute',
    });
    onClose();
  };

  const { writeAsync: lockFunds, isLoading } = useLock({
    invoice,
    localForm,
    onTxSuccess,
    toast,
  });

  const onSubmit = async () => {
    lockFunds?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <h3 className="text-2xl font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer">
        Raise Dispute
      </h3>
      <p className="text-center text-sm mb-4">
        Locking freezes all remaining funds in the contract and initiates a
        dispute.
      </p>
      <p className="text-center text-sm mb-4">
        Once a dispute has been initiated,{' '}
        <AccountLink
          address={resolver as Hex}
          chainId={chainId}
          resolverInfo={resolverInfo}
        />{' '}
        will review your case, the project agreement and dispute reasoning
        before making a decision on how to fairly distribute remaining funds.
      </p>
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-sm font-bold text-muted-foreground">
          What happens when you raise a dispute?
        </p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground">
          <li>All remaining funds are frozen</li>
          <li>The arbitrator reviews the case</li>
          <li>Funds are distributed based on the ruling</li>
          <li>A {ARBITRATION_FEE_PERCENT}% arbitration fee is deducted</li>
        </ol>
      </div>

      <Textarea
        name="description"
        tooltip="Why do you want to lock these funds?"
        label="Dispute Reason"
        placeholder="Dispute Reason"
        localForm={localForm}
      />

      <LinkInput
        name="document"
        label="Dispute Attachment"
        tooltip="A URL linking to more details for this dispute. This is optional."
        placeholder="https://notion.so/dispute-evidence"
        localForm={localForm}
      />

      <p className="text-center">
        {`Upon resolution, a fee of ${resolverFee} will be deducted from the locked fund amount and sent to `}
        <AccountLink
          address={resolver as Hex}
          chainId={chainId}
          resolverInfo={resolverInfo}
        />{' '}
        for helping resolve this dispute.
      </p>
      <Button
        type="submit"
        disabled={
          !description || !lockFunds || tokenBalance?.value === BigInt(0)
        }
        isLoading={isLoading}
        className="uppercase"
      >
        {`Raise Dispute ${formatUnits(tokenBalance?.value ?? BigInt(0), tokenBalance?.decimals ?? 18)} ${tokenBalance?.symbol}`}
      </Button>
      {resolverInfo?.id === 'kleros' && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-red-400 p-4 flex gap-2" role="alert">
          Note: For Kleros Arbitration you also need to fill out
          <a
            href={KLEROS_GOOGLE_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-red-700 underline"
          >
            this google form
          </a>
        </div>
      )}
      {!!resolverInfo && (
        <div className="flex justify-center">
          <a
            href={resolverInfo.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-300 underline"
          >
            Learn about {resolverInfo.name} dispute process & terms
          </a>
        </div>
      )}
    </form>
  );
}

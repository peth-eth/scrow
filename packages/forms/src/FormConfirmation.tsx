import {
  ARBITRATION_FEE_PERCENT,
  ESCROW_STEPS,
  INVOICE_TYPES,
  KLEROS_COURTS,
  LATE_FEE_INTERVAL_OPTIONS,
  PLATFORM_FEE_BPS,
} from '@smartinvoicexyz/constants';
import { useFetchTokens } from '@smartinvoicexyz/hooks';
import { ValueOf } from '@smartinvoicexyz/types';
import {
  AccountLink,
  ChakraNextLink,
} from '@smartinvoicexyz/ui';
import { getDateString, getResolverInfo } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

type FormConfirmationProps = {
  invoiceForm: UseFormReturn;
  handleSubmit: () => void;
  canSubmit: boolean;
  isLoading: boolean;
  type: ValueOf<typeof INVOICE_TYPES>;
};

export function FormConfirmation({
  invoiceForm,
  handleSubmit,
  canSubmit,
  isLoading,
  type,
}: FormConfirmationProps) {
  const chainId = useChainId();
  const { data: tokens } = useFetchTokens();
  const { watch } = invoiceForm;
  const {
    title,
    description,
    document,
    client,
    provider,
    klerosCourt,
    startDate,
    endDate,
    safetyValveDate,
    resolverType,
    resolverAddress,
    milestones,
    token,
    deadline,
    lateFee,
    lateFeeTimeInterval,
    paymentDue,
  } = watch();

  const lateFeeIntervalLabel = _.toLower(
    _.find(LATE_FEE_INTERVAL_OPTIONS, { value: lateFeeTimeInterval })?.label,
  );

  const initialPaymentDue = _.get(_.first(milestones), 'value');
  const symbol = _.filter(
    tokens,
    t =>
      t.address.toLowerCase() === token.toLowerCase() &&
      Number(t.chainId) === chainId,
  )[0]?.symbol;

  const details = useMemo(() => {
    return _.compact([
      {
        label: 'Client Address',
        value: <AccountLink address={client} chainId={chainId} />,
      },
      {
        label: 'Provider Address',
        value: <AccountLink address={provider} chainId={chainId} />,
      },
      {
        label: 'Platform Fee:',
        value: (
          <p className="text-right">
            {`${Number(PLATFORM_FEE_BPS) / 100}%`}
          </p>
        ),
      },
      {
        label: 'Arbitration Fee:',
        value: (
          <p className="text-right">{ARBITRATION_FEE_PERCENT}% (only on disputes)</p>
        ),
      },
      startDate && {
        label: 'Project Start Date:',
        value: <p className="text-right">{getDateString(startDate / 1000)}</p>,
      },
      endDate && {
        label: 'Expected End Date:',
        value: <p className="text-right">{getDateString(endDate / 1000)}</p>,
      },
      paymentDue && {
        label: 'Payment Due:',
        value: <p className="text-right">{`${paymentDue} ${symbol}`}</p>,
      },
      type === INVOICE_TYPES.Escrow
        ? {
            label: 'Withdrawal Deadline:',
            value: (
              <p className="text-right">
                {getDateString(safetyValveDate / 1000)}
              </p>
            ),
          }
        : {
            label: 'Deadline:',
            value: (
              <p className="text-right">{getDateString(deadline / 1000)}</p>
            ),
          },
      lateFee &&
        lateFeeTimeInterval && {
          label: 'Late Fee:',
          value: (
            <p className="text-right">{`${lateFee} ${symbol} per ${lateFeeIntervalLabel}`}</p>
          ),
        },
      // calculate payment due
      (resolverAddress || (resolverType && resolverType !== 'custom')) && {
        label: 'Arbitration Provider:',
        value: (
          <AccountLink
            address={
              resolverAddress || getResolverInfo(resolverType, chainId)?.address
            }
            chainId={chainId}
            resolverInfo={getResolverInfo(resolverType, chainId)}
          />
        ),
      },
      // if kleros resolverType, show court
      klerosCourt &&
        resolverType === 'kleros' && {
          label: 'Kleros Court:',
          value: (
            <ChakraNextLink
              href={_.find(KLEROS_COURTS, { id: klerosCourt })?.link}
              isExternal
            >
              {_.find(KLEROS_COURTS, { id: klerosCourt })?.name}
            </ChakraNextLink>
          ),
        },
    ]);
  }, [
    client,
    provider,
    startDate,
    endDate,
    safetyValveDate,
    resolverType,
    klerosCourt,
    paymentDue,
    lateFee,
    lateFeeTimeInterval,
    chainId,
  ]);

  return (
    <div className="flex flex-col gap-4 w-full text-foreground items-center">
      <div className="flex flex-col items-stretch gap-4 w-full max-w-lg">
        <h2 id="project-title" className="text-lg md:text-xl font-semibold">
          {title}
        </h2>

        {description && <p>{description}</p>}

        {document && (
          <a
            href={document || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline mb-4"
          >
            {document}
          </a>
        )}
      </div>

      <hr className="border-border w-full" />

      {_.map(details, ({ label, value }) => (
        <div className="flex justify-between w-full max-w-lg" key={label}>
          <p>{label}</p>
          {value}
        </div>
      ))}

      {milestones && (
        <>
          <hr className="border-border w-[calc(100%+2rem)] -translate-x-4" />

          <div className="flex justify-end">
            <p>
              {`${_.size(milestones)} ${_.size(milestones) > 1 ? 'Payments' : 'Payment'} Total`}
            </p>

            {initialPaymentDue && (
              <p className="text-primary ml-10 font-bold">
                {`${initialPaymentDue} ${symbol} Due Today`}
              </p>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-4 w-full mt-5">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase font-mono font-bold text-sm md:text-base"
        >
          {isLoading && (
            <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 align-middle" />
          )}
          Next: {ESCROW_STEPS[4].next}
        </button>
      </div>
    </div>
  );
}

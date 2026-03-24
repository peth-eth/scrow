import { yupResolver } from '@hookform/resolvers/yup';
import {
  ARBITRATION_FEE_PERCENT,
  DEFAULT_ARBITRATOR_FC_USERNAME,
  ESCROW_STEPS,
  KLEROS_COURTS,
  KnownResolverType,
} from '@smartinvoicexyz/constants';
import { FormInvoice } from '@smartinvoicexyz/types';
import { Checkbox, Input, Select } from '@smartinvoicexyz/ui';
import {
  escrowDetailsSchema,
  getResolverInfo,
  getResolverString,
} from '@smartinvoicexyz/utils';
import { AlertCircle, Info } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

import { FarcasterArbitratorPicker } from './FarcasterArbitratorPicker';

export function EscrowDetailsForm({
  invoiceForm,
  updateStep,
}: {
  invoiceForm: UseFormReturn;
  updateStep: (_i?: number) => void;
}) {
  const chainId = useChainId();
  const { watch, setValue } = invoiceForm;
  const {
    provider,
    client,
    resolverType,
    resolverAddress,
    isResolverTermsChecked,
    klerosCourt,
  } = watch();

  const localForm = useForm({
    resolver: yupResolver(escrowDetailsSchema(chainId)),
    defaultValues: {
      client,
      provider,
      resolverAddress,
      resolverType: resolverType || ('custom' as KnownResolverType),
      isResolverTermsChecked,
      klerosCourt: klerosCourt || 1,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    setValue: setLocalValue,
  } = localForm;

  const onSubmit = (values: Partial<FormInvoice>) => {
    setValue('client', values?.client);
    setValue('provider', values?.provider);
    setValue('resolverType', values?.resolverType);
    setValue('resolverAddress', values?.resolverAddress);
    setValue('isResolverTermsChecked', values?.isResolverTermsChecked);
    setValue('klerosCourt', values?.klerosCourt);
    updateStep();
  };

  // Arbitrator mode: 'farcaster' (default), 'kleros', or 'custom'
  const [arbitratorMode, setArbitratorMode] = useState<string>(
    resolverType === 'kleros' ? 'kleros' : 'farcaster',
  );

  const handleArbitratorModeChange = (mode: string) => {
    setArbitratorMode(mode);
    if (mode === 'kleros') {
      setLocalValue('resolverType', 'kleros');
    } else {
      setLocalValue('resolverType', 'custom');
    }
  };

  const handleFarcasterSelect = useCallback(
    (address: string) => {
      setLocalValue('resolverAddress', address);
      setLocalValue('resolverType', 'custom');
    },
    [setLocalValue],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4">
          <Input
            label="Client Address"
            tooltip="This is the wallet address your client uses to access the invoice, pay with, & release escrow funds. Ensure your client has full control of this address."
            placeholder="0x..."
            name="client"
            localForm={localForm}
            registerOptions={{ required: true }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Service Provider Address"
            tooltip="This is your controlling address. You use it to access this invoice, manage transactions, and receive funds released from escrow. Ensure you have full control over this address."
            placeholder="0x..."
            name="provider"
            localForm={localForm}
            registerOptions={{ required: true }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-bold text-sm">
            Arbitration Provider
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              className={
                arbitratorMode === 'farcaster'
                  ? 'bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90'
                  : 'border border-input px-3 py-1 rounded-md text-sm hover:bg-accent'
              }
              onClick={() => handleArbitratorModeChange('farcaster')}
            >
              Community
            </button>
            <button
              type="button"
              className={
                arbitratorMode === 'kleros'
                  ? 'bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90'
                  : 'border border-input px-3 py-1 rounded-md text-sm hover:bg-accent'
              }
              onClick={() => handleArbitratorModeChange('kleros')}
            >
              Kleros
            </button>
            <button
              type="button"
              className={
                arbitratorMode === 'custom'
                  ? 'bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90'
                  : 'border border-input px-3 py-1 rounded-md text-sm hover:bg-accent'
              }
              onClick={() => handleArbitratorModeChange('custom')}
            >
              Custom Address
            </button>
          </div>

          {arbitratorMode === 'farcaster' && (
            <FarcasterArbitratorPicker
              onSelect={handleFarcasterSelect}
              defaultUsername={DEFAULT_ARBITRATOR_FC_USERNAME}
            />
          )}

          {arbitratorMode === 'kleros' && (
            <>
              <div className="flex items-start gap-3 rounded-md bg-yellow-500 p-4 text-white" role="alert">
                <AlertCircle className="h-5 w-5 mt-0.5 text-white/80 shrink-0" />
                <div>
                  <h5 className="font-medium text-sm">
                    Only choose Kleros if total invoice value is greater than
                    1000 USD
                  </h5>
                  <p className="text-sm">
                    Smart Invoice will only escalate claims to Kleros that are
                    linked to smart escrows holding tokens with a minimum value
                    of 1000 USD at the time of locking the funds.
                  </p>
                </div>
              </div>

              <Select
                name="klerosCourt"
                tooltip="This kleros court will be used in case of dispute."
                label="Kleros Court"
                localForm={localForm}
              >
                {KLEROS_COURTS.map(
                  (court: { id: number; name: string }) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ),
                )}
              </Select>

              <Checkbox
                name="isResolverTermsChecked"
                localForm={localForm}
                options={[
                  <span>
                    {`I agree to ${getResolverString('kleros', chainId)}`}
                    &apos;s{' '}
                    <a
                      href={getResolverInfo('kleros', chainId)?.termsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      terms of service
                    </a>
                  </span>,
                ]}
              />
            </>
          )}

          <div className="flex items-start gap-3 rounded-md border p-4 text-sm" role="alert">
            <Info className="h-5 w-5 mt-0.5 text-primary shrink-0" />
            <p>
              If a dispute occurs, the arbitrator receives a {ARBITRATION_FEE_PERCENT}% resolution fee
              from the disputed funds.
            </p>
          </div>

          {arbitratorMode === 'custom' && (
            <Input
              name="resolverAddress"
              tooltip="This arbitrator will be used in case of dispute."
              label="Arbitration Provider Address"
              placeholder="0x..."
              localForm={localForm}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mt-5">
          <button
            type="submit"
            disabled={!isValid}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase font-bold text-sm md:text-base"
          >
            Next: {ESCROW_STEPS[2].next}
          </button>
        </div>
      </div>
    </form>
  );
}

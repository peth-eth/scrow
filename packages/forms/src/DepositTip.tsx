/* eslint-disable react/no-array-index-key */
import { PAYMENT_TYPES, TOASTS } from '@smartinvoicexyz/constants';
import {
  createInvoiceDetailsQueryKey,
  useDeposit,
  useTokenBalance,
} from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { NumberInput, QuestionIcon, useToast } from '@smartinvoicexyz/ui';
import {
  commify,
  getNativeTokenSymbol,
  getTxLink,
  getWrappedNativeToken,
} from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatEther, formatUnits, Hex, parseUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

export function DepositTip({
  invoice,
  onClose,
}: {
  invoice: Partial<InvoiceDetails>;
  onClose: () => void;
}) {
  const {
    tokenMetadata,
    amounts,
    deposited,
    currentMilestoneAmount,
    depositedMilestones,
  } = _.pick(invoice, [
    'tokenMetadata',
    'amounts',
    'deposited',
    'currentMilestoneNumber',
    'currentMilestoneAmount',
    'depositedMilestones',
  ]);
  const chainId = useChainId();
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const toast = useToast();

  const TOKEN_DATA = useMemo(
    () => ({
      nativeSymbol: getNativeTokenSymbol(chainId),
      wrappedToken: getWrappedNativeToken(chainId),
      isWrapped: _.eq(
        _.toLower(tokenMetadata?.address),
        getWrappedNativeToken(chainId),
      ),
    }),
    [chainId, tokenMetadata?.address],
  );

  const [transaction, setTransaction] = useState<Hex | undefined>();

  const localForm = useForm();
  const { watch, setValue } = localForm;

  const paymentType = watch('paymentType');
  const amount = parseUnits(
    watch('amount', '0'),
    tokenMetadata?.decimals || 18,
  );

  const totalAmount =
    amounts?.reduce((acc, val) => acc + BigInt(val), BigInt(0)) ?? BigInt(0);
  const amountsSum = Number(
    formatUnits(totalAmount, tokenMetadata?.decimals || 18),
  );

  const { data: nativeBalance } = useBalance({ address, chainId });
  const { data: tokenBalance } = useTokenBalance({
    address: address as Hex,
    tokenAddress: tokenMetadata?.address as Hex,
    chainId,
  });

  const balance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? nativeBalance?.value
      : tokenBalance;
  const displayBalance =
    paymentType?.value === PAYMENT_TYPES.NATIVE
      ? formatUnits(
          nativeBalance?.value ?? BigInt(0),
          nativeBalance?.decimals ?? 18,
        )
      : formatUnits(tokenBalance ?? BigInt(0), tokenMetadata?.decimals ?? 18);
  const hasAmount = !!balance && balance > amount; // (+ gasForChain)

  const onTxSuccess = () => {
    toast.success(TOASTS.useDeposit.success);
    // invalidate cache
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(chainId, address),
    });
    // close modal
    onClose();
  };

  const { handleDeposit, isLoading, prepareError } = useDeposit({
    invoice,
    amount,
    hasAmount,
    paymentType: paymentType?.value,
    onTxSuccess,
    toast,
  });

  const depositHandler = async () => {
    const result = await handleDeposit();
    if (!result) return;
    setTransaction(result);
  };
  const paymentTypeOptions = [
    {
      value: PAYMENT_TYPES.TOKEN,
      label: tokenMetadata?.symbol,
    },
    { value: PAYMENT_TYPES.NATIVE, label: TOKEN_DATA.nativeSymbol },
  ];

  useEffect(() => {
    setValue('paymentType', paymentTypeOptions?.[0]);
    setValue('amount', '0');
    if (depositedMilestones) {
      setValue('checked', depositedMilestones);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full text-foreground items-center">
      <h3 className="text-2xl font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer">
        Add a Tip
      </h3>
      <p className="text-center text-sm mb-4 text-muted-foreground">
        The invoice is fully paid! Add an optional tip to show your appreciation
        for great service.
      </p>

      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2">
          <p className="font-medium text-muted-foreground">
            Enter Tip Amount
          </p>
          {paymentType === PAYMENT_TYPES.NATIVE ? (
            <span
              title={`Your ${TOKEN_DATA.nativeSymbol} will be automagically wrapped to ${tokenMetadata?.symbol} tokens`}
            >
              <QuestionIcon className="w-3 h-3" />
            </span>
          ) : (
            <span className="w-3 h-3" />
          )}
        </div>

        <div className="flex">
          <NumberInput
            name="amount"
            type="number"
            placeholder="0"
            defaultValue="0"
            className="min-w-[300px]"
            min={0}
            max={amountsSum}
            localForm={localForm}
            rightElement={
              <div className="flex min-w-[130px] ml-4">
                {TOKEN_DATA.isWrapped ? (
                  <select
                    value={paymentType?.value}
                    onChange={e => {
                      setValue(
                        'paymentType',
                        _.find(
                          paymentTypeOptions,
                          o => o.value === e.target.value,
                        ),
                      );
                    }}
                    className="border border-input rounded-md px-2 py-1"
                  >
                    {_.map(paymentTypeOptions, option => (
                      <option key={option.value} value={option.value}>
                        {option.label as string}
                      </option>
                    ))}
                  </select>
                ) : (
                  tokenMetadata?.symbol
                )}
              </div>
            }
          />
        </div>
        {displayBalance && displayBalance < formatEther(amount) && (
          <div className="flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-4" role="alert">
            <AlertCircle className="h-5 w-5 mt-0.5 text-red-600 shrink-0" />
            <h5 className="font-medium text-sm">
              Your balance is less than the amount you are trying to deposit!
            </h5>
          </div>
        )}
      </div>
      <div
        className={`flex text-muted-foreground justify-between text-sm ${
          currentMilestoneAmount ? 'w-[70%]' : 'w-[50%]'
        }`}
      >
        {!!deposited && (
          <div className="flex flex-col items-start">
            <p className="font-bold">Total Deposited</p>
            <p>
              {commify(
                _.toNumber(
                  formatUnits(BigInt(deposited), tokenMetadata?.decimals || 18),
                ).toFixed(4),
              )}
              {` `}
              {tokenMetadata?.symbol}
            </p>
          </div>
        )}
        {displayBalance && (
          <div className="flex flex-col items-end">
            <p className="font-bold">Your Balance</p>
            <p>
              {`${_.toNumber(displayBalance).toFixed(4)} ${
                paymentType?.value === PAYMENT_TYPES.TOKEN
                  ? tokenMetadata?.symbol
                  : TOKEN_DATA.nativeSymbol
              }`}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={depositHandler}
        disabled={
          Number.isNaN(Number(amount)) ||
          amount <= 0 ||
          !!prepareError ||
          !hasAmount
        }
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase"
      >
        {isLoading && (
          <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 align-middle" />
        )}
        Deposit Tip
      </button>
      {transaction && (
        <p className="text-center text-sm">
          Follow your transaction{' '}
          <a
            href={getTxLink(chainId, transaction)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-300 underline"
          >
            here
          </a>
        </p>
      )}
    </div>
  );
}

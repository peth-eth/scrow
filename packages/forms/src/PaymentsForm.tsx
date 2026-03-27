import { yupResolver } from '@hookform/resolvers/yup';
import {
  ARBITRATION_FEE_PERCENT,
  ESCROW_STEPS,
  PLATFORM_FEE_BPS,
} from '@smartinvoicexyz/constants';
import { useFetchTokens } from '@smartinvoicexyz/hooks';
import { FormInvoice, IToken } from '@smartinvoicexyz/types';
import {
  AddIcon,
  Button,
  DeleteIcon,
  Input,
  NumberInput,
  QuestionIcon,
  ReactSelect,
  Textarea,
} from '@smartinvoicexyz/ui';
import {
  commify,
  escrowPaymentsSchema,
  getDecimals,
  getWrappedNativeToken,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

// TODO move FieldArray to its own component?

export function PaymentsForm({
  invoiceForm,
  updateStep,
}: {
  invoiceForm: UseFormReturn;
  updateStep: () => void;
}) {
  const chainId = useChainId();
  const { watch, setValue } = invoiceForm;
  const { milestones } = watch();

  const { data: allTokens } = useFetchTokens();

  const tokens = useMemo(
    () =>
      allTokens
        ? _.filter(allTokens, t => t.chainId === chainId).sort((a, b) =>
            a.name.trim().localeCompare(b.name.trim()),
          )
        : [],
    [chainId, allTokens],
  ) as IToken[];

  const nativeWrappedToken = getWrappedNativeToken(chainId) || '0x';

  const localForm = useForm({
    defaultValues: {
      token: nativeWrappedToken.toLowerCase(),
      milestones: milestones || [
        { value: '500', title: 'Design & Wireframes', description: '' },
        { value: '500', title: 'Development & Launch', description: '' },
      ],
    },
    resolver: yupResolver(escrowPaymentsSchema),
  });
  const {
    handleSubmit,
    watch: localWatch,
    control,
    formState: { errors, isValid },
  } = localForm;
  const { milestones: localMilestones, token: localToken } = localWatch();

  const invoiceTokenData = _.filter(
    tokens,
    t => t.address.toLowerCase() === localToken?.toLowerCase(),
  )[0];

  const onSubmit = (values: Partial<FormInvoice>) => {
    setValue('milestones', values?.milestones);
    setValue('token', values?.token);
    // navigate form
    updateStep();
  };

  const {
    fields: milestonesFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    name: 'milestones',
    control,
  });

  const [total, decimals] = localMilestones
    ? localMilestones
        .map((milestone: { value: string }) => [
          _.toNumber(milestone.value) || 0,
          getDecimals(milestone.value),
        ])
        .reduce(
          ([tot, maxDecimals], [v, d]) => [tot + v, Math.max(d, maxDecimals)],
          [0, 0],
        )
    : [0, 0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex w-full">
        <div className="w-full">
          <ReactSelect
            name="token"
            label="Payment Token"
            defaultValue={nativeWrappedToken.toLowerCase()}
            tooltip={
              <span>
                {`This is the cryptocurrency you'll receive payment in. The network your wallet is connected to determines which tokens are displayed here.`}
                <br />
                {`If you change your wallet network now, you'll be sent back to Step 1.`}
              </span>
            }
            localForm={localForm}
            options={_.map(tokens, t => ({
              value: t.address,
              label: `${t.name} (${t.symbol})`,
            }))}
          />
        </div>
      </div>
      <div className={`w-full ${errors?.milestones ? 'text-destructive' : ''}`}>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-4">
            <label className="font-medium m-0">Milestones</label>
            <span
              title="Payment amounts for each milestone. Additional milestones can be added later."
            >
              <QuestionIcon className="w-3 h-3 rounded-full" />
            </span>
          </div>
          <div className="w-full flex flex-col">
            {_.map(milestonesFields, (field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-4 w-full justify-between"
              >
                <details className="w-full group" open={false}>
                  <summary className="w-full px-2 flex justify-between items-center cursor-pointer list-none">
                    <span>{localMilestones?.[index].title ?? ''}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg group-open:hidden">
                        {localMilestones?.[index].value}
                        {` `}
                        {invoiceTokenData?.symbol}
                      </span>
                    </div>
                  </summary>
                  <div className="px-2 mt-2">
                    <div className="grid grid-cols-2 gap-4 w-full mb-2">
                      <Input
                        label="Title"
                        name={`milestones.${index}.title`}
                        localForm={localForm}
                      />
                      <NumberInput
                        label="Amount"
                        required
                        name={`milestones.${index}.value`}
                        step={50}
                        min={0}
                        max={1_000_000}
                        placeholder="500"
                        localForm={localForm}
                        className="w-full"
                        rightElement={
                          <span className="p-2">{invoiceTokenData?.symbol}</span>
                        }
                      />
                    </div>
                    <Textarea
                      label="Description"
                      name={`milestones.${index}.description`}
                      localForm={localForm}
                    />
                  </div>
                </details>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="remove milestone"
                  onClick={() => removeMilestone(index)}
                >
                  <DeleteIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex">
            {errors?.milestones?.message && (
              <p className="text-destructive text-sm mb-4">
                {errors?.milestones?.message?.toString()}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              appendMilestone({
                value: '1',
                title: `Milestone ${milestonesFields.length + 1}`,
                description: '',
              });
            }}
          >
            Add a new milestone
            <AddIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <hr className="border-border" />

      <div className="flex items-center w-full justify-between pl-2 pr-6 text-xl font-bold my-4">
        <p>
          Total {milestonesFields.length} Milestones:{' '}
          {commify(total.toFixed(decimals), decimals)}
          {` `}
          {invoiceTokenData?.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-1 pl-2 pr-6">
        <p className="text-xs text-muted-foreground">
          Platform Fee: {Number(PLATFORM_FEE_BPS) / 100}% on each release
        </p>
        <p className="text-xs text-muted-foreground">
          Arbitration Fee: {ARBITRATION_FEE_PERCENT}% of disputed amount (only if a dispute occurs)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        <Button
          type="submit"
          disabled={!isValid}
          className="uppercase font-mono font-bold text-sm md:text-base"
        >
          Next: {ESCROW_STEPS[3].next}
        </Button>
      </div>
    </form>
  );
}

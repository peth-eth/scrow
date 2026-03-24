import { yupResolver } from '@hookform/resolvers/yup';
import {
  createInvoiceDetailsQueryKey,
  useAddMilestones,
} from '@smartinvoicexyz/hooks';
import { FormInvoice, InvoiceDetails } from '@smartinvoicexyz/types';
import {
  AddIcon,
  DeleteIcon,
  Input,
  LinkInput,
  NumberInput,
  QuestionIcon,
  Textarea,
  useToast,
} from '@smartinvoicexyz/ui';
import {
  addMilestonesSchema,
  commify,
  logDebug,
  resolutionFeePercentage,
} from '@smartinvoicexyz/utils';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Hex } from 'viem';

export const getDecimals = (value: string) => {
  const [, decimal] = value.split('.');
  return decimal?.length || 0;
};

export function AddMilestones({
  invoice,
  onClose,
}: {
  invoice: Partial<InvoiceDetails>;
  onClose: () => void;
}) {
  const toast = useToast();
  const {
    address,
    tokenMetadata,
    resolutionRate,
    total,
    deposited,
    amounts,
    chainId,
  } = _.pick(invoice, [
    'address',
    'tokenMetadata',
    'resolutionRate',
    'total',
    'deposited',
    'amounts',
    'chainId',
  ]);

  const localForm = useForm<Partial<FormInvoice>>({
    resolver: yupResolver(addMilestonesSchema),
    defaultValues: {
      milestones: [
        {
          value: '1',
          title: `Milestone ${(amounts?.length ?? 0) + 1}`,
          description: '',
        },
        {
          value: '1',
          title: `Milestone ${(amounts?.length ?? 0) + 2}`,
          description: '',
        },
      ],
    },
  });

  const {
    watch,
    formState: { errors },
    control,
  } = localForm;

  const {
    fields: milestonesFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    name: 'milestones',
    control,
  });
  const { milestones } = watch();
  const queryClient = useQueryClient();
  const onTxSuccess = () => {
    // invalidate cache
    queryClient.invalidateQueries({
      queryKey: createInvoiceDetailsQueryKey(chainId, address),
    });
    // close modal
    onClose();
  };

  const { writeAsync, isLoading, prepareError } = useAddMilestones({
    address: address as Hex,
    invoice,
    localForm,
    toast,
    onTxSuccess,
  });

  // TODO: handle excess funds from previous deposits
  const excessFunds = useMemo(() => {
    if (!total || !deposited) return 0;
    return deposited - total; // bigint
  }, [total, deposited, tokenMetadata]);

  if (excessFunds > 0n) {
    logDebug('excessFunds', excessFunds);
  }

  const newTotalDue = _.sumBy(milestones, ({ value }) => _.toNumber(value));
  const newDisputeFee =
    resolutionRate && resolutionRate > BigInt(0)
      ? resolutionFeePercentage(resolutionRate.toString()) * newTotalDue
      : 0;

  const [totalNew, decimals] = milestones
    ? milestones
        .map((milestone: { value: string }) => [
          _.toNumber(milestone.value) || 0,
          getDecimals(milestone.value),
        ])
        .reduce(
          ([tot, maxDecimals], [v, d]) => [tot + v, Math.max(d, maxDecimals)],
          [0, 0],
        )
    : [0, 0];

  const isDisabled = !!prepareError || milestones?.some(m => !m.value);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="font-bold mb-4 uppercase text-center text-black text-lg">
        Add New Payment Milestones
      </h2>

      <LinkInput
        name="document"
        label="Link to Project Agreement (if updated)"
        tooltip="If any revisions were made to the agreement in correlation to the new milestones, please include the new link to it. This will be referenced in the case of a dispute."
        localForm={localForm}
      />

      <div className={errors?.milestones ? 'text-red-500' : ''}>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">Milestones</h4>
            <span
              title="Amounts of each milestone for the escrow. Additional milestones can be added later."
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
                    <span>{milestones?.[index].title ?? ''}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg group-open:hidden">
                        {milestones?.[index].value}
                        {` `}
                        {tokenMetadata?.symbol}
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
                        variant="outline"
                        localForm={localForm}
                        w="100%"
                        rightElement={
                          <span className="p-2">{tokenMetadata?.symbol}</span>
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
                <button
                  type="button"
                  className="border border-input p-2 rounded-md hover:bg-accent"
                  aria-label="remove milestone"
                  onClick={() => removeMilestone(index)}
                >
                  <DeleteIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            {errors?.milestones?.message && (
              <p className="text-red-500 text-sm mb-4">
                {errors?.milestones?.message as string}
              </p>
            )}
          </div>

          <button
            type="button"
            className="border border-input px-4 py-2 rounded-md hover:bg-accent w-full flex items-center justify-center gap-2"
            onClick={() => {
              appendMilestone({
                value: '1',
                title: `Milestone ${(amounts?.length ?? 0) + milestonesFields.length + 1}`,
                description: '',
              });
            }}
          >
            Add a new milestone
            <AddIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!!newTotalDue && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="font-bold text-black">
              Total {milestones?.length} milestones:
            </p>

            <p>
              {commify(totalNew.toFixed(decimals), decimals)}{' '}
              {tokenMetadata?.symbol}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="font-bold text-black">
              Potential dispute fee:
            </p>
            <p>
              {commify(
                newDisputeFee.toFixed(
                  newDisputeFee < 1 ? decimals + 3 : decimals,
                ),
                newDisputeFee < 1 ? decimals + 3 : decimals,
              )}{' '}
              {tokenMetadata?.symbol}
            </p>
            decimal : {getDecimals(newDisputeFee.toString())}
          </div>
        </div>
      )}

      <p>
        Note: new milestones may take a few minutes to appear in the list
      </p>

      <button
        onClick={() => {
          writeAsync?.();
        }}
        disabled={isDisabled}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase font-bold w-full text-sm md:text-base"
      >
        {isLoading && (
          <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 align-middle" />
        )}
        Add
      </button>
    </div>
  );
}

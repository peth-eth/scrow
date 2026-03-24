import { yupResolver } from '@hookform/resolvers/yup';
import { ESCROW_STEPS, INVOICE_TYPES } from '@smartinvoicexyz/constants';
import { ValueOf } from '@smartinvoicexyz/types';
import {
  DatePicker,
  Input,
  LinkInput,
  Textarea,
} from '@smartinvoicexyz/ui';
import {
  oneMonthFromNow,
  projectDetailsSchema,
  sevenDaysFromDate,
  sevenDaysFromNow,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useForm, UseFormReturn } from 'react-hook-form';

type FormValues = {
  title: string | undefined;
  description: string | undefined;
  document: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  safetyValveDate: Date | undefined;
  deadline: Date | undefined;
};

export function ProjectDetailsForm({
  invoiceForm,
  updateStep,
  type,
}: {
  invoiceForm: UseFormReturn;
  updateStep: () => void;
  type: ValueOf<typeof INVOICE_TYPES>;
}) {
  const { setValue, watch } = invoiceForm;

  const {
    title,
    description,
    document,
    startDate,
    endDate,
    safetyValveDate,
    deadline,
  } = watch();

  const localForm = useForm({
    resolver: yupResolver(projectDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      title,
      description,
      document: document || '',
      startDate: startDate || new Date(),
      endDate: endDate || sevenDaysFromNow(),
      safetyValveDate: safetyValveDate || oneMonthFromNow(),
      deadline: deadline || oneMonthFromNow(),
    },
  });

  const {
    handleSubmit,
    setValue: setFormValue,
    formState: { isValid },
    trigger,
  } = localForm;

  const onSubmit = async (values: Partial<FormValues>) => {
    setValue('title', values.title);
    setValue('description', values.description);
    setValue('document', values.document);
    setValue('startDate', values.startDate);
    setValue('endDate', values.endDate);
    setValue('safetyValveDate', values.safetyValveDate);
    setValue('deadline', values.deadline);

    // move form
    updateStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 w-full">
        <Input
          label="Title"
          name="title"
          tooltip="The name of the project"
          placeholder="An adventure slaying Moloch"
          registerOptions={{ required: true }}
          localForm={localForm}
        />
        <Textarea
          label="Description"
          name="description"
          tooltip="A detailed description of the project"
          placeholder="Describe the project in detail. What is the scope? What are the deliverables? What are the milestones? What are the expectations?"
          variant="outline"
          registerOptions={{ required: true }}
          localForm={localForm}
        />
        <LinkInput
          name="document"
          label="Project Proposal, Agreement or Specification"
          tooltip="A URL to a project proposal, agreement or specification. This is optional."
          placeholder="github.com/AcmeAcademy/buidler"
          localForm={localForm}
        />

        <div className="grid grid-cols-3 pb-4">
          <DatePicker
            label="Start Date"
            name="startDate"
            tooltip="The date the project is expected to start"
            localForm={localForm}
            onChange={(v: Date) => {
              setFormValue('startDate', v);
              trigger();
            }}
          />
          <DatePicker
            label="Estimated End Date"
            name="endDate"
            tooltip="The date the project is expected to end. This value is not formally used in the escrow."
            localForm={localForm}
            onChange={(v: Date) => {
              setFormValue('endDate', v);
              setFormValue('deadline', sevenDaysFromDate(v));
              trigger();
            }}
          />
          {type === INVOICE_TYPES.Instant ? (
            <DatePicker
              name="deadline"
              label="Deadline"
              placeholder="Select a date"
              tooltip="A specific date when the total payment is due."
              localForm={localForm}
            />
          ) : (
            <DatePicker
              label="Withdrawal Deadline"
              name="safetyValveDate"
              tooltip="If the project isn't completed or disputed by this date, the client can withdraw remaining funds. Set this well into the future."
              localForm={localForm}
              onChange={(v: Date) => {
                setFormValue('safetyValveDate', v);
                trigger();
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mt-5">
          <button
            type="submit"
            disabled={!isValid}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase font-mono font-bold text-sm md:text-base"
          >
            Next: {ESCROW_STEPS[1].next}
          </button>
        </div>
      </div>
    </form>
  );
}

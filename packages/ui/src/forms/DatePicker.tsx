import 'react-datepicker/dist/react-datepicker.css';

import { getDateString } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import ReactDatePicker from 'react-datepicker';
import { Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { InfoOutlineIcon } from '../icons';

export type DatePickerProps = {
  name: string;
  label?: string;
  tip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: Pick<UseFormReturn<any>, 'control' | 'formState' | 'watch'>;
  registerOptions?: RegisterOptions;
  tooltip?: string;
  placeholder?: string;
  variant?: string;
  spacing?: number | string;
  onChange?: (date: Date) => void;
};

export function DatePicker({
  label,
  name,
  localForm,
  registerOptions,
  tooltip,
  placeholder,
  variant = 'outline',
  spacing,
  onChange,
  ...props
}: DatePickerProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = _.pick(localForm, ['control', 'watch', 'formState']);

  const dateInput = new Date(watch(name)).getTime();
  const dateSeconds =
    _.size(_.toString(dateInput)) > 9 ? dateInput / 1000 : dateInput;

  return (
    <Controller
      name={name}
      control={control}
      rules={registerOptions}
      shouldUnregister={false}
      render={({ field: { value, ...field } }) => (
        <div className={errors[name] ? '' : ''}>
          <div className="flex flex-col h-[75px]" style={{ gap: spacing ? `${spacing}px` : undefined }}>
            <div className="flex items-center gap-2">
              {label && (
                <label className="m-0 text-sm font-medium">{label}</label>
              )}
              {tooltip && (
                <span title={tooltip}>
                  <InfoOutlineIcon
                    boxSize={3}
                    className="text-blue-500 bg-white rounded-full cursor-help"
                  />
                </span>
              )}
            </div>
            <div>
              <ReactDatePicker
                {...field}
                {...props}
                selected={value}
                customInput={
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      variant === 'outline'
                        ? 'border border-gray-300 bg-transparent hover:bg-gray-50'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                    type="button"
                  >
                    {getDateString(dateSeconds) || placeholder}
                  </button>
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(ref: any) => {
                  field.ref({
                    focus: ref?.setFocus,
                  });
                }}
                onChange={(date: Date | null) => {
                  if (onChange && !!date) {
                    onChange(date);
                  }
                  field.onChange(date);
                }}
              />
              {errors[name]?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}

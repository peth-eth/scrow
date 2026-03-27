import { CSSProperties } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';

import { FormTooltip } from './FormTooltip';

type Required = 'required' | 'optional';

interface SelectProps {
  name: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  infoText?: string;
  tooltip?: string | React.ReactElement;
  required?: Required;
  isDisabled?: boolean;
  options: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
  style?: CSSProperties;
}

export function ReactSelect({
  name,
  label,
  localForm,
  infoText,
  tooltip,
  required,
  isDisabled = false,
  defaultValue,
  ...props
}: React.PropsWithChildren<SelectProps>) {
  const { control } = localForm;
  return (
    <div className="flex flex-col w-full gap-1.5 justify-between">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {label && (
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2">
                  <label className="m-0 text-sm font-medium">{label}</label>

                  <div className="flex items-center gap-1">
                    {infoText && <p className="text-xs">{infoText}</p>}
                    {tooltip && <FormTooltip content={typeof tooltip === 'string' ? tooltip : tooltip} />}
                  </div>
                </div>
                <p className="italic text-xs ml-[5px]">{required}</p>
              </div>
            )}

            <Select
              {...field}
              onChange={option => field.onChange(option?.value)}
              value={props.options.find(option => option.value === field.value)}
              defaultValue={props.options.find(
                option => option.value.toLowerCase() === defaultValue,
              )}
              isDisabled={isDisabled}
              styles={{
                control: base => ({
                  ...base,
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--input))',
                  '&:hover': { borderColor: 'hsl(var(--input))' },
                }),
                singleValue: base => ({
                  ...base,
                  color: 'hsl(var(--foreground))',
                }),
              }}
              {...props}
            />
          </>
        )}
      />
    </div>
  );
}

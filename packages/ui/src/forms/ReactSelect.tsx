import { CSSProperties } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Select from 'react-select';

import { InfoOutlineIcon } from '../icons';

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
    <div className="flex flex-col w-full gap-2 justify-between">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {label && (
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-4">
                  <label className="m-0 text-sm font-medium">{label}</label>

                  <div className="flex items-center gap-1">
                    {infoText && <p className="text-xs">{infoText}</p>}
                    {tooltip && (
                      <span title={typeof tooltip === 'string' ? tooltip : ''}>
                        <InfoOutlineIcon
                          boxSize={3}
                          className="text-blue-500 bg-white rounded-full cursor-help"
                        />
                      </span>
                    )}
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
                  backgroundColor: 'white',
                  borderColor: 'lightgrey',
                  '&:hover': { borderColor: 'lightgrey' },
                }),
                singleValue: base => ({
                  ...base,
                  color: 'black',
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

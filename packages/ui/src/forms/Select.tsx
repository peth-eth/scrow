import { CSSProperties } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

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
  className?: string;
  style?: CSSProperties;
}

export function Select({
  name,
  label,
  localForm,
  infoText,
  tooltip,
  required,
  isDisabled = false,
  children,
  ...props
}: React.PropsWithChildren<SelectProps>) {
  const { control } = localForm;

  return (
    <div className="flex flex-col w-full gap-1.5 justify-between">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
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

            <select
              value={value}
              onChange={onChange}
              disabled={isDisabled}
              className="h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors hover:border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              {...props}
            >
              {children}
            </select>
          </>
        )}
      />
    </div>
  );
}

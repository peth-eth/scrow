import _ from 'lodash';
import React, { InputHTMLAttributes, ReactNode } from 'react';
import { Controller, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { InfoOutlineIcon } from '../icons';

export interface CustomNumberInputProps {
  label?: string | React.ReactNode;
  helperText?: string;
  name: string;
  tooltip?: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  registerOptions?: RegisterOptions;
  step?: number;
  variant?: string;
  min?: number;
  max?: number;
  spacing?: number | string;
  rightElement?: ReactNode;
}

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & CustomNumberInputProps;

/**
 * Primary UI component for Heading
 */
export function NumberInput({
  name,
  label,
  localForm,
  helperText,
  tooltip,
  registerOptions,
  step = 1,
  variant = 'outline',
  min = 0,
  max = 100,
  spacing,
  rightElement,
  placeholder,
  required = false,
  ...props
}: NumberInputProps) {
  if (!localForm) return null;

  const {
    control,
    formState: { errors },
  } = localForm;

  const error = name && errors[name] && errors[name]?.message;
  const localProps = _.omit(props, ['onInvalid', 'filter', 'defaultValue']);

  return (
    <Controller
      control={control}
      name={name}
      rules={registerOptions}
      render={({ field: { ref, ...restField } }) => (
        <div className="m-0">
          <div className="flex flex-col" style={{ gap: spacing ? `${spacing}px` : undefined }}>
            {label && (
              <div className="flex items-center gap-2">
                {label && (
                  <label className="m-0 text-sm font-medium">
                    {label}
                    {(!!registerOptions?.required || required) && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                )}
                {tooltip && (
                  <span title={tooltip}>
                    <InfoOutlineIcon
                      boxSize={3}
                      className="text-primary bg-background rounded-full cursor-help"
                    />
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="number"
                ref={ref}
                step={step}
                min={min}
                max={max}
                placeholder={placeholder}
                className={`flex h-9 w-full rounded-md border ${
                  errors[name] ? 'border-red-500' : 'border-input'
                } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
                {...localProps}
                {...restField}
                onChange={e => restField.onChange(e.target.value)}
              />
              {rightElement && (
                <div className="flex items-center">{rightElement}</div>
              )}
            </div>
            {helperText && (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            )}

            {typeof error === 'string' && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
      )}
    />
  );
}

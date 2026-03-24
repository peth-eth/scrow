import _ from 'lodash';
import React, { TextareaHTMLAttributes } from 'react';
import { RegisterOptions, UseFormReturn } from 'react-hook-form';

import { InfoOutlineIcon } from '../icons';

export type CustomTextareaProps = {
  label: string | React.ReactNode;
  name: string;
  helperText?: string;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  registerOptions?: RegisterOptions;
};

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  CustomTextareaProps;

/**
 * Primary UI component for Textarea Input
 */
export function Textarea({
  label,
  name,
  localForm,
  registerOptions,
  helperText,
  tooltip,
  ...props
}: TextareaProps) {
  const {
    register,
    formState: { errors },
  } = localForm;

  const error = errors[name] && errors[name]?.message;
  const isRequired = _.includes(_.keys(registerOptions), 'required');

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {label && (
            <label className="m-0 text-sm font-medium">
              {label}
              {isRequired && <span className="text-red-500 ml-0.5">*</span>}
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

        <textarea
          className={`flex min-h-[80px] w-full rounded-md border ${
            error ? 'border-red-500' : 'border-input'
          } bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
          {...props}
          {...register(name, registerOptions)}
        />
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {typeof error === 'string' && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}

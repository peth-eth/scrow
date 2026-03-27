import _ from 'lodash';
import { InputHTMLAttributes, ReactNode } from 'react';
import { FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';

import { FormTooltip } from './FormTooltip';

type CustomInputProps = {
  label?: string | ReactNode;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  tooltip?: string;
  helperText?: string;
  registerOptions?: RegisterOptions<FieldValues, string> | undefined;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & CustomInputProps;

/**
 * Primary Input component for React Hook Form
 *
 * @param label - Label for the input
 * @param name - Name of the input
 * @param type - Type of the input
 * @param localForm - React Hook Form object
 * @returns Input component
 *
 */
export function Input({
  label,
  name,
  type,
  localForm,
  registerOptions,
  tooltip,
  helperText,
  ...props
}: InputProps) {
  if (!localForm) return null;
  const {
    register,
    formState: { errors },
  } = localForm;

  const error = errors[name] && errors[name]?.message;
  const isRequired = _.includes(_.keys(registerOptions), 'required');

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center gap-2">
            <label className="m-0 text-sm font-medium">
              {label}
              {isRequired && <span className="text-destructive ml-0.5">*</span>}
            </label>
            {tooltip && <FormTooltip content={tooltip} />}
          </div>
        )}

        <input
          type={type}
          className={`flex h-9 w-full rounded-md border ${
            error ? 'border-destructive' : 'border-input'
          } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
          {...props}
          {...register(name, registerOptions)}
        />
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {typeof error === 'string' && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}

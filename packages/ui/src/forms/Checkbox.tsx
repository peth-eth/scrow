import _ from 'lodash';
import { InputHTMLAttributes, ReactElement, ReactNode } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { FormTooltip } from './FormTooltip';

export interface CustomCheckboxProps {
  name: string;
  label?: string | ReactNode;
  options: (string | ReactNode)[];
  direction?: 'row' | 'column';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  helperText?: string;
  tooltip?: string;
}

export type RadioProps = CustomCheckboxProps &
  InputHTMLAttributes<HTMLInputElement> & { size?: string };

export function Checkbox({
  name,
  label,
  options,
  size,
  direction,
  localForm,
  helperText,
  tooltip,
  ...props
}: RadioProps) {
  const {
    control,
    formState: { errors },
  } = localForm;

  const error = name && errors[name] && errors[name]?.message;

  if (_.eq(_.size(options), 1)) {
    return (
      <Controller
        control={control}
        name={name}
        key={name}
        defaultValue={false}
        render={({ field: { onChange, value, ref } }) => (
          <div className="m-0">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                {label && (
                  <label className="m-0 text-sm font-medium">{label}</label>
                )}
                {tooltip && <FormTooltip content={tooltip} />}
              </div>
              <label className="inline-flex items-center gap-2 capitalize cursor-pointer">
                <input
                  type="checkbox"
                  onChange={e => onChange(e.target.checked)}
                  ref={ref}
                  checked={value}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                  {...props}
                />
                {options[0]}
              </label>
              {helperText && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
              )}
              {typeof error === 'string' && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        )}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {label && (
            <label className="m-0 text-sm font-medium">{label}</label>
          )}
          {tooltip && <FormTooltip content={tooltip} />}
        </div>
        <div
          className={`flex gap-3 ${direction === 'column' ? 'flex-col' : 'flex-row'}`}
        >
          {options.map(
            (option): ReactElement => (
              <Controller
                control={control}
                name={name}
                key={name}
                defaultValue={false}
                render={({ field: { onChange, value, ref } }) => (
                  <label className="inline-flex items-center gap-2 capitalize cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={e => onChange(e.target.checked)}
                      ref={ref}
                      checked={value}
                      className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                      {...props}
                    />
                    {option}
                  </label>
                )}
              />
            ),
          )}
        </div>
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

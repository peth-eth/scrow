import { isValidURL, logDebug, PROTOCOL_OPTIONS } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { CSSProperties, useCallback, useEffect } from 'react';
import { RegisterOptions, UseFormReturn } from 'react-hook-form';

import { InfoOutlineIcon } from '../icons';

interface LinkInputProps {
  name: string;
  label: string;
  linkType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localForm: UseFormReturn<any>;
  registerOptions?: RegisterOptions;
  infoText?: string;
  tooltip?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

const getPath = (url: string | undefined) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return url.slice(urlObj.protocol.length + 2);
  } catch {
    return '';
  }
};

const getProtocol = (url: string | undefined) => {
  if (!url) return 'https://';
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//`;
  } catch {
    return 'https://';
  }
};

export function LinkInput({
  name,
  label,
  infoText,
  tooltip,
  placeholder,
  localForm,
  registerOptions,
  ...props
}: LinkInputProps) {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = localForm;

  const localProtocol = watch(`${name}-protocol`);
  const localInput = watch(`${name}-input`);

  const error = errors?.[name];
  const finalValue = watch(name);
  const isRequired = _.includes(_.keys(registerOptions), 'required');

  const updateValidatedUrl = useCallback(
    (str: string) => {
      const url = new URL(str);
      const urlProtocol = url.protocol === 'http:' ? 'https://' : url.protocol;
      const parsedProtocol = `${urlProtocol}//`;
      setValue(`${name}-input`, str.replace(parsedProtocol, ''));
      setValue(`${name}-protocol`, parsedProtocol);
      setValue(name, str, { shouldValidate: true, shouldDirty: true });
      logDebug('LinkInput - validValue', str);
    },
    [name, setValue],
  );

  useEffect(() => {
    if (!localInput) return;

    if (isValidURL(localInput)) {
      updateValidatedUrl(localInput);
      return;
    }
    if (isValidURL(localProtocol + localInput)) {
      updateValidatedUrl(localProtocol + localInput);
      return;
    }

    setValue(name, localProtocol + localInput, {
      shouldValidate: true,
      shouldDirty: true,
    });
    logDebug('LinkInput - invalidValue', localProtocol + localInput);
  }, [localInput, localProtocol, updateValidatedUrl]);

  useEffect(() => {
    setValue(`${name}-protocol`, 'https://');
  }, [name, setValue]);

  return (
    <div>
      <div className="flex flex-col w-full gap-2 justify-between" {...props}>
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full">
            <div className="flex items-center gap-2">
              <label className="m-0 text-sm font-medium">
                {label}
                {isRequired && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {tooltip && (
                <span title={tooltip}>
                  <InfoOutlineIcon
                    boxSize={3}
                    className="text-primary bg-background rounded-full cursor-help"
                  />
                </span>
              )}
            </div>

            <div className="ml-auto">
              {infoText && <p className="text-xs">{infoText}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex">
            <div className="px-0">
              <select
                {...register(`${name}-protocol`, registerOptions)}
                defaultValue={getProtocol(finalValue)}
                className="h-9 rounded-l-md border border-r-0 border-input bg-muted text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {_.map(PROTOCOL_OPTIONS, option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <input
              {...register(`${name}-input`, registerOptions)}
              maxLength={240}
              placeholder={placeholder}
              type="text"
              defaultValue={getPath(finalValue)}
              className={`flex-1 h-9 rounded-r-md border ${
                error ? 'border-red-500' : 'border-input'
              } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent`}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-1">Invalid URL</p>
          )}
        </div>
      </div>
    </div>
  );
}

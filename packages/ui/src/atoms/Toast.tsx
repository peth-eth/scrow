import { ToastProps } from '@smartinvoicexyz/types';

import { CloseIcon } from '../icons';

type AlertStatus = 'success' | 'error' | 'info' | 'warning' | 'loading';

const bgValues: {
  [key in AlertStatus]: string;
} = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-blue-500',
  loading: 'bg-blue-500',
};

export function Toast({
  title,
  description,
  status = 'success',
  closeToast,
  descriptionNoOfLines,
  ...props
}: ToastProps) {
  const lineClampClass =
    descriptionNoOfLines === 1
      ? 'line-clamp-1'
      : descriptionNoOfLines === 3
        ? 'line-clamp-3'
        : 'line-clamp-2';

  return (
    <div
      className={`relative flex rounded-[15px] p-4 text-white min-w-[350px] ${bgValues[status as AlertStatus] ?? 'bg-blue-500'}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className={`text-sm ${lineClampClass}`}>{description}</p>
          )}
        </div>
      </div>
      {props.isClosable === true && (
        <div
          className="ml-8 flex items-start cursor-pointer"
          onClick={closeToast}
        >
          <CloseIcon
            onClick={closeToast}
            boxSize={5}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}

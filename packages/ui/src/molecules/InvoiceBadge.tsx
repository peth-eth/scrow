import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import { ValueOf } from '@smartinvoicexyz/types';

type InvoiceType = ValueOf<typeof INVOICE_TYPES> | 'unknown';

export type InvoiceBadgeProps = {
  invoiceType?: InvoiceType;
};

const schemes: { [key: InvoiceType]: { bg: string; color: string } } = {
  escrow: {
    bg: 'rgba(128, 63, 248, 0.3)',
    color: 'rgba(128, 63, 248, 1)',
  },
  instant: {
    bg: 'rgba(248, 174, 63, 0.3)',
    color: 'rgba(248, 174, 63, 1)',
  },
  updatable: {
    bg: 'rgba(248, 174, 63, 0.3)',
    color: 'rgba(248, 174, 63, 1)',
  },
  'updatable-v2': {
    bg: 'rgba(248, 174, 63, 0.3)',
    color: 'rgba(248, 174, 63, 1)',
  },
  unknown: {
    bg: 'rgba(150,150,150,0.3)',
    color: 'rgba(150,150,150,1)',
  },
};

export const invoiceLabels: { [key in InvoiceType]: string } = {
  escrow: 'Escrow'.toUpperCase(),
  instant: 'Instant'.toUpperCase(),
  updatable: 'Updatable Escrow'.toUpperCase(),
  'updatable-v2': 'Updatable Escrow v2'.toUpperCase(),
  unknown: 'Unknown'.toUpperCase(),
};

export function InvoiceBadge({ invoiceType = 'unknown' }: InvoiceBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium max-w-fit h-fit"
      style={{
        backgroundColor: schemes[invoiceType].bg,
        color: schemes[invoiceType].color,
      }}
    >
      {invoiceLabels[invoiceType]}
    </span>
  );
}

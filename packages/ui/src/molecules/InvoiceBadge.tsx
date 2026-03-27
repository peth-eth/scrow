import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import { ValueOf } from '@smartinvoicexyz/types';

type InvoiceType = ValueOf<typeof INVOICE_TYPES> | 'unknown';

export type InvoiceBadgeProps = {
  invoiceType?: InvoiceType;
};

const schemes: { [key: InvoiceType]: string } = {
  escrow: 'bg-primary/30 text-primary',
  instant: 'bg-amber-500/30 text-amber-500',
  updatable: 'bg-amber-500/30 text-amber-500',
  'updatable-v2': 'bg-amber-500/30 text-amber-500',
  unknown: 'bg-muted text-muted-foreground',
};

export const invoiceLabels: { [key in InvoiceType]: string } = {
  escrow: 'Escrow',
  instant: 'Instant',
  updatable: 'Updatable Escrow',
  'updatable-v2': 'Updatable Escrow v2',
  unknown: 'Unknown',
};

export function InvoiceBadge({ invoiceType = 'unknown' }: InvoiceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium max-w-fit h-fit ${schemes[invoiceType]}`}
    >
      {invoiceLabels[invoiceType]}
    </span>
  );
}

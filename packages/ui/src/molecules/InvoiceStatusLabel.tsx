import { useInvoiceStatus } from '@smartinvoicexyz/hooks';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import _ from 'lodash';

import { Loader } from '../atoms/Loader';

export type InvoiceStatusLabelProps = {
  invoice: Partial<InvoiceDetails>;
  onClick?: () => void;
};

export function InvoiceStatusLabel({
  invoice,
  onClick,
}: InvoiceStatusLabelProps) {
  const { data: status, isLoading } = useInvoiceStatus({ invoice });
  const { funded, label } = _.pick(status, ['funded', 'label']);
  const { isLocked, terminationTime } = invoice ?? {};
  const terminated = terminationTime && Number(terminationTime) > Date.now();
  const disputeResolved = label === 'Dispute Resolved';

  let colorClass = 'bg-amber-500/20 text-amber-400';
  if (isLoading) colorClass = 'bg-muted text-muted-foreground';
  if (terminated || disputeResolved || label === 'Expired') {
    colorClass = 'bg-muted text-muted-foreground';
  }
  if (isLocked) colorClass = 'bg-destructive/20 text-red-400';
  if (label === 'Overdue') colorClass = 'bg-destructive/20 text-red-400';
  if (funded) colorClass = 'bg-emerald-500/20 text-emerald-400';

  return (
    <div
      className={`flex justify-center rounded-[10px] p-1.5 min-w-[165px] ${colorClass}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <p className="font-bold text-center text-[15px]">
        {isLoading ? <Loader size="20" /> : label}
      </p>
    </div>
  );
}

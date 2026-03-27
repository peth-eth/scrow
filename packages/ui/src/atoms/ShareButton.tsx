import { BASE_URL } from '@smartinvoicexyz/constants';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { chainLabelFromId, getChainName } from '@smartinvoicexyz/utils';
import { RWebShare } from 'react-web-share';

import { ShareIcon } from '../icons';
import { Button } from './Button';

export function ShareButton({ invoice }: { invoice: Partial<InvoiceDetails> }) {
  const { chainId, id: invoiceId, metadata } = invoice;
  const { title } = metadata || {};

  const chainLabel = invoice.chainId
    ? chainLabelFromId(invoice.chainId)
    : 'unknown';

  const url = `${BASE_URL}/invoice/${chainLabel}/${invoiceId}`;

  const text = `sCrow contract for ${title} on ${getChainName(chainId)}`;

  return (
    <RWebShare
      data={{
        text,
        title,
        url,
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="p-1 text-primary hover:text-primary/80"
        aria-label="Share this contract"
      >
        <ShareIcon boxSize={5} />
      </Button>
    </RWebShare>
  );
}

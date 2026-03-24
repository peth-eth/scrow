import { useInvoiceDetails } from '@smartinvoicexyz/hooks';
import {
  Container,
  InvoiceNotFound,
  Loader,
} from '@smartinvoicexyz/ui';
import {
  chainLabelFromId,
  getIpfsLink,
  getTxLink,
  parseChainId,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Hex, isAddress } from 'viem';

import { Button } from '../../../../components/ui/button';

function LockedInvoice() {
  const router = useRouter();
  const { invoiceId: invId, chainId: urlChainId } = router.query;

  const invoiceId = _.toLower(String(invId)) as Hex;
  const invoiceChainId = parseChainId(urlChainId);

  useEffect(() => {
    if (invoiceId && invoiceChainId) {
      router.replace({
        pathname: `/invoice/${chainLabelFromId(invoiceChainId)}/${invoiceId}`,
        query: undefined,
      });
    }
  }, [invoiceId, invoiceChainId, router]);

  if (!invoiceChainId) {
    return <InvoiceNotFound heading="Invalid Chain Id" />;
  }

  const invoiceChainLabel = chainLabelFromId(invoiceChainId);

  const { invoiceDetails, isLoading } = useInvoiceDetails({
    address: invoiceId,
    chainId: invoiceChainId,
  });

  if (!isAddress(invoiceId) || (!invoiceDetails === null && !isLoading)) {
    return <InvoiceNotFound />;
  }

  if (!invoiceDetails || isLoading) {
    return (
      <Container overlay>
        <Loader size="80" />
        If the invoice does not load,
        <br />
        please refresh the browser.
      </Container>
    );
  }

  const { dispute } = _.pick(invoiceDetails, ['dispute']);

  if (!dispute) {
    return <InvoiceNotFound heading="Invoice Not Locked" />;
  }

  return (
    <Container overlay>
      <div className="my-32 flex w-full max-w-[35rem] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-center text-2xl font-normal">
          Funds Securely Locked
        </h1>

        <p className="mb-4 text-center text-sm text-white">
          You can view the transaction{' '}
          <a
            href={getTxLink(invoiceChainId, dispute.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-destructive underline"
          >
            here
          </a>
          <br />
          You can view the details on IPFS{' '}
          <a
            href={getIpfsLink(dispute.ipfsHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-destructive underline"
          >
            here
          </a>
        </p>

        <p className="mb-4 text-center italic text-white">
          Once a decision is made, the funds will be dispersed according to the
          ruling.
          <br />
          Return to the{' '}
          <Link
            href={`/invoice/${invoiceChainLabel}/${invoiceId}`}
            className="underline"
          >
            invoice details page
          </Link>{' '}
          to view the results.
        </p>

        <Link href="/" className="w-full max-w-[30rem]">
          <Button
            variant="outline"
            size="lg"
            className="w-full font-mono font-normal uppercase text-destructive border-destructive hover:bg-destructive/10"
          >
            Return Home
          </Button>
        </Link>
      </div>
    </Container>
  );
}

export default LockedInvoice;

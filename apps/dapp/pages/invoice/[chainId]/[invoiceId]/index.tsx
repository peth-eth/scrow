import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import {
  InstantButtonManager,
  InstantPaymentDetails,
  InvoiceButtonManager,
  InvoicePaymentDetails,
} from '@smartinvoicexyz/forms';
import { useInvoiceDetails } from '@smartinvoicexyz/hooks';
import { prefetchInvoiceDetails } from '@smartinvoicexyz/hooks/src/prefetchInvoiceDetails';
import {
  Container,
  InvoiceMetaDetails,
  InvoiceNotFound,
  Loader,
} from '@smartinvoicexyz/ui';
import {
  chainLabelFromId,
  getChainName,
  parseChainId,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Hex, isAddress } from 'viem';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { useOverlay } from '../../../../contexts/OverlayContext';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { invoiceId: invId, chainId: urlChainId } = context.params as {
    invoiceId: string;
    chainId: string;
  };

  const invoiceId = _.toLower(String(invId)) as Hex;
  const chainId = parseChainId(urlChainId);

  // If chainId is undefined, return 404
  if (!chainId) {
    return {
      notFound: true,
    };
  }

  const chainLabel = chainLabelFromId(chainId);

  // If the chain label doesn't match the URL chain ID, redirect to the correct URL
  if (chainLabel !== urlChainId) {
    return {
      redirect: {
        destination: `/invoice/${chainLabel}/${invoiceId}`,
        permanent: false,
      },
    };
  }

  // Prefetch all invoice details with extra error handling
  let dehydratedState = null;
  try {
    dehydratedState = await prefetchInvoiceDetails(invoiceId, chainId);
  } catch (error) {
    console.error('Server-side prefetch failed:', error);
    // Continue without prefetched data - client will fetch on mount
  }

  return {
    props: {
      dehydratedState,
    },
  };
}

const ROLE_BADGE_VARIANTS: Record<
  string,
  'default' | 'success' | 'secondary' | 'outline'
> = {
  blue: 'default',
  green: 'success',
  purple: 'default',
  gray: 'secondary',
};

function ViewInvoice() {
  const router = useRouter();
  const { invoiceId: invId, chainId: urlChainId } = router.query;

  const invoiceId = _.toLower(String(invId)) as Hex;
  const invoiceChainId = parseChainId(urlChainId);

  const { invoiceDetails, isLoading } = useInvoiceDetails({
    chainId: invoiceChainId,
    address: invoiceId,
  });

  const { address } = useAccount();
  const chainId = useChainId();

  const { switchChain } = useSwitchChain();

  const overlay = useOverlay();

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

  const invoiceType = _.get(
    invoiceDetails,
    'invoiceType',
    INVOICE_TYPES.Escrow,
  );

  const isInvalidChainId =
    !!address && !!invoiceChainId && chainId !== invoiceChainId;

  const showNetworkError = isInvalidChainId;

  const roleBadge = useMemo(() => {
    const lowerAddress = _.toLower(address);
    if (lowerAddress && lowerAddress === _.toLower(invoiceDetails.client))
      return { label: 'You are the Client', color: 'blue' };
    if (lowerAddress && lowerAddress === _.toLower(invoiceDetails.provider))
      return { label: 'You are the Provider', color: 'green' };
    if (lowerAddress && lowerAddress === _.toLower(invoiceDetails.resolver))
      return { label: 'You are the Arbitrator', color: 'purple' };
    return { label: 'Viewing as Observer', color: 'gray' };
  }, [
    address,
    invoiceDetails.client,
    invoiceDetails.provider,
    invoiceDetails.resolver,
  ]);

  return (
    <Container overlay>
      <div className="relative flex w-full flex-col items-center justify-center gap-8 px-4 py-32 lg:flex-row">
        <Badge
          variant={ROLE_BADGE_VARIANTS[roleBadge.color] || 'secondary'}
          className="absolute top-20 rounded-md px-3 py-1 text-sm"
        >
          {roleBadge.label}
        </Badge>

        <InvoiceMetaDetails invoice={invoiceDetails} />

        <div className="flex w-full max-w-[60rem] flex-col gap-4">
          {invoiceType === INVOICE_TYPES.Instant ? (
            <>
              <InstantPaymentDetails invoice={invoiceDetails} />
              <InstantButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          ) : (
            <>
              <InvoicePaymentDetails invoice={invoiceDetails} {...overlay} />
              <InvoiceButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          )}
          {showNetworkError && (
            <Button
              className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
              onClick={() => switchChain?.({ chainId: invoiceChainId })}
            >
              Click here to switch network to {getChainName(invoiceChainId)}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}

export default ViewInvoice;

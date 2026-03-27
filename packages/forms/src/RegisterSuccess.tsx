import { BASE_URL } from '@smartinvoicexyz/constants';
import { Button, ChakraNextLink, CheckCircleIcon, CopyIcon } from '@smartinvoicexyz/ui';
import { chainLabelFromId, getTxLink } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useState } from 'react';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

export function RegisterSuccess({
  invoiceId,
  txHash,
}: {
  invoiceId: Address;
  txHash: Address;
}) {
  const chainId = useChainId();

  const chainLabel = chainLabelFromId(chainId);

  const url = `/invoice/${chainLabel}/${invoiceId}`;
  const fullUrl = `${BASE_URL}${url}`;

  const [idCopied, setIdCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(_.toLower(invoiceId));
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center px-4">
      <CheckCircleIcon className="w-28 h-28 text-primary" />

      <p className="text-foreground text-center text-lg">
        You can view your transaction
        <a
          href={getTxLink(chainId, txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary ml-1 underline"
        >
          here
        </a>
      </p>

      <div className="flex flex-col w-full items-stretch">
        <p className="font-bold">Your Contract ID</p>

        <div className="flex p-2 justify-between items-center bg-card rounded w-full">
          <div className="flex items-center gap-2 bg-muted p-3 rounded overflow-clip w-full">
            <a
              href={url}
              className="ml-2 text-foreground overflow-clip w-full"
            >
              {invoiceId}
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={copyId}
              title={idCopied ? 'Copied!' : 'Copy'}
              className="text-primary"
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-stretch mb-6">
        <p className="font-bold">Link to Contract</p>
        <div className="flex p-2 justify-between items-center bg-card rounded w-full">
          <div className="flex items-center gap-2 bg-muted p-3 rounded overflow-clip w-full">
            <a
              href={url}
              className="ml-2 text-foreground overflow-clip w-full"
            >
              {_.truncate(fullUrl, {
                length: 60,
                omission: '...',
              })}
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={copyLink}
              title={linkCopied ? 'Copied!' : 'Copy'}
              className="ml-4 text-primary"
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-stretch mb-4 px-2">
        <p className="font-bold text-sm text-muted-foreground">
          What happens next?
        </p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground">
          <li>Share the contract link with your client</li>
          <li>Client deposits funds into escrow</li>
          <li>Release funds as milestones are completed</li>
        </ol>
      </div>

      <div className="flex items-center gap-2">
        <ChakraNextLink href="/invoices">
          <Button variant="outline" className="text-lg font-medium">
            Return Home
          </Button>
        </ChakraNextLink>
        <ChakraNextLink href={url}>
          <Button className="text-lg font-medium">
            View Contract
          </Button>
        </ChakraNextLink>
      </div>
    </div>
  );
}

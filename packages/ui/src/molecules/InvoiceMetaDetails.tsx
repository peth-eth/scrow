import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { documentToHttp, getDateString } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { Address, isAddress, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

import {
  AccountLink,
  CopyIcon,
  GenerateInvoicePDF,
  InvoiceBadge,
  NetworkBadge,
  QuestionIcon,
  ShareButton,
  VerifyInvoice,
} from '..';
import { ExternalLinkIcon } from '../icons';

export function InvoiceMetaDetails({
  invoice,
}: {
  invoice: Partial<InvoiceDetails>;
}) {
  const { address } = useAccount();

  const {
    id: invoiceId,
    metadata,
    terminationTime,
    deadline,
    client,
    clientReceiver,
    provider,
    providerReceiver,
    resolver,
    verified,
    invoiceType,
    resolverInfo,
    chainId: invoiceChainId,
  } = _.pick(invoice, [
    'id',
    'client',
    'clientReceiver',
    'provider',
    'providerReceiver',
    'resolver',
    'terminationTime',
    'deadline',
    'metadata',
    'verified',
    'invoiceType',
    'resolverInfo',
    'chainId',
  ]);

  const { startDate, endDate, title, description, documents } = _.pick(
    metadata,
    ['startDate', 'endDate', 'title', 'description', 'documents'],
  );
  const lastDocument = _.findLast(documents);

  const validClient = !!client && isAddress(client) ? client : undefined;
  const validProvider =
    !!provider && isAddress(provider) ? provider : undefined;
  const validResolver =
    !!resolver && isAddress(resolver) && resolver !== zeroAddress
      ? resolver
      : undefined;

  const validClientReceiver =
    !!clientReceiver &&
    isAddress(clientReceiver) &&
    clientReceiver !== zeroAddress &&
    clientReceiver.toLowerCase() !== client?.toLowerCase()
      ? clientReceiver
      : undefined;
  const validProviderReceiver =
    !!providerReceiver &&
    isAddress(providerReceiver) &&
    providerReceiver !== zeroAddress &&
    providerReceiver.toLowerCase() !== provider?.toLowerCase()
      ? providerReceiver
      : undefined;

  const isClient = _.toLower(address) === client;

  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(_.toLower(invoiceId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifiedStatus = useMemo(
    () =>
      !_.isEmpty(verified) && !!_.find(verified, { client: invoice?.client }),
    [invoice],
  );

  const details = useMemo(
    () => [
      !!startDate &&
        _.toString(startDate) !== '0' && {
          label: 'Project Start Date:',
          value: getDateString(_.toNumber(_.toString(startDate))),
        },
      !!startDate &&
        _.toString(endDate) !== '0' && {
          label: 'Project End Date:',
          value: getDateString(_.toNumber(_.toString(endDate))),
        },
      !!terminationTime &&
        BigInt(terminationTime) !== BigInt(0) && {
          label: 'Withdrawal Deadline:',
          value: getDateString(_.toNumber(_.toString(terminationTime))),
          tip: 'If no dispute is raised, the client can reclaim remaining funds after this date',
        },
      !!deadline && {
        label: 'Payment Deadline:',
        value: getDateString(_.toNumber(_.toString(deadline))),
        tip: `Late fees start accumulating after ${new Date(
          _.toNumber(deadline?.toString()) * 1000,
        ).toUTCString()} until total amount is paid.`,
      },
      validClient && {
        label: 'Client Account:',
        value: <AccountLink address={validClient} chainId={invoiceChainId} />,
      },
      validClientReceiver && {
        label: 'Client Receiver:',
        value: (
          <AccountLink address={validClientReceiver} chainId={invoiceChainId} />
        ),
      },
      validProvider && {
        label: 'Provider Account:',
        value: <AccountLink address={validProvider} chainId={invoiceChainId} />,
      },
      validProviderReceiver && {
        label: 'Provider Receiver:',
        value: (
          <AccountLink
            address={validProviderReceiver}
            chainId={invoiceChainId}
          />
        ),
      },
      validResolver && {
        label: 'Arbitration Provider:',
        value: (
          <AccountLink
            address={validResolver}
            chainId={invoiceChainId}
            resolverInfo={resolverInfo}
          />
        ),
      },
    ],
    [
      startDate,
      endDate,
      terminationTime,
      validClient,
      validClientReceiver,
      validProviderReceiver,
      validProvider,
      validResolver,
      invoiceChainId,
    ],
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-full lg:max-w-[25rem] justify-center items-stretch">
      <div className="flex flex-col gap-2 justify-center items-stretch">
        {title && (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl text-foreground font-heading">{title}</h2>
            <ShareButton invoice={invoice} />
          </div>
        )}
        <div className="flex items-center gap-2">
          <InvoiceBadge invoiceType={invoiceType} />
          <div className="w-1 h-1 bg-foreground rotate-45" />
          <NetworkBadge chainId={invoiceChainId} />
        </div>

        <div className="flex items-center gap-4">
          <AccountLink
            address={invoiceId as Address}
            chainId={invoiceChainId}
          />
          <button
            onClick={onCopy}
            className="p-1 bg-transparent text-primary hover:text-primary/80 transition-colors"
            title={copied ? 'Copied!' : 'Copy'}
          >
            <CopyIcon boxSize={3.5} />
          </button>
        </div>
        {description && <p>{description}</p>}

        {!!lastDocument && (
          <a
            href={documentToHttp(lastDocument)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center gap-1 px-2 py-1 text-xs uppercase border border-primary text-primary rounded hover:bg-primary/10 transition-colors">
              View Details of Agreement
              <ExternalLinkIcon boxSize={3} />
            </button>
          </a>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm justify-center items-stretch">
        {_.map(_.compact(details), ({ label, value, tip }) => (
          <div key={label} className="flex flex-wrap gap-1">
            <span>
              <p>{label}</p>
            </span>

            <span>
              <div className="flex items-center gap-1">
                {typeof value === 'string' ? (
                  <p className="font-bold">{value}</p>
                ) : (
                  value
                )}

                {tip && (
                  <span title={tip}>
                    <QuestionIcon
                      boxSize={3}
                      className="text-muted-foreground cursor-help"
                    />
                  </span>
                )}
              </div>
            </span>
          </div>
        ))}

        {invoiceType === INVOICE_TYPES.Escrow && (
          <div className="flex flex-wrap gap-1">
            <span>
              <div className="flex items-center gap-1">
                <p>{'Non-Client Deposits Enabled: '}</p>
                <span title="When enabled, anyone (not just the client) can deposit funds into this escrow">
                  <QuestionIcon
                    boxSize={3}
                    className="text-muted-foreground cursor-help"
                  />
                </span>
              </div>
            </span>

            <span className="font-bold">
              {invoice && verifiedStatus ? (
                <div className="flex items-center gap-1">
                  <p className="text-green-500">Enabled!</p>
                  <span title="The client has confirmed they can interact with this escrow contract">
                    <QuestionIcon
                      boxSize={3}
                      className="text-muted-foreground cursor-help"
                    />
                  </span>
                </div>
              ) : (
                <p className="text-red-500">Not enabled</p>
              )}
            </span>

            <span className="font-bold">
              <VerifyInvoice
                invoice={invoice}
                isClient={isClient}
                verifiedStatus={verifiedStatus}
              />
            </span>
          </div>
        )}

        <div className="flex flex-wrap">
          <GenerateInvoicePDF
            invoice={invoice}
            buttonText="Preview & Download Invoice PDF"
          />
        </div>
      </div>
    </div>
  );
}

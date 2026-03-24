import { useSubgraphHealth } from '@smartinvoicexyz/hooks';
import {
  chainByName,
  getChainName,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useMemo } from 'react';
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
import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { documentToHttp, getDateString } from '@smartinvoicexyz/utils';
import { useState } from 'react';
import { Address, isAddress, zeroAddress } from 'viem';

// This is the SubgraphStatus variant of InvoiceMetaDetails
// that uses `chainByName` instead of direct chainId
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
  ]);

  const { startDate, endDate, title, description, documents } = _.pick(
    metadata,
    ['startDate', 'endDate', 'title', 'description', 'documents'],
  );

  const invoiceChainId = chainByName(invoice?.network)?.id;
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
          tip: `The Withdrawal Deadline activates on ${new Date(
            Number(terminationTime) * 1000,
          ).toUTCString()}`,
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

  const lastDocument = _.findLast(documents);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full lg:max-w-[25rem] justify-center items-stretch">
      <div className="flex flex-col gap-2 justify-center items-stretch">
        {title && (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl text-black font-heading">{title}</h2>
            <ShareButton invoice={invoice} />
          </div>
        )}
        <div className="flex items-center gap-2">
          <InvoiceBadge invoiceType={invoiceType} />
          <div className="w-1 h-1 bg-black rotate-45" />
          <NetworkBadge chainId={invoiceChainId} />
        </div>

        <div className="flex items-center gap-4">
          <AccountLink
            address={invoiceId as Address}
            chainId={invoiceChainId}
          />
          <button
            onClick={onCopy}
            className="p-1 bg-transparent text-blue-500 hover:text-blue-700 transition-colors"
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
            <button className="flex items-center gap-1 px-2 py-1 text-xs uppercase border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors">
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
                      className="text-gray-400 cursor-help"
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
              <p>{'Non-Client Deposits Enabled: '}</p>
            </span>

            <span className="font-bold">
              {invoice && verifiedStatus ? (
                <p className="text-green-500">Enabled!</p>
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

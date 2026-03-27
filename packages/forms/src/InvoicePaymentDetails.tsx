import { Dispute, Resolution } from '@smartinvoicexyz/graphql';
import {
  InvoiceDetails,
  ModalTypes,
  OverlayContextType,
} from '@smartinvoicexyz/types';
import { AccountLink, Modal, QuestionIcon } from '@smartinvoicexyz/ui';
import {
  commify,
  getDateString,
  getIpfsLink,
  getTxLink,
  isEmptyIpfsHash,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { formatUnits, Hex } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { AddMilestones } from './AddMilestones';

type DisputeWithResolution = {
  dispute: Dispute;
  resolution: Resolution | null;
  resolutionDetails:
    | { distributee: string | undefined; amount: bigint | undefined }[]
    | null;
};

const getDisputesWithResolution = (
  disputes: Dispute[] | undefined,
  resolutions: Resolution[] | undefined,
  resolver: string | undefined,
  client: string | undefined,
  provider: string | undefined,
): DisputeWithResolution[] => {
  const parsed = _.map(disputes, (dispute, i) => {
    const resolution = resolutions?.[i] || null;
    const resolutionDetails = resolution
      ? [
          { distributee: resolver, amount: resolution.resolutionFee },
          { distributee: client, amount: resolution.clientAward },
          { distributee: provider, amount: resolution.providerAward },
        ]
      : null;

    return { dispute, resolution, resolutionDetails };
  });

  return [...parsed].reverse();
};

export function InvoicePaymentDetails({
  invoice,
  modals,
  openModal,
  closeModals,
}: {
  invoice: Partial<InvoiceDetails>;
} & OverlayContextType) {
  const { address } = useAccount();
  const isConnected = !!address;
  const chainId = useChainId();

  const {
    client,
    provider,
    released,
    deposited,
    due,
    total,
    resolver,
    tokenBalance,
    amounts,
    currentMilestoneAmount,
    releasedTxs,
    disputes,
    resolutions,
    isReleasable,
    isExpired,
    tokenMetadata,
    depositedMilestonesDisplay,
    depositedTxs,
    metadata,
    isLocked,
    dispute: latestDispute,
    resolution: latestResolution,
  } = _.pick(invoice, [
    'client',
    'provider',
    'deposited',
    'due',
    'total',
    'resolver',
    'releasedTxs',
    'released',
    'amounts',
    'currentMilestoneAmount',
    'isLocked',
    'token',
    'tokenBalance',
    'dispute',
    'disputes',
    'resolution',
    'resolutions',
    'isReleasable',
    'isExpired',
    'tokenMetadata',
    'depositedMilestonesDisplay',
    'depositedTxs',
    'metadata',
  ]);

  const details = [];
  if (deposited) {
    details.push({ label: 'Total Deposited', value: deposited });
  }
  if (released) {
    details.push({ label: 'Total Released', value: released });
  }
  if (due) {
    details.push({ label: 'Remaining Amount Due', value: due });
  }

  let nextAmount = 0n;
  if (currentMilestoneAmount) {
    nextAmount = isReleasable
      ? currentMilestoneAmount
      : currentMilestoneAmount - (tokenBalance?.value ?? 0n);
  }

  const disputesWithResolution = useMemo(
    () =>
      getDisputesWithResolution(
        disputes,
        resolutions,
        resolver,
        client,
        provider,
      ),
    [disputes, resolutions, resolver, client, provider],
  );

  const isValidConnection = isConnected && chainId === invoice?.chainId;

  const isDisputed = (!!latestDispute || !!latestResolution) ?? false;

  const isParty =
    _.toLower(address) === _.toLower(client) ||
    _.toLower(address) === _.toLower(provider);

  const canAddMilestones =
    !isDisputed && !isExpired && !isLocked && isParty && isValidConnection;

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {canAddMilestones && (
          <div className="flex justify-end">
            <button
              className="border border-input px-4 py-2 rounded-md hover:bg-accent uppercase"
              onClick={() => openModal(ModalTypes.ADD_MILESTONES)}
            >
              Add Milestone
            </button>
          </div>
        )}
        {deposited !== undefined && released !== undefined && (
          <div className="rounded-lg border bg-card p-6 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Escrow Balance</span>
              <span title="Current funds held in escrow (total deposited minus total released)">
                <QuestionIcon className="w-3 h-3 text-muted-foreground cursor-help" />
              </span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {commify(
                formatUnits(
                  deposited - released,
                  tokenBalance?.decimals || tokenMetadata?.decimals || 18,
                ),
              )}{' '}
              {tokenBalance?.symbol || tokenMetadata?.symbol}
            </span>
          </div>
        )}
        <div className="rounded-lg border bg-card py-6 flex flex-col w-full">
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-4 w-full px-6">
              <div className="flex items-center w-full justify-between">
                <h3 className="text-base font-semibold">
                  Total Project Amount
                </h3>
                {!!total && (
                  <h3 className="text-base font-semibold">
                    {commify(
                      formatUnits(
                        total,
                        tokenBalance?.decimals || tokenMetadata?.decimals || 18,
                      ),
                    )}{' '}
                    {tokenBalance?.symbol || tokenMetadata?.symbol}
                  </h3>
                )}
              </div>
              <div className="flex flex-col items-stretch gap-1">
                {_.map(amounts, (amt, index) => {
                  const depositedText = depositedMilestonesDisplay?.[index];
                  const release = releasedTxs?.[index];
                  const deposit = depositedTxs?.[index];
                  const milestoneMetadata = metadata?.milestones?.[index];
                  const title =
                    milestoneMetadata?.title ?? `Milestone ${index + 1}`;

                  return (
                    <div
                      key={title + index}
                      className="flex justify-between items-stretch"
                    >
                      <div className="flex items-center justify-start gap-2">
                        <p>{title}</p>
                        {milestoneMetadata?.description && (
                          <span title={milestoneMetadata?.description}>
                            <QuestionIcon className="w-3 h-3 text-muted-foreground" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        {release && (
                          <a
                            className="inline-flex items-center gap-1 text-xs text-emerald-400 italic hover:text-emerald-300 transition-colors"
                            href={getTxLink(invoice?.chainId, release.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View release transaction"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="8 12 12 8 16 12" />
                              <line x1="12" y1="16" x2="12" y2="8" />
                            </svg>
                            Released{' '}
                            {getDateString(
                              Number(release.timestamp) * 1000,
                              'short',
                            )}
                          </a>
                        )}
                        {deposit && !release && (
                          <a
                            className="inline-flex items-center gap-1 text-xs text-amber-400 italic hover:text-amber-300 transition-colors"
                            href={getTxLink(invoice?.chainId, deposit?.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View deposit transaction"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="8 12 12 16 16 12" />
                              <line x1="12" y1="8" x2="12" y2="16" />
                            </svg>
                            {`${_.capitalize(depositedText)} `}
                            {getDateString(
                              Number(deposit?.timestamp) * 1000,
                              'short',
                            )}
                          </a>
                        )}

                        <p className="text-right font-medium">
                          {`${commify(
                            formatUnits(
                              BigInt(amt),
                              tokenBalance?.decimals ||
                                tokenMetadata?.decimals ||
                                18,
                            ),
                          )} ${tokenBalance?.symbol || tokenMetadata?.symbol}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr className="border-border my-4" />
            {details && _.size(details) > 0 && (
              <>
                <div className="flex flex-col px-6">
                  {_.map(_.compact(details), (detail, index) => (
                    <div
                      className="flex items-center justify-between"
                      key={detail.label + index}
                    >
                      <p>{detail.label}</p>
                      <p>
                        {commify(
                          formatUnits(
                            detail.value,
                            tokenBalance?.decimals || 18,
                          ),
                        )}{' '}
                        {tokenBalance?.symbol}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-border my-4" />
              </>
            )}

            {_.size(disputes) === _.size(resolutions) && (
              <>
                <div className="flex justify-between items-center px-6">
                  {isExpired || (due === BigInt(0) && !isReleasable) ? (
                    <>
                      <h3 className="text-base font-semibold">
                        Remaining Balance
                      </h3>
                      <h3 className="text-base font-semibold">
                        {`${formatUnits(tokenBalance?.value ?? BigInt(0), tokenBalance?.decimals ?? 18)} ${tokenBalance?.symbol}`}
                      </h3>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-semibold">
                        {isReleasable
                          ? 'Next Amount to Release'
                          : 'Total Due Today'}
                      </h3>
                      <h3 className="text-base font-semibold">
                        {`${commify(
                          formatUnits(nextAmount, tokenBalance?.decimals ?? 18),
                        )} ${tokenBalance?.symbol}`}
                      </h3>
                    </>
                  )}
                </div>
                {_.size(disputes) > 0 && <hr className="border-border my-4" />}
              </>
            )}

            {_.map(
              disputesWithResolution,
              ({ dispute, resolution, resolutionDetails }, i) => (
                <div
                  className="flex flex-col gap-4 w-full"
                  key={dispute.id + i}
                >
                  {dispute && !resolution && (
                    <div className="flex flex-col px-6">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <p>
                          Dispute Raised on {getDateString(dispute.timestamp)}
                        </p>
                        <p className="text-right">
                          {`${formatUnits(tokenBalance?.value ?? BigInt(0), tokenBalance?.decimals ?? 18)} ${tokenBalance?.symbol}`}
                        </p>
                      </div>
                      <p className="text-foreground">
                        {`A dispute is in progress with `}
                        <AccountLink
                          address={resolver as Hex}
                          chainId={invoice?.chainId}
                        />
                        <br />
                        {!isEmptyIpfsHash(dispute.ipfsHash) && (
                          <>
                            <a
                              href={getIpfsLink(dispute.ipfsHash)}
                              className="text-primary"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <u>View dispute details</u>
                            </a>
                            <br />
                          </>
                        )}
                        <a
                          href={getTxLink(invoice?.chainId, dispute.txHash)}
                          className="text-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <u>View transaction</u>
                        </a>
                      </p>
                    </div>
                  )}

                  {resolution && (
                    <div className="flex flex-col items-stretch gap-4 text-muted-foreground px-6">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <p>
                          Dispute Resolved on{' '}
                          {getDateString(resolution.timestamp)}
                        </p>
                        <p className="text-right">{`${formatUnits(
                          resolution.clientAward +
                            resolution.providerAward +
                            (resolution.resolutionFee ?? 0n),
                          18,
                        )} ${tokenBalance?.symbol}`}</p>
                      </div>
                      <div className="flex justify-between flex-col sm:flex-row">
                        <div className="flex flex-1">
                          <p className="max-w-[300px] text-primary">
                            <AccountLink
                              address={resolver as Hex}
                              chainId={invoice?.chainId}
                            />
                            {
                              ' has resolved the dispute and dispersed remaining funds'
                            }
                            <br />
                            <br />
                            {!isEmptyIpfsHash(dispute.ipfsHash) && (
                              <>
                                <a
                                  href={getIpfsLink(dispute.ipfsHash)}
                                  className="text-primary"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <u>View dispute details</u>
                                </a>
                                <br />
                              </>
                            )}
                            {!isEmptyIpfsHash(resolution.ipfsHash) && (
                              <>
                                <a
                                  href={getIpfsLink(resolution.ipfsHash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <u>View resolution details</u>
                                </a>
                                <br />
                              </>
                            )}
                            <a
                              href={getTxLink(
                                invoice?.chainId,
                                resolution.txHash,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <u>View transaction</u>
                            </a>
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                          {_.map(
                            _.compact(resolutionDetails),
                            (detail, index) => (
                              <p
                                className="text-right text-primary/70"
                                key={
                                  (detail.distributee ?? 'distributee') + index
                                }
                              >
                                {`${formatUnits(
                                  detail.amount ?? 0n,
                                  tokenMetadata?.decimals ?? 18,
                                )} ${tokenMetadata?.symbol} to `}
                                <AccountLink
                                  address={detail.distributee as Hex}
                                  chainId={invoice?.chainId}
                                />
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {i !== disputesWithResolution.length - 1 && (
                    <hr className="border-border my-4" />
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={modals?.addMilestones} onClose={closeModals}>
        <AddMilestones invoice={invoice} onClose={closeModals} />
      </Modal>
    </>
  );
}

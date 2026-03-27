import {
  InvoiceDetails,
  ModalTypes,
  OverlayContextType,
} from '@smartinvoicexyz/types';
import { Button, Modal } from '@smartinvoicexyz/ui';
import _ from 'lodash';
import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

import { DepositFunds } from './DepositFunds';
import { DepositTip } from './DepositTip';
import { LockFunds } from './LockFunds';
import { ReleaseFunds } from './ReleaseFunds';
import { ResolveFunds } from './ResolveFunds';
import { WithdrawFunds } from './WithdrawFunds';

type ButtonEnabled = {
  deposit: boolean;
  lock: boolean;
  release: boolean;
  resolve: boolean;
  withdraw: boolean;
  tip: boolean;
};

export function InvoiceButtonManager({
  invoice,
  modals,
  openModal,
  closeModals,
}: {
  invoice: Partial<InvoiceDetails> | undefined;
} & OverlayContextType) {
  const { address } = useAccount();
  const isConnected = !!address;
  const chainId = useChainId();

  const { buttonEnabled, numColumns } = useMemo(() => {
    const {
      client,
      provider,
      resolver,
      isReleasable: isInvoiceReleasable,
      isExpired: isInvoiceExpired,
      isLockable: isInvoiceLockable,
      isLocked: isInvoiceLocked,
      isWithdrawable: isInvoiceWithdrawable,
      dispute,
      resolution,
      due,
    } = _.pick(invoice, [
      'client',
      'provider',
      'resolver',
      'isReleasable',
      'isExpired',
      'isLockable',
      'isLocked',
      'isWithdrawable',
      'tokenBalance',
      'dispute',
      'resolution',
      'due',
    ]);

    const isProvider = _.toLower(address) === _.toLower(provider);
    const isClient = _.toLower(address) === _.toLower(client);
    const isResolver = _.toLower(address) === _.toLower(resolver);
    const isDisputed = (!!dispute || !!resolution) ?? false;
    const isLockable = isInvoiceLockable ?? false;
    const isLocked = isInvoiceLocked ?? false;
    const isReleasable = isInvoiceReleasable ?? false;
    const isWithdrawable = isInvoiceWithdrawable ?? false;
    const isExpired = isInvoiceExpired ?? false;
    const isFullPaid = due === BigInt(0);

    const bEnabled: ButtonEnabled = {
      deposit:
        (isClient || (!isProvider && !isResolver)) &&
        !isDisputed &&
        !isFullPaid,
      lock: (isProvider || isClient) && isLockable && !isDisputed,
      release: isReleasable && isClient && !isDisputed,
      resolve: isResolver && isLocked && isDisputed,
      withdraw: isClient && isWithdrawable && isExpired && !isDisputed,
      tip:
        (isClient || (!isProvider && !isResolver)) && !isDisputed && isFullPaid,
    };

    const nColumns = _.size(_.pickBy(bEnabled, value => value === true));

    return { buttonEnabled: bEnabled, numColumns: nColumns };
  }, [invoice, address]);

  if (!invoice || !isConnected || chainId !== invoice?.chainId) return null;

  return (
    <>
      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}
      >
        {buttonEnabled.resolve && (
          <Button
            className="uppercase"
            onClick={() => openModal(ModalTypes.RESOLVE)}
          >
            Resolve
          </Button>
        )}
        {buttonEnabled.lock && (
          <Button
            variant="destructive"
            className="uppercase"
            onClick={() => openModal(ModalTypes.LOCK)}
          >
            Raise Dispute
          </Button>
        )}
        {buttonEnabled.deposit && (
          <Button
            className="uppercase"
            onClick={() => openModal(ModalTypes.DEPOSIT)}
          >
            Deposit
          </Button>
        )}
        {buttonEnabled.tip && (
          <Button
            className="uppercase"
            onClick={() => openModal(ModalTypes.TIP)}
          >
            Tip
          </Button>
        )}
        {buttonEnabled.release && (
          <Button
            className="uppercase"
            onClick={() => openModal(ModalTypes.RELEASE)}
          >
            Release
          </Button>
        )}

        {buttonEnabled.withdraw && (
          <Button
            className="uppercase"
            onClick={() => openModal(ModalTypes.WITHDRAW)}
          >
            Withdraw
          </Button>
        )}
      </div>

      <Modal isOpen={modals?.lock} onClose={closeModals}>
        <LockFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.deposit} onClose={closeModals}>
        <DepositFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.release} onClose={closeModals}>
        <ReleaseFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.resolve} onClose={closeModals}>
        <ResolveFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.withdraw} onClose={closeModals}>
        <WithdrawFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.depositTip} onClose={closeModals}>
        <DepositTip invoice={invoice} onClose={closeModals} />
      </Modal>
    </>
  );
}

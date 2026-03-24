import {
  InvoiceDetails,
  ModalTypes,
  OverlayContextType,
} from '@smartinvoicexyz/types';
import { Modal } from '@smartinvoicexyz/ui';
import _ from 'lodash';
import { useAccount, useChainId } from 'wagmi';

import { DepositFunds } from './DepositFunds';
import { WithdrawFunds } from './WithdrawFunds';

export const InstantButtonManager: React.FC<
  { invoice: InvoiceDetails } & OverlayContextType
> = ({ invoice, modals, closeModals, openModal }) => {
  const { address } = useAccount();
  const isConnected = !!address;
  const chainId = useChainId();

  const { client, provider, tokenBalance, fulfilled } = _.pick(invoice, [
    'client',
    'provider',
    'total',
    'tokenBalance',
    'fulfilled',
    'amountFulfilled',
    'deadline',
    'deadlineLabel',
    'lateFee',
    'totalDue',
  ]);

  const isClient = _.toLower(address) === client;
  const isProvider = _.toLower(address) === provider;
  const isTippable = fulfilled;
  const isWithdrawable = tokenBalance?.value
    ? tokenBalance.value > BigInt(0)
    : false;

  if (!invoice || !isConnected || chainId !== invoice?.chainId) return null;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {isClient && (
          <div
            className="grid gap-4 w-full"
            style={{ gridTemplateColumns: isTippable ? '1fr 1fr' : '1fr' }}
          >
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase"
              onClick={() => openModal(ModalTypes.DEPOSIT)}
              disabled={fulfilled}
            >
              {fulfilled ? 'Paid' : 'Make Payment'}
            </button>
            {isTippable && (
              <button
                className="border border-input px-4 py-2 rounded-md hover:bg-accent uppercase"
                onClick={() => openModal(ModalTypes.DEPOSIT)}
              >
                Add Tip
              </button>
            )}
          </div>
        )}
        {isProvider && (
          <div className="grid grid-cols-1 gap-4 w-full">
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 uppercase"
              onClick={() => openModal(ModalTypes.WITHDRAW)}
              disabled={!isWithdrawable}
            >
              {tokenBalance?.value === BigInt(0) && fulfilled
                ? 'Received'
                : 'Receive'}
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={modals?.deposit} onClose={closeModals}>
        <DepositFunds invoice={invoice} onClose={closeModals} />
      </Modal>
      <Modal isOpen={modals?.withdraw} onClose={closeModals}>
        <WithdrawFunds invoice={invoice} onClose={closeModals} />
      </Modal>
    </>
  );
};

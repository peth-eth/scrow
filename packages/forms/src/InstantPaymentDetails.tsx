import { InvoiceDetails } from '@smartinvoicexyz/types';
import _ from 'lodash';
import { formatUnits } from 'viem';

export const InstantPaymentDetails: React.FC<{
  invoice: InvoiceDetails;
}> = ({ invoice }) => {
  const {
    total,
    tokenBalance,
    amountFulfilled,
    deadline,
    deadlineLabel,
    lateFee,
    totalDue,
  } = _.pick(invoice, [
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

  let due = BigInt(0);

  if (totalDue && amountFulfilled) {
    if (totalDue > amountFulfilled) {
      due = totalDue - amountFulfilled;
    } else {
      due = BigInt(0);
    }
  }

  return (
    <div className="rounded-lg border bg-card py-6 flex flex-col w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4 px-6">
          {total ? (
            <div className="flex justify-between items-center font-bold text-lg">
              <p>Amount</p>

              <p>{`${formatUnits(total, tokenBalance?.decimals || 18)} ${tokenBalance?.symbol}`}</p>
            </div>
          ) : null}

          {!!lateFee && (
            <div className="flex justify-between items-center font-bold text-lg">
              <div className="flex flex-col">
                <p>Late Fee</p>

                <p className="text-xs font-normal italic text-gray-500">
                  {deadline ? deadlineLabel : `Not applicable`}
                </p>
              </div>

              <p>{`${formatUnits(lateFee, tokenBalance?.decimals || 18)} ${tokenBalance?.symbol}`}</p>
            </div>
          )}

          <div className="flex justify-between items-center font-bold text-lg">
            <p>Deposited</p>

            <p>{`${formatUnits(
              amountFulfilled || BigInt(0),
              tokenBalance?.decimals || 18,
            )} ${tokenBalance?.symbol}`}</p>
          </div>
        </div>

        <hr className="border-border my-4" />

        <div className="flex justify-between items-center text-black font-bold text-lg px-6">
          <p>
            {amountFulfilled && amountFulfilled > BigInt(0)
              ? 'Remaining'
              : 'Total'}{' '}
            Due
          </p>
          <p className="text-right">{`${formatUnits(
            due,
            tokenBalance?.decimals || 18,
          )} ${tokenBalance?.symbol}`}</p>
        </div>
      </div>
    </div>
  );
};

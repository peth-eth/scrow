import { TokenBalance } from '@smartinvoicexyz/graphql';

export function TokenDescriptor({
  tokenBalance,
}: {
  tokenBalance: TokenBalance | undefined;
}) {
  if (!tokenBalance) return null;

  return (
    <div className="absolute right-0 top-0 flex items-center justify-center h-full w-14 text-yellow-400 pointer-events-none">
      {tokenBalance?.symbol}
    </div>
  );
}

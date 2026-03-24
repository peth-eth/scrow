import { getChainName } from '@smartinvoicexyz/utils';

export type NetworkBadgeProps = {
  chainId?: number;
};

export function NetworkBadge({ chainId }: NetworkBadgeProps) {
  const chainName = getChainName(chainId);
  return (
    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-primary/10 max-w-fit h-fit">
      {chainName}
    </span>
  );
}

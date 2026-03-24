import { Resolver } from '@smartinvoicexyz/constants';
import { getAccountString, getAddressLink } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { Address } from 'viem';
import { useChainId, useEnsAvatar, useEnsName } from 'wagmi';

import { AccountAvatar } from './AccountAvatar';
import { ChakraNextLink } from './ChakraNextLink';

export type AccountLinkProps = {
  name?: string;
  address: Address;
  chainId?: number;
  link?: string;
  resolverInfo?: Resolver;
};

export function AccountLink({
  name,
  address,
  chainId: inputChainId,
  link,
  resolverInfo,
}: AccountLinkProps) {
  const walletChainId = useChainId();
  const chainId = inputChainId || walletChainId;

  const { name: resolverName, logoUrl } = _.pick(resolverInfo, [
    'name',
    'logoUrl',
  ]);

  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
  });

  const text =
    name ?? resolverName ?? ensName ?? getAccountString(address) ?? '';
  const href = link ?? getAddressLink(chainId, address);

  return (
    <ChakraNextLink
      href={href}
      isExternal={!link}
      className="inline-flex items-center rounded-[5px] bg-card px-1 py-0.5 text-right font-bold hover:scale-105 hover:no-underline transition-transform"
    >
      <AccountAvatar
        address={address}
        customImage={logoUrl}
        ensImage={ensAvatar}
        size={18}
      />
      <span className="pl-1 text-sm">{text}</span>
    </ChakraNextLink>
  );
}

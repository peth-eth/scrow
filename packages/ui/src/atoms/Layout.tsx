import { isSupportedChainId } from '@smartinvoicexyz/constants';
import { parseChainId } from '@smartinvoicexyz/utils';
import { track } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/react';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';

import { Header } from '../molecules/Header';
import { SubgraphHealthAlert } from '../molecules/SubgraphHealthAlert';
import { ConnectWeb3 } from './ConnectWeb3';

export function Layout({ children }: PropsWithChildren) {
  const chainId = useChainId();
  const { address } = useAccount();
  const isConnected = !!address;

  useEffect(() => {
    track('ChainChanged', { chain: chainId ?? null });
  }, [chainId]);

  const {
    pathname,
    query: { chainId: _queryChainId },
  } = useRouter();

  const queryChainId = parseChainId(_queryChainId);

  const isOpenPath =
    pathname === '/' ||
    pathname === '/contracts' ||
    pathname === '/create' ||
    pathname === '/developers' ||
    pathname.startsWith('/invoice/') ||
    pathname.startsWith('/use-cases/');

  const isValidConnection = isConnected && isSupportedChainId(chainId);

  const isValid = isOpenPath || isValidConnection;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen overflow-x-hidden bg-background bg-cover text-foreground">
      <Header />
      <div className="flex-grow relative flex flex-col items-center justify-center w-full h-full">
        <SubgraphHealthAlert chainId={queryChainId} />
        {isValid ? children : <ConnectWeb3 />}
      </div>
      <Analytics />
    </div>
  );
}

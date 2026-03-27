import { useConnectModal } from '@rainbow-me/rainbowkit';
import { SUPPORTED_CHAINS } from '@smartinvoicexyz/constants';
import { useIsClient } from '@smartinvoicexyz/hooks';
import _ from 'lodash';
import { useAccount } from 'wagmi';

import { WalletFilledIcon } from '../icons/WalletFilledIcon';
import { Button } from './Button';
import { Container } from './Container';
import { Loader } from './Loader';

export function ConnectWeb3() {
  const { openConnectModal } = useConnectModal();
  const { address, isConnecting } = useAccount();
  const isConnected = !!address;
  const isClient = useIsClient();

  if (!isClient || isConnecting) {
    return (
      <Container>
        <Loader size="80" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col items-center rounded-2xl bg-card w-[calc(100%-2rem)] p-8 max-w-[27.5rem] mx-4">
        <div className="flex items-center justify-center rounded-full bg-primary p-4 text-white mb-4">
          <WalletFilledIcon style={{ width: '1.75rem', height: '1.75rem' }} />
        </div>

        {isClient && isConnected ? (
          <>
            <h2 className="text-2xl font-heading mb-4">Connect Wallet</h2>
            <p className="text-muted-foreground mb-4 text-center">
              {`Please switch to ${_.map(
                SUPPORTED_CHAINS,
                chain => chain.name,
              ).join(' or ')}`}
            </p>
          </>
        ) : (
          <h2 className="text-xl font-heading mb-4 max-w-[200px] text-center">
            To get started, connect your wallet
          </h2>
        )}

        {isClient && !isConnected && (
          <Button
            onClick={openConnectModal}
            className="px-12 py-2"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </div>
    </Container>
  );
}

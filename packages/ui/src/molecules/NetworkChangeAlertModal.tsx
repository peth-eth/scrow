import { OverlayContextType } from '@smartinvoicexyz/types';
import { getChainName } from '@smartinvoicexyz/utils';
import { useEffect } from 'react';
import { useChainId } from 'wagmi';

import { Button } from '../atoms/Button';

type NetworkChangeAlertModalProps = OverlayContextType;

export function NetworkChangeAlertModal({
  modals,
  closeModals,
}: NetworkChangeAlertModalProps) {
  const chainId = useChainId();

  useEffect(() => {
    if (modals.networkChange) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modals.networkChange]);

  if (!modals.networkChange) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModals}
    >
      <div
        className="relative bg-card rounded-lg max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center text-destructive font-semibold p-4 text-lg">
          Attention
        </div>

        <div className="bg-destructive/10 rounded-[5px] text-destructive m-1.5 p-4">
          <div>
            You are changing the network to <b>{getChainName(chainId)}</b>.
          </div>
          <hr className="border-t border-destructive/20 my-2.5" />
          <div>
            You must complete all invoice creation steps on the same chain.
            <br />
            If you have not yet input any information, you can continue.
            <br />
            Otherwise, please return to Step 1 and complete all steps on the
            same network.
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={closeModals}
          className="absolute top-2 right-2 p-1 text-muted-foreground"
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

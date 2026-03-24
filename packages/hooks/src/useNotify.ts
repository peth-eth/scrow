import { useCallback } from 'react';
import { useChainId } from 'wagmi';

export type NotificationEvent =
  | 'deposit'
  | 'release'
  | 'dispute'
  | 'resolution'
  | 'milestone_added'
  | 'withdraw';

type NotifyParams = {
  invoiceId: string;
  event: NotificationEvent;
  amount?: string;
  token?: string;
  from?: string;
  message?: string;
};

export const useNotify = () => {
  const chainId = useChainId();

  const notify = useCallback(
    async (params: NotifyParams) => {
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, chainId }),
        });
      } catch {
        // Notifications are best-effort — don't block the UI
      }
    },
    [chainId],
  );

  return { notify };
};

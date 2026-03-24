import { NotificationEvent } from '@smartinvoicexyz/types';
import { useCallback } from 'react';
import { useChainId } from 'wagmi';

export type { NotificationEvent };

type NotifyParams = {
  invoiceId: string;
  event: NotificationEvent;
  amount?: string;
  token?: string;
  from?: string;
  message?: string;
};

const NOTIFY_TIMEOUT_MS = 5000;

export const useNotify = () => {
  const chainId = useChainId();

  const notify = useCallback(
    async (params: NotifyParams) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), NOTIFY_TIMEOUT_MS);
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, chainId }),
          signal: controller.signal,
        });
      } catch {
        // Notifications are best-effort — don't block the UI
      } finally {
        clearTimeout(timeout);
      }
    },
    [chainId],
  );

  return { notify };
};

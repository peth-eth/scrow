import type { NextApiRequest, NextApiResponse } from 'next';

export type NotificationEvent =
  | 'deposit'
  | 'release'
  | 'dispute'
  | 'resolution'
  | 'milestone_added'
  | 'withdraw';

type NotifyRequest = {
  invoiceId: string;
  chainId: number;
  event: NotificationEvent;
  amount?: string;
  token?: string;
  from?: string;
  message?: string;
};

const EVENT_TEMPLATES: Record<NotificationEvent, (r: NotifyRequest) => string> =
  {
    deposit: r =>
      `💰 <b>Deposit Received</b>\n\nInvoice: <code>${r.invoiceId}</code>\nAmount: ${r.amount ?? '?'} ${r.token ?? ''}\nChain: ${r.chainId}`,
    release: r =>
      `✅ <b>Funds Released</b>\n\nInvoice: <code>${r.invoiceId}</code>\nAmount: ${r.amount ?? '?'} ${r.token ?? ''}\nFunds sent to provider.`,
    dispute: r =>
      `⚠️ <b>Dispute Raised</b>\n\nInvoice: <code>${r.invoiceId}</code>\nFunds are now locked. Arbitrator will review the case.`,
    resolution: r =>
      `⚖️ <b>Dispute Resolved</b>\n\nInvoice: <code>${r.invoiceId}</code>\n${r.message ?? 'Funds have been distributed.'}`,
    milestone_added: r =>
      `📋 <b>New Milestones Added</b>\n\nInvoice: <code>${r.invoiceId}</code>\n${r.message ?? 'Check the invoice for details.'}`,
    withdraw: r =>
      `🏦 <b>Funds Withdrawn</b>\n\nInvoice: <code>${r.invoiceId}</code>\nAmount: ${r.amount ?? '?'} ${r.token ?? ''}`,
  };

async function sendTelegram(text: string, chatId: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function sendFarcasterDC(
  recipientFid: number,
  message: string,
): Promise<boolean> {
  const apiKey = process.env.NEYNAR_API_KEY;
  const signerUuid = process.env.NEYNAR_SIGNER_UUID;
  if (!apiKey || !signerUuid || !recipientFid) return false;

  try {
    const res = await fetch(
      'https://api.neynar.com/v2/farcaster/cast/conversation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          signer_uuid: signerUuid,
          text: message,
          direct_cast_fid: recipientFid,
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiSecret = process.env.NOTIFY_API_SECRET;
  if (apiSecret && req.headers.authorization !== `Bearer ${apiSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body as NotifyRequest;
  if (!body.invoiceId || !body.event) {
    return res.status(400).json({ error: 'Missing invoiceId or event' });
  }

  const template = EVENT_TEMPLATES[body.event];
  if (!template) {
    return res.status(400).json({ error: 'Unknown event type' });
  }

  const text = template(body);
  const results: Record<string, boolean> = {};

  // Send to Telegram (strip HTML for plain text version)
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  if (telegramChatId) {
    results.telegram = await sendTelegram(text, telegramChatId);
  }

  // Send Farcaster DC if configured
  const farcasterFid = process.env.NOTIFY_FARCASTER_FID;
  if (farcasterFid) {
    const plainText = text.replace(/<[^>]*>/g, '');
    results.farcaster = await sendFarcasterDC(
      parseInt(farcasterFid),
      plainText,
    );
  }

  return res.status(200).json({ sent: results });
}

export default handler;

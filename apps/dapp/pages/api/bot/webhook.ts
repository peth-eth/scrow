import crypto from 'crypto';

import { BASE_URL } from '@smartinvoicexyz/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const BOT_SIGNER_UUID = process.env.NEYNAR_BOT_SIGNER_UUID || '';
const WEBHOOK_SECRET = process.env.NEYNAR_WEBHOOK_SECRET || '';

// ── Types ──────────────────────────────────────────────────

type NeynarCast = {
  hash: string;
  text: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
  };
  mentioned_profiles?: Array<{
    fid: number;
    username: string;
    custody_address?: string;
    verified_addresses?: { eth_addresses?: string[] };
  }>;
};

type WebhookPayload = {
  type: string;
  data: NeynarCast;
};

type ParsedIntent = {
  counterparty?: string;
  counterpartyAddress?: string;
  amount?: string;
  token?: string;
};

// ── Helpers ────────────────────────────────────────────────

function validateSignature(
  signature: string | undefined,
  body: string,
): boolean {
  if (!WEBHOOK_SECRET || !signature) return !WEBHOOK_SECRET;
  const hash = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return signature === hash;
}

async function replyCast(
  replyToHash: string,
  text: string,
): Promise<boolean> {
  if (!NEYNAR_API_KEY || !BOT_SIGNER_UUID) return false;
  try {
    const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        signer_uuid: BOT_SIGNER_UUID,
        text,
        parent: replyToHash,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolveAddress(
  username: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(username)}&limit=1`,
      { headers: { 'x-api-key': NEYNAR_API_KEY } },
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    const user = data.result?.users?.[0];
    if (!user) return undefined;
    return (
      user.verified_addresses?.eth_addresses?.[0] || user.custody_address
    );
  } catch {
    return undefined;
  }
}

// ── Intent Parser ──────────────────────────────────────────

const TOKEN_ALIASES: Record<string, string> = {
  usdc: 'USDC',
  usdt: 'USDT',
  dai: 'DAI',
  eth: 'ETH',
  weth: 'WETH',
  degen: 'DEGEN',
};

function parseIntent(cast: NeynarCast): ParsedIntent {
  const text = cast.text.toLowerCase();
  const result: ParsedIntent = {};

  // Find mentioned counterparty (first non-bot mention)
  const mentions = cast.mentioned_profiles?.filter(
    p => p.username !== 'scrow',
  );
  if (mentions?.length) {
    const counterparty = mentions[0];
    result.counterparty = counterparty.username;
    result.counterpartyAddress =
      counterparty.verified_addresses?.eth_addresses?.[0] ||
      (counterparty.custody_address ?? undefined);
  }

  // Extract amount + token: "500 USDC", "$500", "0.5 ETH"
  const amountTokenMatch = text.match(
    /\$?([\d,]+(?:\.\d+)?)\s*(usdc|usdt|dai|eth|weth|degen)?/i,
  );
  if (amountTokenMatch) {
    result.amount = amountTokenMatch[1].replace(/,/g, '');
    const tokenRaw = amountTokenMatch[2]?.toLowerCase();
    if (tokenRaw && TOKEN_ALIASES[tokenRaw]) {
      result.token = TOKEN_ALIASES[tokenRaw];
    }
  }

  // Also check for "for X token" pattern
  const forTokenMatch = text.match(
    /for\s+([\d,]+(?:\.\d+)?)\s+(usdc|usdt|dai|eth|weth|degen)/i,
  );
  if (forTokenMatch) {
    result.amount = forTokenMatch[1].replace(/,/g, '');
    const tokenRaw = forTokenMatch[2].toLowerCase();
    result.token = TOKEN_ALIASES[tokenRaw] || forTokenMatch[2].toUpperCase();
  }

  return result;
}

// ── Build Response ─────────────────────────────────────────

function buildCreateLink(intent: ParsedIntent): string {
  const params = new URLSearchParams();
  if (intent.counterpartyAddress) {
    params.set('client', intent.counterpartyAddress);
  }
  if (intent.amount) params.set('amount', intent.amount);
  if (intent.token) params.set('token', intent.token);

  const qs = params.toString();
  return `${BASE_URL}/create${qs ? `?${qs}` : ''}`;
}

function buildReply(cast: NeynarCast, intent: ParsedIntent): string {
  const hasDetails = intent.counterparty || intent.amount;
  const link = buildCreateLink(intent);

  if (!hasDetails) {
    return [
      `Hey @${cast.author.username}! Ready to create a contract?`,
      '',
      `Create one here: ${link}`,
      '',
      'Or mention me with details:',
      '@scrow create contract with @user for 500 USDC',
    ].join('\n');
  }

  const parts = [`Contract ready for @${cast.author.username}:`];

  if (intent.counterparty) {
    parts.push(`Counterparty: @${intent.counterparty}`);
  }
  if (intent.amount) {
    parts.push(
      `Amount: ${intent.amount}${intent.token ? ` ${intent.token}` : ''}`,
    );
  }

  parts.push('');
  parts.push(`Create it here: ${link}`);

  return parts.join('\n');
}

// ── Webhook Handler ────────────────────────────────────────

const processedCasts = new Set<string>();

async function processMention(cast: NeynarCast): Promise<void> {
  // Idempotency
  if (processedCasts.has(cast.hash)) return;
  processedCasts.add(cast.hash);

  // Cap the in-memory set at 1000
  if (processedCasts.size > 1000) {
    const first = processedCasts.values().next().value;
    if (first) processedCasts.delete(first);
  }

  const intent = parseIntent(cast);

  // If counterparty mentioned but no address, try to resolve
  if (intent.counterparty && !intent.counterpartyAddress) {
    const addr = await resolveAddress(intent.counterparty);
    if (addr) intent.counterpartyAddress = addr;
  }

  const reply = buildReply(cast, intent);
  await replyCast(cast.hash, reply);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate webhook signature
  const signature = req.headers['x-neynar-signature'] as string | undefined;
  const rawBody =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (!validateSignature(signature, rawBody)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = req.body as WebhookPayload;

  // Only process cast.created events
  if (payload.type !== 'cast.created' || !payload.data?.hash) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Process async — don't block the webhook response
  processMention(payload.data).catch(err => {
    // eslint-disable-next-line no-console
    console.error('[scrow-bot] Error processing mention:', err);
  });

  return res.status(200).json({ ok: true });
}

import { FarcasterUser } from '@smartinvoicexyz/types';
import type { NextApiRequest, NextApiResponse } from 'next';

import { withCors } from '../../utils/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.length < 1) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NEYNAR_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(q)}&limit=5`,
      { headers: { 'x-api-key': apiKey } },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Neynar API request failed' });
    }

    const data = await response.json();

    const users: FarcasterUser[] = (data.result?.users ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (u: any) => ({
        fid: u.fid,
        username: u.username,
        display_name: u.display_name,
        pfp_url: u.pfp_url,
        eth_addresses: u.verified_addresses?.eth_addresses ?? [],
        primary_eth_address: u.verified_addresses?.primary?.eth_address ?? null,
      }),
    );

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Neynar search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withCors()(handler);

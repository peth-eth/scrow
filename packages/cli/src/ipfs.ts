import { type Hex } from 'viem';

const PINATA_API = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
const DAPP_URL =
  process.env.SCROW_DAPP_URL || 'https://scrow-pi.vercel.app';

// Base58 alphabet for CID conversion
const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Decode(str: string): Uint8Array {
  const bytes: number[] = [0];
  for (const char of str) {
    const carry = BASE58_ALPHABET.indexOf(char);
    if (carry < 0) throw new Error(`Invalid base58 character: ${char}`);
    for (let j = 0; j < bytes.length; j++) {
      bytes[j] = bytes[j] * 58 + carry;
      carry === 0; // consumed
    }
    // Normalize
    for (let j = 0; j < bytes.length; j++) {
      if (bytes[j] > 255) {
        if (j + 1 >= bytes.length) bytes.push(0);
        bytes[j + 1] += (bytes[j] >> 8);
        bytes[j] &= 0xff;
      }
    }
  }
  // Leading zeros
  let leadingZeros = 0;
  for (const char of str) {
    if (char === '1') leadingZeros++;
    else break;
  }
  const result = new Uint8Array(leadingZeros + bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    result[leadingZeros + bytes.length - 1 - i] = bytes[i];
  }
  return result;
}

export function cidToBytes32(cid: string): Hex {
  const decoded = base58Decode(cid);
  // Skip the first 2 bytes (multihash prefix: 0x12 0x20)
  const hex = Array.from(decoded.slice(2))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `0x${hex}`;
}

async function getPinataToken(): Promise<string> {
  const res = await fetch(`${DAPP_URL}/api/upload-start`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to get Pinata token: ${res.status}`);
  const data = await res.json();
  return data.jwt || data.token;
}

export type InvoiceMetadata = {
  title: string;
  description?: string;
  milestones: { title: string; amount: string }[];
};

export async function pinMetadata(metadata: InvoiceMetadata): Promise<{
  cid: string;
  bytes32: Hex;
}> {
  const token = await getPinataToken();
  const now = Math.floor(Date.now() / 1000);
  const version = 'smart-invoice-v0.1.0';

  const content = {
    version,
    id: `${metadata.title}-${now}-${version}`,
    title: metadata.title,
    description: metadata.description || '',
    documents: [],
    startDate: now,
    endDate: now + 90 * 24 * 60 * 60, // 90 days
    createdAt: now,
    milestones: metadata.milestones.map((m, i) => ({
      id: `milestone-${metadata.title}-${i}-${now}-${version}`,
      title: m.title,
      description: '',
      createdAt: now,
    })),
    resolverType: 'smart-invoice',
  };

  const res = await fetch(PINATA_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pinataOptions: { cidVersion: 0 },
      pinataMetadata: { name: `${metadata.title} - ${now} - ${version}` },
      pinataContent: content,
    }),
  });

  if (!res.ok) throw new Error(`IPFS pinning failed: ${res.status}`);
  const data = await res.json();
  const cid: string = data.IpfsHash;

  return { cid, bytes32: cidToBytes32(cid) };
}

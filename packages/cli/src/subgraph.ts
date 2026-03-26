import { SUBGRAPH_URL } from './config.js';

export type InvoiceData = {
  id: string;
  token: string;
  client: string;
  provider: string;
  resolver: string;
  amounts: string[];
  released: string;
  total: string;
  isLocked: boolean;
  currentMilestone: string;
  terminationTime: string;
  details: string;
  deposits: { sender: string; amount: string; timestamp: string }[];
  releases: { milestone: string; amount: string; timestamp: string }[];
};

const INVOICE_QUERY = `
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      id
      token
      client
      provider
      resolver
      amounts
      released
      total
      isLocked
      currentMilestone
      terminationTime
      details
      deposits(orderBy: timestamp, orderDirection: desc) {
        sender
        amount
        timestamp
      }
      releases(orderBy: timestamp, orderDirection: desc) {
        milestone
        amount
        timestamp
      }
    }
  }
`;

const INVOICES_BY_ADDRESS_QUERY = `
  query GetInvoices($address: String!) {
    invoices(
      where: { or: [{ client: $address }, { provider: $address }] }
      orderBy: createdAt
      orderDirection: desc
      first: 20
    ) {
      id
      token
      client
      provider
      amounts
      released
      total
      isLocked
      currentMilestone
    }
  }
`;

export async function fetchInvoice(
  address: string,
): Promise<InvoiceData | null> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: INVOICE_QUERY,
      variables: { id: address.toLowerCase() },
    }),
  });
  const json = await res.json();
  return json.data?.invoice ?? null;
}

export async function fetchInvoicesByAddress(
  address: string,
): Promise<InvoiceData[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: INVOICES_BY_ADDRESS_QUERY,
      variables: { address: address.toLowerCase() },
    }),
  });
  const json = await res.json();
  return json.data?.invoices ?? [];
}

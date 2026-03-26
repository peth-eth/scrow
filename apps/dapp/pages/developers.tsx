import { Container } from '@smartinvoicexyz/ui';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { Button } from '../components/ui/button';

const QUERY_PARAMS = [
  { param: 'client', description: 'Ethereum address of the counterparty' },
  { param: 'amount', description: 'Payment amount (human-readable, e.g. 500)' },
  { param: 'token', description: 'Token symbol: USDC, USDT, DAI, ETH, WETH' },
];

const SUBGRAPH_FIELDS = [
  { field: 'id', description: 'Contract address' },
  { field: 'token', description: 'Payment token address' },
  { field: 'client', description: 'Client wallet address' },
  { field: 'provider', description: 'Provider wallet address' },
  { field: 'resolver', description: 'Arbitrator address' },
  { field: 'amounts', description: 'Milestone amounts array' },
  { field: 'released', description: 'Total released so far' },
  { field: 'isLocked', description: 'Whether the contract is in dispute' },
  { field: 'terminationTime', description: 'Safety valve withdrawal date' },
];

export default function Developers() {
  return (
    <Container>
      <Head>
        <title>Developers & Agents — sCrow</title>
        <meta
          name="description"
          content="Integrate sCrow crypto escrow into your app or AI agent. Query param API, GraphQL subgraph, and smart contract addresses on Base."
        />
        <meta property="og:title" content="Developers & Agents — sCrow" />
        <link rel="canonical" href="https://scrow-pi.vercel.app/developers" />
      </Head>
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {' / '}
          <span className="text-foreground">Developers & Agents</span>
        </nav>

        <h1 className="text-2xl font-bold text-foreground md:text-4xl">
          How do agents and apps create escrow contracts on sCrow?
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          sCrow is a crypto escrow platform on Base. Any software that can open
          a URL or query a GraphQL endpoint can create and monitor escrow
          contracts. There is no API key, no account registration, and no rate
          limiting on reads. Contract creation requires a wallet transaction on
          Base. Reading contract state is free and permissionless via the
          subgraph.
        </p>

        {/* Create via URL */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Create contracts via URL parameters
          </h2>
          <p className="mb-4 text-muted-foreground">
            Pre-fill the contract creation form by passing query parameters to{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
              /create
            </code>
            . This is how the Farcaster bot and other integrations work.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    Parameter
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {QUERY_PARAMS.map(({ param, description }) => (
                  <tr key={param} className="border-b border-border">
                    <td className="px-4 py-2 font-mono text-primary">
                      {param}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Example: /create?client=0xABC...&amount=500&token=USDC
          </p>
        </section>

        {/* Subgraph */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Read contract state via GraphQL
          </h2>
          <p className="mb-4 text-muted-foreground">
            Every sCrow contract is indexed by a subgraph on Base. Query it to
            check balances, milestone progress, dispute status, and participant
            addresses. No authentication required.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    Field
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {SUBGRAPH_FIELDS.map(({ field, description }) => (
                  <tr key={field} className="border-b border-border">
                    <td className="px-4 py-2 font-mono text-primary">
                      {field}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Smart Contracts */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Smart contracts
          </h2>
          <p className="text-muted-foreground">
            sCrow runs on Base. Contract addresses and ABIs are listed on the{' '}
            <Link href="/contracts" className="text-primary hover:underline">
              Contracts page
            </Link>
            . The factory contract creates new escrow instances. Each escrow is
            its own contract with its own address and state.
          </p>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Notifications API
          </h2>
          <p className="text-muted-foreground">
            POST to{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
              /api/notify
            </code>{' '}
            to send notifications on contract events (deposit, release, dispute,
            resolution, withdraw). Supports Telegram and Farcaster DM channels.
          </p>
        </section>

        {/* Farcaster Bot */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Farcaster bot
          </h2>
          <p className="text-muted-foreground">
            Mention @scrow on Farcaster to create a contract from a cast. The
            bot parses the counterparty, amount, and token from your message and
            replies with a pre-filled contract link. Supported tokens: USDC,
            USDT, DAI, ETH, WETH, DEGEN.
          </p>
        </section>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <Link href="/create">
            <Button size="lg" className="min-w-[250px] py-6">
              Try creating a contract
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export const getStaticProps = async () => ({ props: {} });

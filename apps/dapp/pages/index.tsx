import { Container } from '@smartinvoicexyz/ui';
import Link from 'next/link';
import React from 'react';

import { Button } from '../components/ui/button';

const STEPS = [
  {
    number: '1',
    title: 'Create a Contract',
    description:
      'Define milestones, choose an arbitrator, and send the link. Takes 2 minutes.',
  },
  {
    number: '2',
    title: 'Funds Lock in Escrow',
    description:
      'Your counterparty deposits into a smart contract. Nobody touches the funds until milestones are met.',
  },
  {
    number: '3',
    title: 'Deliver & Get Paid',
    description:
      'Funds release per milestone. Dispute? Your chosen arbitrator resolves it onchain.',
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-lg font-bold text-white">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Home() {
  return (
    <Container overlay>
      <div className="flex w-full max-w-[800px] flex-col items-center gap-16 px-4 py-12">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
            Escrow contracts for people and agents
          </p>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Stop sending crypto on a promise.
          </h1>
          <p className="max-w-[620px] text-lg text-muted-foreground md:text-xl">
            sCrow locks funds in a smart contract until the work is done.
            Milestone payments, onchain arbitration, and a downloadable
            contract PDF &mdash; all on Base.
          </p>
          <p className="max-w-[520px] text-base italic text-muted-foreground/70">
            No more chasing payments. No more &ldquo;trust me&rdquo; handshakes.
            Just code that holds both sides accountable.
          </p>
        </div>

        {/* How It Works */}
        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-xl font-semibold uppercase text-muted-foreground">
            How It Works
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map(step => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>

        {/* Fee Transparency */}
        <div className="w-full rounded-lg bg-muted px-6 py-4 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            1% platform fee on releases &middot; 5% arbitration fee only if
            disputed
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <Link href="/create">
            <Button size="lg" className="min-w-[250px] py-6">
              Create a Contract
            </Button>
          </Link>
          <Link href="/invoices">
            <Button size="lg" variant="outline" className="min-w-[250px] py-6">
              View Your Contracts
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export const getServerSideProps = async () => ({ props: {} });

export default Home;

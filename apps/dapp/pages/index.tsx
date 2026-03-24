import { Container } from '@smartinvoicexyz/ui';
import Link from 'next/link';
import React from 'react';

import { Button } from '../components/ui/button';

const STEPS = [
  {
    number: '1',
    title: 'Create Invoice',
    description:
      'Set milestones, pick an arbitrator, and share with your client.',
  },
  {
    number: '2',
    title: 'Client Deposits',
    description: 'Funds are locked in escrow until milestones are completed.',
  },
  {
    number: '3',
    title: 'Get Paid',
    description:
      'Release funds as you deliver. Disputes? Your arbitrator has it covered.',
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
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-lg font-bold text-white">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
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
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold leading-tight text-gray-700 md:text-4xl">
            Secure Escrow for Web3 Freelancers
          </h1>
          <p className="max-w-[560px] text-base text-muted-foreground md:text-lg">
            Get paid safely with milestone-based escrow, community arbitration,
            and transparent fees.
          </p>
        </div>

        {/* How It Works */}
        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-xl font-semibold uppercase text-gray-600">
            How It Works
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map(step => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>

        {/* Fee Transparency */}
        <div className="w-full rounded-lg bg-gray-50 px-6 py-4 text-center">
          <p className="font-mono text-sm text-gray-600">
            1% platform fee on releases &middot; 5% arbitration fee only if
            disputed
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <Link href="/create">
            <Button size="lg" className="min-w-[250px] py-6">
              Create Invoice
            </Button>
          </Link>
          <Link href="/invoices">
            <Button size="lg" variant="outline" className="min-w-[250px] py-6">
              View Existing Invoices
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export const getServerSideProps = async () => ({ props: {} });

export default Home;

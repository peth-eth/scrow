import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { type UseCase } from '../data/use-cases';
import { Button } from './ui/button';

export function UseCasePage({ useCase }: { useCase: UseCase }) {
  return (
    <>
      <Head>
        <title>{`${useCase.title} — sCrow`}</title>
        <meta name="description" content={useCase.metaDescription} />
        <meta property="og:title" content={`${useCase.title} — sCrow`} />
        <meta property="og:description" content={useCase.metaDescription} />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href={`https://scrow-pi.vercel.app/use-cases/${useCase.slug}`}
        />
      </Head>
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {' / '}
          <span className="text-foreground">{useCase.title}</span>
        </nav>

        {/* Hero */}
        <h1 className="text-2xl font-bold leading-tight text-foreground md:text-4xl">
          {useCase.heroQuestion}
        </h1>

        {/* Definition — GEO-optimized citable passage */}
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          {useCase.definition}
        </p>

        {/* How It Works */}
        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            How it works with sCrow
          </h2>
          <ol className="flex flex-col gap-4">
            {useCase.howItWorks.map((item, i) => (
              <li key={item.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{item.step}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Scenarios */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            When to use this
          </h2>
          <ul className="flex flex-col gap-2">
            {useCase.scenarios.map(s => (
              <li
                key={s}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Fee bar */}
        <div className="rounded-lg bg-muted px-6 py-4 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            1% platform fee on releases &middot; 5% arbitration fee only if
            disputed
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/create">
            <Button size="lg" className="min-w-[250px] py-6">
              {useCase.ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

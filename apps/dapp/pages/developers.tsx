import { Container } from '@smartinvoicexyz/ui';
import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback } from 'react';

const CREATE_SNIPPET = `scrow create \\
  --client 0xCLIENT_ADDRESS \\
  --provider 0xPROVIDER_ADDRESS \\
  --token USDC \\
  --milestones 500,300,200 \\
  --title "Project Name"`;

const SUBGRAPH_SNIPPET = `curl -s -X POST \\
  'https://api.goldsky.com/api/public/project_cm39qflfrtz7e01xibgnuczby/subgraphs/smart-invoice-base/latest/gn' \\
  -H 'Content-Type: application/json' \\
  -d '{"query": "{ invoice(id: \\"0xCONTRACT\\") { amounts released isLocked currentMilestone } }"}'`;

function CopyBlock({ code, label }: { code: string; label: string }) {
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  return (
    <div className="group relative">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <pre className="overflow-x-auto rounded-lg border border-border bg-[#0a0a0a] p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        {code}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-8 rounded bg-muted px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        Copy
      </button>
    </div>
  );
}

export default function Developers() {
  return (
    <Container>
      <Head>
        <title>For Agents — sCrow</title>
        <meta
          name="description"
          content="Give your AI agent crypto escrow. CLI outputs unsigned transactions. Subgraph reads are free. No API key."
        />
        <link rel="canonical" href="https://scrow-pi.vercel.app/developers" />
      </Head>
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {' / '}
          <span className="text-foreground">For Agents</span>
        </nav>

        <div>
          <h1 className="mb-3 text-2xl font-bold text-foreground md:text-4xl">
            Give your agent escrow.
          </h1>
          <p className="text-muted-foreground">
            sCrow outputs unsigned transactions your agent signs with its own
            wallet. Reads are free. No API key. No account.
          </p>
        </div>

        {/* Quick start */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground">Quick start</h2>
          <CopyBlock label="Create a contract" code={CREATE_SNIPPET} />
          <p className="text-xs text-muted-foreground">
            Returns unsigned tx JSON to stdout. Your agent signs and broadcasts
            with its own wallet (cast, ethers, viem, etc).
          </p>
          <CopyBlock label="Check contract status" code={SUBGRAPH_SNIPPET} />
          <p className="text-xs text-muted-foreground">
            Free GraphQL reads. No auth. Replace 0xCONTRACT with the escrow
            address.
          </p>
        </section>

        {/* Commands */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            CLI commands
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['scrow create', 'Build a new escrow contract tx'],
                  ['scrow deposit', 'Build a deposit tx (ETH or ERC-20)'],
                  ['scrow release', 'Build a milestone release tx'],
                  ['scrow status <addr>', 'View contract details (free)'],
                  ['scrow list <wallet>', 'List contracts for a wallet (free)'],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-border">
                    <td className="px-4 py-2 font-mono text-xs text-primary">
                      {cmd}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Write commands output unsigned tx JSON. Read commands return data
            directly. Source:{' '}
            <a
              href="https://github.com/peth-eth/scrow/tree/develop/packages/cli"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              packages/cli
            </a>
          </p>
        </section>

        {/* URL params */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Web integration
          </h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Pre-fill the creation form via URL:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-[#0a0a0a] p-3 font-mono text-xs text-muted-foreground">
            /create?client=0x...&amp;amount=500&amp;token=USDC
          </pre>
        </section>

        {/* Links */}
        <section className="flex flex-col gap-1 text-sm text-muted-foreground">
          <Link href="/contracts" className="text-primary hover:underline">
            Contract addresses & ABIs on Base
          </Link>
          <a
            href="https://scrow-pi.vercel.app/llms.txt"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            llms.txt
          </a>
        </section>
      </div>
    </Container>
  );
}

export const getStaticProps = async () => ({ props: {} });

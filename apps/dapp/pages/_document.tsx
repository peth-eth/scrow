import { BASE_URL } from '@smartinvoicexyz/constants';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'sCrow',
  description:
    'Crypto escrow contracts with milestone payments and onchain arbitration on Base. 1% platform fee. No account required.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description:
      '1% platform fee on release, 5% arbitration fee on disputes only',
  },
  featureList: [
    'Milestone-based escrow payments',
    'Onchain arbitration',
    'Downloadable contract PDF',
    'AI agent integration via query parameters',
    'GraphQL subgraph for reading contract state',
    'Farcaster bot for contract creation',
  ],
  sameAs: ['https://github.com/peth-eth/scrow', 'https://warpcast.com/scrow'],
};

const m = {
  title: 'sCrow',
  type: 'website',
  description:
    'sCrow — escrow contracts for people and agents. Milestone payments and arbitration on Base.',
  version: 'next',
  url: BASE_URL,
  imageUrl: `${BASE_URL}/scrow-logo.png`,
  button: {
    title: 'sCrow',
    action: {
      type: 'launch_frame',
      name: 'sCrow',
      url: BASE_URL,
      splashImageUrl: `${BASE_URL}/scrow-logo.png`,
      iconUrl: `${BASE_URL}/scrow-logo.png`,
      splashBackgroundColor: '#7c5bbf',
    },
  },
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="fc:frame" content={JSON.stringify(m)} />
          <meta name="fc:miniapp" content={JSON.stringify(m)} />
          <meta name="base:app_id" content="6977498c88e3bac59cf3d980" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

import { BASE_URL } from '@smartinvoicexyz/constants';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const m = {
  title: 'sCrow',
  type: 'website',
  description:
    'sCrow — secure escrow for web3 freelancers with cryptocurrency invoicing and arbitration.',
  version: 'next',
  url: BASE_URL,
  imageUrl: `${BASE_URL}/si-banner.png`,
  button: {
    title: 'sCrow',
    action: {
      type: 'launch_frame',
      name: 'sCrow',
      url: BASE_URL,
      splashImageUrl: `${BASE_URL}/favicon-32x32.png`,
      splashBackgroundColor: '#ffffff',
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/* eslint-disable react/jsx-props-no-spreading */
import 'focus-visible/dist/focus-visible';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AccountAvatar, ErrorBoundary, Layout } from '@smartinvoicexyz/ui';
import { wagmiConfig } from '@smartinvoicexyz/utils';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hashFn } from '@wagmi/core/query';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { WagmiProvider } from 'wagmi';

import { FrameProvider } from '../contexts/FrameContext';
import { OverlayContextProvider } from '../contexts/OverlayContext';

function AppInner({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryKeyHashFn: hashFn,
            staleTime: 300000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <RainbowKitProvider avatar={AccountAvatar}>
              <ErrorBoundary>
                <FrameProvider>
                  <OverlayContextProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </OverlayContextProvider>
                </FrameProvider>
              </ErrorBoundary>
              <Toaster position="bottom-right" richColors />
              <ReactQueryDevtools initialIsOpen={false} />
            </RainbowKitProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

// Prevent SSR for the entire app shell — wagmi/rainbowkit require browser APIs
const App = dynamic(() => Promise.resolve(AppInner), { ssr: false });

export default App;

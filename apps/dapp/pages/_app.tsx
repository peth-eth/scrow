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
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { WagmiProvider } from 'wagmi';

import { FrameProvider } from '../contexts/FrameContext';
import { OverlayContextProvider } from '../contexts/OverlayContext';

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#101010',
          color: '#f5f5f5',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #8A63D2',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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

export default App;

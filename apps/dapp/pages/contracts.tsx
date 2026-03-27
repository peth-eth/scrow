import { SUPPORTED_CHAIN_IDS } from '@smartinvoicexyz/constants';
import { useFetchTokens } from '@smartinvoicexyz/hooks';
import { IToken } from '@smartinvoicexyz/types';
import { Container } from '@smartinvoicexyz/ui';
import {
  chainById,
  getAccountString,
  getAddressLink,
  getInvoiceFactoryAddress,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import React from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

function Contracts() {
  const { data: tokens } = useFetchTokens();

  if (!tokens) {
    return (
      <Container>
        <div className="flex flex-col items-center gap-4 py-20">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"
            role="status"
            aria-label="Loading"
          />
          <p className="text-muted-foreground text-sm">
            Loading contract information...
          </p>
        </div>
      </Container>
    );
  }

  const chainIds = SUPPORTED_CHAIN_IDS as readonly number[];

  return (
    <Container overlay>
      <div className="my-10 flex min-h-[800px] flex-col gap-4">
        <h1 className="text-center text-2xl font-bold uppercase text-primary">
          Contracts
        </h1>

        <Tabs defaultValue={String(chainIds[0])}>
          <TabsList>
            {_.map(chainIds, chainId => (
              <TabsTrigger key={chainId} value={String(chainId)}>
                {chainById(chainId)?.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {_.map(chainIds, chainId => {
            const INVOICE_FACTORY = getInvoiceFactoryAddress(chainId) || '0x';
            const TOKENS: IToken[] = _.filter(
              tokens,
              // eslint-disable-next-line eqeqeq
              (token: IToken) => token.chainId == chainId,
            );
            return (
              <TabsContent key={chainId} value={String(chainId)}>
                <div className="flex flex-col gap-1">
                  <p className="text-center">
                    INVOICE FACTORY:{' '}
                    <a
                      href={getAddressLink(chainId, INVOICE_FACTORY)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      <span className="md:hidden">
                        {getAccountString(INVOICE_FACTORY)}
                      </span>
                      <span className="hidden md:inline">
                        {INVOICE_FACTORY}
                      </span>
                    </a>
                  </p>

                  {TOKENS?.map(token => (
                    <p
                      className="text-center"
                      key={token.chainId.toString() + token.address}
                    >
                      {token.symbol}
                      {': '}
                      <a
                        href={getAddressLink(chainId, token.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        <span className="md:hidden">
                          {getAccountString(token.address)}
                        </span>
                        <span className="hidden md:inline">
                          {token.address}
                        </span>
                      </a>
                    </p>
                  ))}
                  <br />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Container>
  );
}

export default Contracts;

export const getServerSideProps = async () => ({ props: {} });

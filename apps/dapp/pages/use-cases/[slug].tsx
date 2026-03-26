import { Container } from '@smartinvoicexyz/ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';

import { UseCasePage } from '../../components/UseCasePage';
import {
  getAllUseCaseSlugs,
  getUseCaseBySlug,
  type UseCase,
} from '../../data/use-cases';

export default function UseCaseRoute({ useCase }: { useCase: UseCase }) {
  return (
    <Container>
      <UseCasePage useCase={useCase} />
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: getAllUseCaseSlugs().map(slug => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = ({ params }) => {
  const useCase = getUseCaseBySlug(params?.slug as string);
  if (!useCase) return { notFound: true };
  return { props: { useCase } };
};

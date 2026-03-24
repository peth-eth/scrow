import { InvoiceDashboardTable } from '@smartinvoicexyz/ui';
import { GetServerSideProps } from 'next';

function Invoices() {
  return <InvoiceDashboardTable />;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Invoices;

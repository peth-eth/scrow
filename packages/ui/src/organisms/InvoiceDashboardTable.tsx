import { InvoiceDisplayData } from '@smartinvoicexyz/graphql';
import { useInvoices, useIpfsDetails } from '@smartinvoicexyz/hooks';
import { getAccountString, getChainName } from '@smartinvoicexyz/utils';
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { ChakraNextLink, Loader } from '../atoms';
import { Styles } from '../molecules/InvoicesStyles';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'In Progress':
      return 'bg-green-400';
    case 'Completed':
      return 'bg-blue-400';
    case 'Disputed':
      return 'bg-red-400';
    case 'Expired':
      return 'bg-gray-400';
    case 'Awaiting Funds':
      return 'bg-yellow-400';
    default:
      return 'bg-green-400';
  }
};

function StatusCell({
  cell,
}: {
  cell: CellContext<InvoiceDisplayData, string | undefined>;
}) {
  const colorClass = getStatusColor(cell.getValue());
  return (
    <div
      className={`${colorClass} px-2 py-1 w-fit rounded text-center text-white`}
    >
      {cell.getValue()}
    </div>
  );
}

function InvoiceDisplay({
  cell,
}: {
  cell: CellContext<InvoiceDisplayData, string | undefined>;
}) {
  const { ipfsHash, address } = cell.row.original;

  const { data } = useIpfsDetails(ipfsHash);

  return data?.title || data?.projectName || getAccountString(address);
}
const renderStatusCell = (
  cell: CellContext<InvoiceDisplayData, string | undefined>,
) => <StatusCell cell={cell} />;

const columnHelper = createColumnHelper<InvoiceDisplayData>();

export function InvoiceDashboardTable() {
  const router = useRouter();
  const { address } = useAccount();
  const isConnected = !!address;
  const chainId = useChainId();


  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // TODO: implement pagination
  const [page] = useState(0);

  const { data, isLoading } = useInvoices({
    page,
  });

  const getRole = (row: InvoiceDisplayData) => {
    if (_.toLower(address) === _.toLower(row.client)) return 'Client';
    if (_.toLower(address) === _.toLower(row.provider)) return 'Provider';
    if (_.toLower(address) === _.toLower(row.resolver)) return 'Arbitrator';
    return 'Unknown';
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(row => {
      if (roleFilter !== 'all' && getRole(row) !== roleFilter) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      return true;
    });
  }, [data, roleFilter, statusFilter, address]);

  const table = useReactTable({
    data: filteredData,
    columns: [
      columnHelper.accessor('address', {
        header: 'Title',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: info => <InvoiceDisplay cell={info} />,
      }),
      columnHelper.accessor(row => getRole(row), {
        id: 'role',
        header: 'Role',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor(
        row => {
          const value = formatUnits(
            row.total ?? BigInt(0),
            row.tokenMetadata?.decimals || 18,
          );
          const symbol = row.tokenMetadata?.symbol;
          return `${value} ${symbol}`;
        },
        {
          id: 'total',
          header: 'Total',
          cell: info => info.getValue(),
        },
      ),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        cell: renderStatusCell,
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center">
          <Loader size="80" />
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="py-16">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          {isConnected ? (
            <h2 className="text-gray-500 text-xl font-heading">
              No invoices found for {getChainName(chainId)}!
            </h2>
          ) : (
            <h2 className="text-gray-500 text-xl font-heading">
              Wallet not connected.
            </h2>
          )}

          <ChakraNextLink href="/create">
            <button className="min-w-[250px] py-3 px-6 bg-[#3D88F8] text-white rounded-md font-medium hover:bg-[#2B69C5] transition-colors text-sm sm:text-base md:text-lg">
              Create Invoice
            </button>
          </ChakraNextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 flex-[1_0_100%]">
      <Styles>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-left text-[#192A3E] text-2xl font-heading">
            My Invoices
          </h1>

          <button
            className="bg-[#3D88F8] hover:bg-[rgba(61,136,248,0.7)] active:bg-[rgba(61,136,248,0.7)] text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => router.push('/create')}
          >
            Create Invoice
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            className="text-sm max-w-[160px] border border-gray-300 rounded px-2 py-1"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Client">Client</option>
            <option value="Provider">Provider</option>
            <option value="Arbitrator">Arbitrator</option>
          </select>
          <select
            className="text-sm max-w-[180px] border border-gray-300 rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Funds">Awaiting Funds</option>
            <option value="Disputed">Disputed</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
          {(roleFilter !== 'all' || statusFilter !== 'all') && (
            <p className="text-sm text-gray-500">
              {filteredData.length} of {data?.length ?? 0} invoices
            </p>
          )}
        </div>
        <table className="bg-white">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              const { address: invoiceAddr, chainId: invoiceChainId } =
                row.original;
              const url = `/invoice/${invoiceChainId}/${invoiceAddr}`;

              return (
                <tr
                  key={row.id}
                  onClick={() => router.push(url)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Styles>
    </div>
  );
}

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
import { Button } from '../atoms/Button';
import { Styles } from '../molecules/InvoicesStyles';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'In Progress':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'Completed':
      return 'bg-primary/20 text-primary';
    case 'Disputed':
      return 'bg-destructive/20 text-red-400';
    case 'Expired':
      return 'bg-muted text-muted-foreground';
    case 'Awaiting Funds':
      return 'bg-amber-500/20 text-amber-400';
    default:
      return 'bg-emerald-500/20 text-emerald-400';
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
      className={`${colorClass} px-2 py-1 w-fit rounded text-center`}
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
            <h2 className="text-muted-foreground text-xl font-heading">
              No contracts found for {getChainName(chainId)}!
            </h2>
          ) : (
            <h2 className="text-muted-foreground text-xl font-heading">
              Wallet not connected.
            </h2>
          )}

          <ChakraNextLink href="/create">
            <Button
              size="lg"
              className="min-w-[250px] py-3 px-6 text-sm sm:text-base md:text-lg"
            >
              Create Contract
            </Button>
          </ChakraNextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 flex-[1_0_100%]">
      <Styles>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-left text-foreground text-2xl font-heading">
            My Contracts
          </h1>

          <Button
            onClick={() => router.push('/create')}
            className="px-4 py-2"
          >
            Create Contract
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            className="text-sm max-w-[160px] border border-input rounded px-2 py-1"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Client">Client</option>
            <option value="Provider">Provider</option>
            <option value="Arbitrator">Arbitrator</option>
          </select>
          <select
            className="text-sm max-w-[180px] border border-input rounded px-2 py-1"
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
            <p className="text-sm text-muted-foreground">
              {filteredData.length} of {data?.length ?? 0} contracts
            </p>
          )}
        </div>
        <table className="bg-card">
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
                  className="hover:bg-muted cursor-pointer"
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

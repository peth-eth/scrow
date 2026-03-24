import { useSubgraphHealth } from '@smartinvoicexyz/hooks';
import { getChainName } from '@smartinvoicexyz/utils';
import _ from 'lodash';

export const SubgraphHealthAlert: React.FC<{ chainId?: number }> = ({
  chainId,
}) => {
  const { health, error, isLoading } = useSubgraphHealth();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching subgraph health: ', error);
  }

  if (isLoading) {
    return null;
  }

  if (!chainId) {
    return null;
  }

  const { erroredChainIds, notSyncedChainIds } = _.reduce(
    _.entries(health),
    (acc, [c, h]) => {
      if (h.hasIndexingErrors) {
        acc.erroredChainIds.push(Number(c));
      }
      if (!h.hasSynced) {
        acc.notSyncedChainIds.push(Number(c));
      }
      return acc;
    },
    {
      erroredChainIds: [] as number[],
      notSyncedChainIds: [] as number[],
    },
  );

  const hasErrors = _.some(erroredChainIds);
  const notSynced = _.some(notSyncedChainIds);

  if (!(hasErrors || notSynced)) {
    return null;
  }

  const chainIds = _.uniq([...erroredChainIds, ...notSyncedChainIds]);
  const chains = _.map(chainIds, id => getChainName(id));

  if (!!chainId && !chainIds.includes(chainId)) {
    return null;
  }

  const chainName = chainId ? getChainName(chainId) : chains.join(', ');

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-center items-center z-10"
      style={{ boxShadow: '0px -2px 16px rgba(0, 0, 0, 0.05)' }}
    >
      <div
        role="alert"
        className="flex flex-col items-center text-center gap-2 w-full p-4 bg-red-50 border border-red-200"
      >
        <div className="flex items-center gap-1">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-semibold text-red-700">
            Data Sync Issue Detected!
          </p>
        </div>
        <p className="text-red-600 text-sm">
          The subgraph is behind on: {chainName}. Some data may be outdated or
          incomplete. Please try again later.
        </p>
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';

import { useDebounce } from './useDebounce';

export type FarcasterUser = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  eth_addresses: string[];
  primary_eth_address: string | null;
};

export const useFarcasterSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);
  const [users, setUsers] = useState<FarcasterUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 1) {
      setUsers([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/neynar-search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setUsers(data.users ?? []);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setUsers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { users, isLoading, error };
};

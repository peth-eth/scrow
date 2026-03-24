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

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/api/neynar-search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        setUsers(data.users ?? []);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setUsers([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return { users, isLoading, error };
};

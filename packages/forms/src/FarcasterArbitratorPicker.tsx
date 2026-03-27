import { useFarcasterSearch } from '@smartinvoicexyz/hooks';
import { Button } from '@smartinvoicexyz/ui';
import type { FarcasterUser } from '@smartinvoicexyz/hooks';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onSelect: (address: string) => void;
  defaultUsername: string;
};

export function FarcasterArbitratorPicker({
  onSelect,
  defaultUsername,
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<FarcasterUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { users, isLoading } = useFarcasterSearch(query);

  // Resolve default arbitrator from Farcaster on mount
  useEffect(() => {
    if (selectedUser || !defaultUsername) {
      setDefaultLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/api/neynar-search?q=${encodeURIComponent(defaultUsername)}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        const match = (data.users ?? []).find(
          (u: FarcasterUser) => u.username === defaultUsername,
        );
        if (match) {
          const address =
            match.primary_eth_address ?? match.eth_addresses[0];
          if (address) {
            setSelectedUser(match);
            onSelect(address);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDefaultLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = useCallback(
    (user: FarcasterUser) => {
      const address = user.primary_eth_address ?? user.eth_addresses[0];
      if (address) {
        setSelectedUser(user);
        onSelect(address);
        setQuery('');
        setIsOpen(false);
      }
    },
    [onSelect],
  );

  const noWallet =
    selectedUser &&
    !selectedUser.primary_eth_address &&
    selectedUser.eth_addresses.length === 0;

  if (defaultLoading) {
    return (
      <div className="flex justify-center p-3">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        <p className="ml-2 text-sm text-muted-foreground">
          Loading default arbitrator...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {selectedUser && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-md border border-border">
          <img
            src={selectedUser.pfp_url}
            alt={selectedUser.display_name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-bold text-sm">
              {selectedUser.display_name}
            </p>
            <p className="text-xs text-muted-foreground">
              @{selectedUser.username}
            </p>
          </div>
          <Button
            variant="link"
            className="text-xs text-primary"
            onClick={() => {
              setSelectedUser(null);
              setQuery('');
            }}
          >
            Change
          </Button>
        </div>
      )}

      {noWallet && (
        <div className="flex items-start gap-3 rounded-md border border-amber-500/20 bg-amber-500/10 p-4" role="alert">
          <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-600 shrink-0" />
          <p className="text-sm">
            This user has no connected Ethereum wallet and cannot act as
            arbitrator.
          </p>
        </div>
      )}

      {!selectedUser && (
        <div ref={containerRef} className="relative">
          <input
            type="text"
            placeholder="Search Farcaster user..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (users.length > 0) setIsOpen(true);
            }}
            className="w-full px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {isOpen && query.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-md z-10 max-h-60 overflow-y-auto mt-1">
              {isLoading && (
                <div className="flex justify-center p-3">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}

              {!isLoading && users.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">
                  No users found
                </p>
              )}

              {!isLoading &&
                users.map(user => {
                  const hasWallet =
                    user.primary_eth_address ||
                    user.eth_addresses.length > 0;
                  return (
                    <div
                      key={user.fid}
                      className={`flex items-center gap-3 p-2 px-3 ${
                        hasWallet
                          ? 'cursor-pointer hover:bg-primary/10'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => hasWallet && handleSelect(user)}
                    >
                      <img
                        src={user.pfp_url}
                        alt={user.display_name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {user.display_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                          {!hasWallet && ' (no wallet)'}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Search for a Farcaster user to serve as arbitrator in case of disputes.
      </p>
    </div>
  );
}

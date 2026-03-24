import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Flex,
  Input as ChakraInput,
  Spinner,
  Stack,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useFarcasterSearch } from '@smartinvoicexyz/hooks';
import type { FarcasterUser } from '@smartinvoicexyz/hooks';
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

  useOutsideClick({
    ref: containerRef,
    handler: () => setIsOpen(false),
    enabled: isOpen,
  });

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
      <Flex justify="center" p={3}>
        <Spinner size="sm" />
        <Text ml={2} fontSize="sm" color="gray.500">
          Loading default arbitrator...
        </Text>
      </Flex>
    );
  }

  return (
    <Stack spacing={3}>
      {selectedUser && (
        <Flex
          align="center"
          gap={3}
          p={3}
          bg="gray.50"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <Avatar
            size="sm"
            src={selectedUser.pfp_url}
            name={selectedUser.display_name}
          />
          <Box flex={1}>
            <Text fontWeight="bold" fontSize="sm">
              {selectedUser.display_name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              @{selectedUser.username}
            </Text>
          </Box>
          <Text
            fontSize="xs"
            color="blue.500"
            cursor="pointer"
            onClick={() => {
              setSelectedUser(null);
              setQuery('');
            }}
          >
            Change
          </Text>
        </Flex>
      )}

      {noWallet && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            This user has no connected Ethereum wallet and cannot act as
            arbitrator.
          </Text>
        </Alert>
      )}

      {!selectedUser && (
        <Box ref={containerRef} position="relative">
          <ChakraInput
            placeholder="Search Farcaster user..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (users.length > 0) setIsOpen(true);
            }}
            size="sm"
          />

          {isOpen && query.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              zIndex={10}
              maxH="240px"
              overflowY="auto"
              mt={1}
            >
              {isLoading && (
                <Flex justify="center" p={3}>
                  <Spinner size="sm" />
                </Flex>
              )}

              {!isLoading && users.length === 0 && (
                <Text p={3} fontSize="sm" color="gray.500">
                  No users found
                </Text>
              )}

              {!isLoading &&
                users.map(user => {
                  const hasWallet =
                    user.primary_eth_address ||
                    user.eth_addresses.length > 0;
                  return (
                    <Flex
                      key={user.fid}
                      align="center"
                      gap={3}
                      p={2}
                      px={3}
                      cursor={hasWallet ? 'pointer' : 'not-allowed'}
                      opacity={hasWallet ? 1 : 0.5}
                      _hover={hasWallet ? { bg: 'gray.50' } : {}}
                      onClick={() => hasWallet && handleSelect(user)}
                    >
                      <Avatar
                        size="xs"
                        src={user.pfp_url}
                        name={user.display_name}
                      />
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">
                          {user.display_name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          @{user.username}
                          {!hasWallet && ' (no wallet)'}
                        </Text>
                      </Box>
                    </Flex>
                  );
                })}
            </Box>
          )}
        </Box>
      )}

      <Text fontSize="xs" color="gray.500">
        Search for a Farcaster user to serve as arbitrator in case of disputes.
      </Text>
    </Stack>
  );
}

# GraphQL Package

Subgraph queries and data fetching via Apollo Client + Zeus codegen.

## Key Files

- `client.ts` — Apollo Client setup per chain, `fetchTypedQuery` for type-safe queries using Zeus codegen, cache management (`getCache`)
- `invoice.ts` — single invoice query with full detail: deposits, releases, disputes, resolutions, verified events, token metadata. Exports `Invoice`, `TokenMetadata`, `TokenBalance`, `Deposit`, `Release`, `Dispute`, `Resolution` types.
- `invoices.ts` — paginated invoice list queries (by client, provider, or all)
- `sync.ts` — `waitForSubgraphSync(chainId, txHash)` polls subgraph until it indexes a tx. Uses `getSubgraphStatus` to check sync block number. Critical for post-write UX.
- `scalars.ts` — custom scalar type mappings (BigInt, Bytes, etc.)
- `schema.graphql` — the full subgraph schema

## Zeus Codegen

The `zeus/` directory contains auto-generated types from the subgraph schema. Do NOT edit these files manually. They provide:
- `GraphQLTypes` — all GraphQL types as TypeScript
- `ValueTypes` — input types
- `ReturnTypes` — query return types
- `typedGql` — typed document node factory

## Patterns

- One Apollo Client per supported chain (keyed by chainId)
- All queries go through `fetchTypedQuery(chainId)` which returns a typed query function
- `waitForSubgraphSync` is called after every contract write to ensure UI shows fresh data
- Polling: 5s interval, 20 retries max (GRAPH_POLL_INTERVAL, GRAPH_NUM_RETRIES)

## Gotchas

- Subgraph URLs are in `@smartinvoicexyz/constants` config, not here
- `_SubgraphErrorPolicy_` must be imported from zeus for error handling
- Cache is per-chain — switching chains doesn't share cached data

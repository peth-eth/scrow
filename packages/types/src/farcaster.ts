export type FarcasterUser = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  eth_addresses: string[];
  primary_eth_address: string | null;
};

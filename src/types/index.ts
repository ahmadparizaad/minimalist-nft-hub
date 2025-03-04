export interface NFT {
  id: string;
  tokenId: number;
  creator: string;
  owner: string;
  price: number;
  currency: string;
  image: string;
  metadataURI: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  tokenStandard: "ERC-721" | "ERC-1155";
  isListed: boolean;
  createdAt: string;
  attributes: NFTAttribute[];
  royaltyFee: number;
  ipfsHash: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface MarketplaceFilters {
  priceRange: PriceRange;
  categories: string[];
  rarities: string[];
  tokenStandards: string[];
  sortBy: string;
  creators: string[];
  collections: string[];
  searchQuery: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Transaction {
  id: string;
  type: 'mint' | 'buy' | 'sell' | 'transfer' | 'list' | 'unlist';
  nftId: string;
  from: string;
  to: string;
  price: number;
  currency: string;
  timestamp: string;
  txHash: string;
}

export interface Web3State {
  account: string | null;
  isConnected: boolean;
  chain: number | null;
  sFuelBalance: number;
  usdcBalance: number;
  isLoading: boolean;
  hasRequestedSFuel: boolean;
  error: string | null;
}

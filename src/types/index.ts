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
  collectionId?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  banner: string;
  creator: string;
  verified: boolean;
  items: number;
  owners: number;
  floorPrice: number;
  volumeTraded: number;
}

export interface Creator {
  id: string;
  name: string;
  address: string;
  avatar: string;
  bio: string;
  verified: boolean;
  volumeTraded: number;
  followers: number;
  following: number;
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
  price?: number;
  currency?: string;
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

declare global {
  interface Window {
    ethereum?: any;
  }
}


export interface NFT {
  _id: string;
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
  tokenStandard: string;
  isListed: boolean;
  createdAt: string;
  attributes: NFTAttribute[];
  royaltyFee: number;
  ipfsHash: string;
  collectionId?: string;
  txHash?: string;
  utilityPercent?: number;
  transactionHistory?: unknown[];
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
  bannerImage?: string; // Adding for backward compatibility
  creator: string;
  verified: boolean;
  items: number;
  owners: number;
  floorPrice: number;
  volumeTraded: number;
  category?: string;
  nfts?: unknown[];
  totalVolume?: number;
  royaltyFee?: number;
  isVerified?: boolean;
  createdAt?: string;
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
  username?: string; // Adding for backward compatibility
  profileImage?: string; // Adding for backward compatibility
  coverImage?: string; // Adding for backward compatibility
  email?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  nftsCreated?: unknown[];
  nftsOwned?: unknown[];
  collectionsCreated?: unknown[];
  totalVolume?: number;
  isVerified?: boolean;
  createdAt?: string;
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

// Note: The Window interface is defined in vite-env.d.ts, not here

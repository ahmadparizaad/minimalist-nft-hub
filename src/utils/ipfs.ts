
// This file would contain actual IPFS implementation in a production app
// For now, we'll use mock implementations

import { NFT, Collection, Creator, Transaction } from '@/types';

// Mock data generators
export const generateMockNFTs = (count: number): NFT[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `nft-${i+1}`,
    tokenId: i + 1,
    title: `NFT #${i + 1}`,
    description: `This is a description for NFT #${i + 1}. It's a unique digital asset stored on the blockchain.`,
    image: `https://source.unsplash.com/random/600x600?nft&sig=${i}`,
    price: parseFloat((Math.random() * 10 + 0.1).toFixed(2)),
    currency: 'USDC',
    owner: `0x${Math.random().toString(16).slice(2, 42)}`,
    creator: `0x${Math.random().toString(16).slice(2, 42)}`,
    royaltyFee: parseFloat((Math.random() * 0.1).toFixed(2)),
    isListed: Math.random() > 0.3,
    category: ['Art', 'Collectible', 'Photography', 'Music', 'Video'][Math.floor(Math.random() * 5)],
    rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)],
    tokenStandard: Math.random() > 0.5 ? 'ERC-721' : 'ERC-1155',
    attributes: [
      { trait_type: 'Background', value: ['Red', 'Blue', 'Green', 'Purple', 'Yellow'][Math.floor(Math.random() * 5)] },
      { trait_type: 'Eyes', value: ['Round', 'Square', 'Oval', 'Diamond'][Math.floor(Math.random() * 4)] },
      { trait_type: 'Level', value: Math.floor(Math.random() * 100) }
    ],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    metadataURI: `ipfs://mock-uri-${i+1}`,
    ipfsHash: `mock-hash-${i+1}`,
    collectionId: `collection-${Math.floor(Math.random() * 5) + 1}`
  }));
};

export const generateMockCollections = (count: number): Collection[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `collection-${i+1}`,
    name: `Collection ${i+1}`,
    description: `This is collection #${i+1} featuring unique digital assets.`,
    image: `https://source.unsplash.com/random/600x600?collection&sig=${i}`,
    banner: `https://source.unsplash.com/random/1200x400?banner&sig=${i}`,
    creator: `0x${Math.random().toString(16).slice(2, 42)}`,
    verified: Math.random() > 0.7,
    items: Math.floor(Math.random() * 100) + 10,
    owners: Math.floor(Math.random() * 50) + 5,
    floorPrice: parseFloat((Math.random() * 5 + 0.1).toFixed(2)),
    volumeTraded: parseFloat((Math.random() * 100 + 10).toFixed(2))
  }));
};

export const generateMockCreators = (count: number): Creator[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `creator-${i+1}`,
    name: `Creator ${i+1}`,
    address: `0x${Math.random().toString(16).slice(2, 42)}`,
    avatar: `https://source.unsplash.com/random/300x300?avatar&sig=${i}`,
    bio: `Digital artist specializing in ${['abstract', 'portrait', 'landscape', 'pixel art', '3D'][Math.floor(Math.random() * 5)]} art.`,
    verified: Math.random() > 0.7,
    volumeTraded: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
    followers: Math.floor(Math.random() * 1000) + 10,
    following: Math.floor(Math.random() * 100) + 5
  }));
};

export const generateMockTransactions = (count: number, nftIds: string[]): Transaction[] => {
  const types: Array<'mint' | 'buy' | 'sell' | 'transfer' | 'list' | 'unlist'> = [
    'mint', 'buy', 'sell', 'transfer', 'list', 'unlist'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const nftId = nftIds[Math.floor(Math.random() * nftIds.length)];
    
    return {
      id: `tx-${i+1}`,
      type,
      nftId,
      from: `0x${Math.random().toString(16).slice(2, 42)}`,
      to: `0x${Math.random().toString(16).slice(2, 42)}`,
      price: ['buy', 'sell', 'list'].includes(type) ? parseFloat((Math.random() * 10 + 0.1).toFixed(2)) : undefined,
      currency: ['buy', 'sell', 'list'].includes(type) ? 'USDC' : undefined,
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`
    };
  });
};

// Mock upload to IPFS
export const uploadToIPFS = async (
  metadata: any,
  file: File
): Promise<{ ipfsHash: string; url: string }> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would upload to Pinata or other IPFS provider
  return {
    ipfsHash: `ipfs-${Math.random().toString(16).slice(2, 42)}`,
    url: URL.createObjectURL(file) // This is just for demo purposes
  };
};

// Mock fetch from IPFS
export const fetchFromIPFS = async (
  ipfsHash: string
): Promise<any> => {
  // Simulate fetch delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would fetch from Pinata or other IPFS provider
  return {
    data: "Mock IPFS data for hash: " + ipfsHash
  };
};

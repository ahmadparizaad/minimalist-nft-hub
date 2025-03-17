import { NFT, Collection, Creator } from "@/types";
import { nftAPI } from "@/api/apiService";

export const mockNFTs: NFT[] = [
  {
    id: "1",
    tokenId: 1,
    title: "Abstract Painting",
    description: "A vibrant abstract painting with bold colors.",
    image:
      "https://images.unsplash.com/photo-1603412554934-0c9c55319907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 1.5,
    currency: "USDC",
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    royaltyFee: 0.025,
    isListed: true,
    category: "Art",
    rarity: "Rare",
    tokenStandard: "ERC-721",
    attributes: [
      { trait_type: "Style", value: "Abstract" },
      { trait_type: "Color", value: "Vibrant" },
    ],
    ipfsHash: "QmXExS4BMc1YrH6iWERyryFJHfFpZkJw9g2TgXSz9BZAhB",
    metadataURI: "ipfs://QmXExS4BMc1YrH6iWERyryFJHfFpZkJw9g2TgXSz9BZAhB",
    collectionId: "101",
    utilityPercent: 0.85,
    transactionHistory: [],
    createdAt: new Date(),
  },
  {
    id: "2",
    tokenId: 2,
    title: "Pixel Art Character",
    description: "A unique pixel art character design.",
    image:
      "https://images.unsplash.com/photo-1635032545724-2774e7554064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 0.75,
    currency: "USDC",
    owner: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    creator: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    royaltyFee: 0.05,
    isListed: false,
    category: "Collectible",
    rarity: "Uncommon",
    tokenStandard: "ERC-721",
    attributes: [
      { trait_type: "Type", value: "Character" },
      { trait_type: "Style", value: "Pixel Art" },
    ],
    ipfsHash: "QmYtXKiYueo6XMTvPguLnP5j1nsZUNWvnYyJ9UhRExeW6K",
    metadataURI: "ipfs://QmYtXKiYueo6XMTvPguLnP5j1nsZUNWvnYyJ9UhRExeW6K",
    collectionId: "102",
    utilityPercent: 0.6,
    transactionHistory: [],
    createdAt: new Date(),
  },
  {
    id: "3",
    tokenId: 3,
    title: "Nature Photography",
    description: "A stunning photograph of a mountain landscape.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ffc2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2.0,
    currency: "USDC",
    owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    creator: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    royaltyFee: 0.02,
    isListed: true,
    category: "Photography",
    rarity: "Common",
    tokenStandard: "ERC-721",
    attributes: [
      { trait_type: "Location", value: "Mountains" },
      { trait_type: "Season", value: "Summer" },
    ],
    ipfsHash: "QmZqS9n9e7qa4t9s9t9s9t9s9t9s9t9s9t9s9t9s9t",
    metadataURI: "ipfs://QmZqS9n9e7qa4t9s9t9s9t9s9t9s9t9s9t9s9t9s9t",
    collectionId: "103",
    utilityPercent: 0.7,
    transactionHistory: [],
    createdAt: new Date(),
  },
  {
    id: "4",
    tokenId: 4,
    title: "Digital Music Track",
    description: "An original electronic music track.",
    image:
      "https://images.unsplash.com/photo-1508700942705-0c74999ca8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 1.0,
    currency: "USDC",
    owner: "0x9965507D1a55bcC2695C58ba16FB37610f09aDb1",
    creator: "0x9965507D1a55bcC2695C58ba16FB37610f09aDb1",
    royaltyFee: 0.03,
    isListed: true,
    category: "Music",
    rarity: "Uncommon",
    tokenStandard: "ERC-1155",
    attributes: [
      { trait_type: "Genre", value: "Electronic" },
      { trait_type: "Duration", value: "3:45" },
    ],
    ipfsHash: "QmWsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsV",
    metadataURI: "ipfs://QmWsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsVt9vsV",
    collectionId: "104",
    utilityPercent: 0.9,
    transactionHistory: [],
    createdAt: new Date(),
  },
  {
    id: "5",
    tokenId: 5,
    title: "Animated Video Clip",
    description: "A short animated video clip.",
    image:
      "https://images.unsplash.com/photo-1534452203419-466ef4aef88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2.5,
    currency: "USDC",
    owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    royaltyFee: 0.04,
    isListed: false,
    category: "Video",
    rarity: "Rare",
    tokenStandard: "ERC-1155",
    attributes: [
      { trait_type: "Animation Style", value: "3D" },
      { trait_type: "Duration", value: "0:30" },
    ],
    ipfsHash: "QmRvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrv",
    metadataURI: "ipfs://QmRvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrvXrv",
    collectionId: "105",
    utilityPercent: 0.75,
    transactionHistory: [],
    createdAt: new Date(),
  },
];

export const mockCollections: Collection[] = [
  {
    id: "101",
    name: "Abstract Art",
    description: "A collection of abstract art pieces.",
    image:
      "https://images.unsplash.com/photo-1603412554934-0c9c55319907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage:
      "https://images.unsplash.com/photo-1603412554934-0c9c55319907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    category: "Art",
    nfts: [],
    floorPrice: 1.5,
    totalVolume: 100,
    royaltyFee: 0.025,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: "102",
    name: "Pixel Art",
    description: "A collection of pixel art characters.",
    image:
      "https://images.unsplash.com/photo-1635032545724-2774e7554064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage:
      "https://images.unsplash.com/photo-1635032545724-2774e7554064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    category: "Collectible",
    nfts: [],
    floorPrice: 0.75,
    totalVolume: 50,
    royaltyFee: 0.05,
    isVerified: false,
    createdAt: new Date(),
  },
  {
    id: "103",
    name: "Nature",
    description: "A collection of nature photographs.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ffc2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ffc2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    category: "Photography",
    nfts: [],
    floorPrice: 2.0,
    totalVolume: 75,
    royaltyFee: 0.02,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: "104",
    name: "Music",
    description: "A collection of music tracks.",
    image:
      "https://images.unsplash.com/photo-1508700942705-0c74999ca8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage:
      "https://images.unsplash.com/photo-1508700942705-0c74999ca8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "0x9965507D1a55bcC2695C58ba16FB37610f09aDb1",
    category: "Music",
    nfts: [],
    floorPrice: 1.0,
    totalVolume: 25,
    royaltyFee: 0.03,
    isVerified: false,
    createdAt: new Date(),
  },
  {
    id: "105",
    name: "Video",
    description: "A collection of video clips.",
    image:
      "https://images.unsplash.com/photo-1534452203419-466ef4aef88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bannerImage:
      "https://images.unsplash.com/photo-1534452203419-466ef4aef88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    category: "Video",
    nfts: [],
    floorPrice: 2.5,
    totalVolume: 150,
    royaltyFee: 0.04,
    isVerified: true,
    createdAt: new Date(),
  },
];

export const mockCreators: Creator[] = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    username: "AbstractArtist",
    bio: "Creating abstract art for the digital age.",
    profileImage:
      "https://images.unsplash.com/photo-1603412554934-0c9c55319907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coverImage:
      "https://images.unsplash.com/photo-1603412554934-0c9c55319907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "abstract@example.com",
    socials: {
      twitter: "@AbstractArtist",
      instagram: "@abstract_art",
      website: "https://abstract.com",
    },
    nftsCreated: [],
    nftsOwned: [],
    collectionsCreated: [],
    totalVolume: 100,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    address: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    username: "PixelMaster",
    bio: "Crafting pixel art characters with love.",
    profileImage:
      "https://images.unsplash.com/photo-1635032545724-2774e7554064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coverImage:
      "https://images.unsplash.com/photo-1635032545724-2774e7554064?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "pixel@example.com",
    socials: {
      twitter: "@PixelMaster",
      instagram: "@pixel_art",
      website: "https://pixel.com",
    },
    nftsCreated: [],
    nftsOwned: [],
    collectionsCreated: [],
    totalVolume: 50,
    isVerified: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    username: "NaturePhotographer",
    bio: "Capturing the beauty of nature through photography.",
    profileImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ffc2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ffc2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "nature@example.com",
    socials: {
      twitter: "@NaturePhotographer",
      instagram: "@nature_photo",
      website: "https://nature.com",
    },
    nftsCreated: [],
    nftsOwned: [],
    collectionsCreated: [],
    totalVolume: 75,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    address: "0x9965507D1a55bcC2695C58ba16FB37610f09aDb1",
    username: "MusicComposer",
    bio: "Composing original music tracks for the world.",
    profileImage:
      "https://images.unsplash.com/photo-1508700942705-0c74999ca8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coverImage:
      "https://images.unsplash.com/photo-1508700942705-0c74999ca8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "music@example.com",
    socials: {
      twitter: "@MusicComposer",
      instagram: "@music_tracks",
      website: "https://music.com",
    },
    nftsCreated: [],
    nftsOwned: [],
    collectionsCreated: [],
    totalVolume: 25,
    isVerified: false,
    createdAt: new Date(),
  },
  {
    id: "5",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    username: "VideoAnimator",
    bio: "Creating animated video clips for your entertainment.",
    profileImage:
      "https://images.unsplash.com/photo-1534452203419-466ef4aef88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coverImage:
      "https://images.unsplash.com/photo-1534452203419-466ef4aef88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "video@example.com",
    socials: {
      twitter: "@VideoAnimator",
      instagram: "@video_clips",
      website: "https://video.com",
    },
    nftsCreated: [],
    nftsOwned: [],
    collectionsCreated: [],
    totalVolume: 150,
    isVerified: true,
    createdAt: new Date(),
  },
];

export const uploadToIPFS = async (file: File, metadata: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: metadata.name,
        keyvalues: metadata,
      })
    );
    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 0,
      })
    );

    const pinataJWT = import.meta.env.VITE_PINATA_JWT;
    
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Pinata API error: ${errorData.error}`);
    }

    const ipfsData = await res.json();
    console.log("IPFS response:", ipfsData);
    
    return ipfsData;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

// Store NFT data in MongoDB after successful IPFS upload and blockchain minting
export const storeNFTInDatabase = async (
  nftData: Partial<NFT>, 
  txHash?: string
) => {
  try {
    // Send NFT data to backend API
    const response = await nftAPI.createNFT({
      ...nftData,
      txHash
    });
    
    console.log("NFT stored in database:", response);
    return response.data;
  } catch (error) {
    console.error("Error storing NFT in database:", error);
    throw error;
  }
};

// Retrieve NFT from database by token ID
export const getNFTFromDatabase = async (tokenId: number) => {
  try {
    const response = await nftAPI.getNFTByTokenId(tokenId);
    return response.data;
  } catch (error) {
    console.error("Error retrieving NFT from database:", error);
    throw error;
  }
};

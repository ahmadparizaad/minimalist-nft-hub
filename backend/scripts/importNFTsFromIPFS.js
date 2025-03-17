
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const NFT = require('../models/NFT');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Load environment variables
dotenv.config();

// Array of IPFS hashes for your NFTs
// Replace these with your actual IPFS hashes
const ipfsHashes = [
  'QmXExS4BMc1YrH6iWERyryFJHfFpZkJw9g2TgXSz9BZAhB',
  'QmYtXKiYueo6XMTvPguLnP5j1nsZUNWvnYyJ9UhRExeW6K',
  // Add more IPFS hashes here
];

// Gateway URL for fetching IPFS content
const gatewayUrl = process.env.VITE_GATEWAY_URL || 'ipfs.io';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to fetch metadata from IPFS
async function fetchMetadataFromIPFS(ipfsHash) {
  try {
    const url = `https://${gatewayUrl}/ipfs/${ipfsHash}`;
    console.log(`Fetching metadata from: ${url}`);
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metadata for hash ${ipfsHash}:`, error.message);
    return null;
  }
}

// Function to create an NFT record in MongoDB
async function createNFTRecord(metadata, ipfsHash) {
  try {
    // Check if this NFT already exists in the database
    const existingNFT = await NFT.findOne({ ipfsHash });
    
    if (existingNFT) {
      console.log(`NFT with IPFS hash ${ipfsHash} already exists in the database.`);
      return null;
    }
    
    // Generate a unique token ID (you might want to use a different approach)
    const highestTokenId = await NFT.findOne().sort({ tokenId: -1 });
    const newTokenId = highestTokenId ? highestTokenId.tokenId + 1 : 1;
    
    // Create the NFT document
    const nftData = {
      tokenId: newTokenId,
      title: metadata.name || 'Unnamed NFT',
      description: metadata.description || '',
      image: metadata.image || '',
      price: metadata.price || 0,
      currency: 'USDC',
      owner: metadata.owner || metadata.creator || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Default owner
      creator: metadata.creator || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Default creator
      royaltyFee: metadata.royaltyFee || 0.025,
      isListed: metadata.isListed || false,
      category: metadata.category || 'Art',
      rarity: metadata.rarity || 'Common',
      tokenStandard: metadata.tokenStandard || 'ERC-721',
      attributes: metadata.attributes || [],
      ipfsHash: ipfsHash,
      metadataURI: `ipfs://${ipfsHash}`,
      collectionId: metadata.collectionId || null,
      utilityPercent: metadata.utilityPercent || 0,
      createdAt: metadata.createdAt || new Date()
    };
    
    // Create and save the NFT
    const nft = await NFT.create(nftData);
    console.log(`Created NFT: ${nft.title} with token ID ${nft.tokenId}`);
    
    // Create mint transaction
    const transaction = await Transaction.create({
      type: 'mint',
      nftId: nft._id,
      tokenId: nft.tokenId,
      from: '0x0000000000000000000000000000000000000000', // Mint address
      to: nft.creator,
      price: 0,
      currency: 'USDC',
      txHash: metadata.txHash || `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: new Date()
    });
    
    // Update NFT with transaction
    nft.transactionHistory.push(transaction._id);
    await nft.save();
    
    // Update User (creator and owner are the same when minting)
    let user = await User.findOne({ address: nft.creator });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        address: nft.creator,
        nftsCreated: [nft._id],
        nftsOwned: [nft._id]
      });
    } else {
      // Update existing user
      if (!user.nftsCreated.includes(nft._id)) {
        user.nftsCreated.push(nft._id);
      }
      if (!user.nftsOwned.includes(nft._id)) {
        user.nftsOwned.push(nft._id);
      }
      await user.save();
    }
    
    return nft;
  } catch (error) {
    console.error(`Error creating NFT record for hash ${ipfsHash}:`, error);
    return null;
  }
}

// Main function to import NFTs
async function importNFTs() {
  try {
    console.log('Starting NFT import process...');
    
    // Process each IPFS hash
    for (const ipfsHash of ipfsHashes) {
      console.log(`Processing IPFS hash: ${ipfsHash}`);
      
      // Fetch metadata from IPFS
      const metadata = await fetchMetadataFromIPFS(ipfsHash);
      
      if (metadata) {
        // Create NFT record in MongoDB
        const nft = await createNFTRecord(metadata, ipfsHash);
        
        if (nft) {
          console.log(`Successfully imported NFT: ${nft.title}`);
        } else {
          console.log(`Skipped NFT with hash: ${ipfsHash}`);
        }
      } else {
        console.log(`Could not fetch metadata for hash: ${ipfsHash}`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('NFT import process completed.');
  } catch (error) {
    console.error('Error during import process:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the import process
importNFTs();

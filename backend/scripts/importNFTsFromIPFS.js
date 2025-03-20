
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Import models (add these lines)
const NFT = require("../models/NFT");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function fetchMetadataFromIPFS(ipfsHash) {
  try {
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.VITE_PINATA_JWT}` },
    };

    const response = await axios.get(`https://api.pinata.cloud/v3/files/public/${ipfsHash}`, options);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metadata for hash ${ipfsHash}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

// Create mock NFT data for testing
async function createMockNFTs() {
  try {
    await connectDB();
    
    // Check if NFTs already exist
    const existingCount = await NFT.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} NFTs. Skipping mock data creation.`);
      return;
    }

    // Create sample addresses
    const addresses = [
      "0x8B84272eaF3540fb46c6Ab4A22b13E95E3e3a5A3", // creator 1
      "0x4aC51d08b91D66Ccdc41b7E97179ff8F0e54337E", // creator 2
      "0x7FAaB9C67dAdE1b31f5A4FA4e7aadA6797ba497e", // random user 1
      "0x0eB5Cf4F7E7Fa0C7C8b8621Fd9d0764f33da93C5"  // random user 2
    ];

    const categories = ["Art", "Collectible", "Photography", "Music", "Video"];
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    
    // Create users first
    for (const address of addresses) {
      const existingUser = await User.findOne({ address });
      if (!existingUser) {
        await User.create({
          address,
          username: `User_${address.substring(2, 8)}`,
          bio: `This is a sample bio for ${address.substring(0, 10)}...`,
          profileImage: `https://source.unsplash.com/random/300x300?sig=${Math.floor(Math.random() * 1000)}`,
          coverImage: `https://source.unsplash.com/random/1200x400?sig=${Math.floor(Math.random() * 1000)}`,
          isVerified: Math.random() > 0.7
        });
        console.log(`Created user with address ${address}`);
      }
    }

    // Mock NFTs
    const mockNFTs = [];
    for (let i = 1; i <= 20; i++) {
      const creator = addresses[i % 2]; // alternate between first two addresses as creators
      const owner = Math.random() > 0.3 ? creator : addresses[Math.floor(Math.random() * addresses.length)];
      const price = Math.floor(Math.random() * 10) * 100 + 50; // Random price between 50 and 950
      const isListed = Math.random() > 0.3;
      
      const nft = {
        tokenId: i,
        title: `NFT Artwork #${i}`,
        description: `This is a beautiful NFT artwork #${i}. It's a unique digital asset stored on the blockchain.`,
        image: `https://source.unsplash.com/random/600x600?art,digital&sig=${i}`,
        price: price,
        currency: "USDC",
        creator: creator,
        owner: owner,
        royaltyFee: 0.05, // 5%
        isListed: isListed,
        category: categories[Math.floor(Math.random() * categories.length)],
        rarity: rarities[Math.floor(Math.random() * rarities.length)],
        tokenStandard: Math.random() > 0.2 ? "ERC-721" : "ERC-1155",
        attributes: [
          { trait_type: "Background", value: ["Red", "Blue", "Green", "Yellow", "Purple"][Math.floor(Math.random() * 5)] },
          { trait_type: "Eyes", value: ["Big", "Small", "Round", "Square"][Math.floor(Math.random() * 4)] },
          { trait_type: "Mouth", value: ["Smile", "Frown", "Open", "Closed"][Math.floor(Math.random() * 4)] },
          { trait_type: "Level", value: Math.floor(Math.random() * 100) }
        ],
        ipfsHash: `QmHash${i}`,
        metadataURI: `ipfs://QmHash${i}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
      };
      
      mockNFTs.push(nft);
    }

    // Insert NFTs
    for (const nftData of mockNFTs) {
      // Create the NFT
      const nft = await NFT.create(nftData);
      console.log(`Created NFT: ${nft.title}`);
      
      // Create mint transaction
      const transaction = await Transaction.create({
        type: 'mint',
        nftId: nft._id,
        tokenId: nft.tokenId,
        from: '0xC202B26262b4a3110d3Df2617325c41DfB62933e', // Mint address
        to: nft.creator,
        price: 0,
        currency: 'USDC',
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        timestamp: nft.createdAt
      });
      
      // If owner is different from creator, create a buy transaction
      if (nft.owner !== nft.creator) {
        await Transaction.create({
          type: 'buy',
          nftId: nft._id,
          tokenId: nft.tokenId,
          from: nft.creator,
          to: nft.owner,
          price: nft.price,
          currency: 'USDC',
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          timestamp: new Date(nft.createdAt.getTime() + 86400000) // 1 day after mint
        });
      }
      
      // Update user
      await User.findOneAndUpdate(
        { address: nft.creator },
        { $push: { nftsCreated: nft._id } }
      );
      
      await User.findOneAndUpdate(
        { address: nft.owner },
        { $push: { nftsOwned: nft._id } }
      );
    }

    console.log("Sample data created successfully!");
  } catch (error) {
    console.error("Error creating sample data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the mock data creation
createMockNFTs();

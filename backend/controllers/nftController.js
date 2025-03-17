
const NFT = require('../models/NFT');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all NFTs with pagination
exports.getAllNFTs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Handle filtering
    const filter = {};
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isListed === 'true') filter.isListed = true;
    if (req.query.isListed === 'false') filter.isListed = false;
    if (req.query.tokenStandard) filter.tokenStandard = req.query.tokenStandard;
    if (req.query.rarity) filter.rarity = req.query.rarity;
    if (req.query.creator) filter.creator = req.query.creator;
    if (req.query.owner) filter.owner = req.query.owner;
    
    // Handle price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Handle search
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Handle sorting
    let sort = {};
    switch (req.query.sort) {
      case 'priceAsc':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    const nfts = await NFT.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await NFT.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: nfts,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFTs',
      error: error.message
    });
  }
};

// Get NFT by ID
exports.getNFTById = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    // Get transaction history
    const transactions = await Transaction.find({ nftId: nft._id })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      data: { ...nft.toObject(), transactionHistory: transactions }
    });
  } catch (error) {
    console.error('Error getting NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT',
      error: error.message
    });
  }
};

// Get NFT by Token ID
exports.getNFTByTokenId = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const nft = await NFT.findOne({ tokenId });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    // Get transaction history
    const transactions = await Transaction.find({ tokenId })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      data: { ...nft.toObject(), transactionHistory: transactions }
    });
  } catch (error) {
    console.error('Error getting NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT',
      error: error.message
    });
  }
};

// Create new NFT
exports.createNFT = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const {
      tokenId,
      title,
      description,
      image,
      price,
      owner,
      creator,
      royaltyFee,
      isListed,
      category,
      rarity,
      tokenStandard,
      attributes,
      ipfsHash,
      metadataURI,
      collectionId,
      utilityPercent
    } = req.body;
    
    // Check if NFT with this tokenId already exists
    const existingNFT = await NFT.findOne({ tokenId });
    if (existingNFT) {
      return res.status(400).json({
        success: false,
        message: 'NFT with this token ID already exists'
      });
    }
    
    // Create the NFT
    const nft = await NFT.create({
      tokenId,
      title,
      description,
      image,
      price,
      currency: 'USDC',
      owner,
      creator,
      royaltyFee,
      isListed,
      category,
      rarity,
      tokenStandard,
      attributes,
      ipfsHash,
      metadataURI,
      collectionId,
      utilityPercent,
      createdAt: new Date()
    });
    
    // Create mint transaction
    const transaction = await Transaction.create({
      type: 'mint',
      nftId: nft._id,
      tokenId,
      from: '0x0000000000000000000000000000000000000000', // Mint address
      to: creator,
      price: 0,
      currency: 'USDC',
      txHash: req.body.txHash || `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: new Date()
    });
    
    // Update NFT with transaction
    nft.transactionHistory.push(transaction._id);
    await nft.save();
    
    // Update User (creator and owner are the same when minting)
    let user = await User.findOne({ address: creator });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        address: creator,
        nftsCreated: [nft._id],
        nftsOwned: [nft._id]
      });
    } else {
      // Update existing user
      user.nftsCreated.push(nft._id);
      user.nftsOwned.push(nft._id);
      await user.save();
    }
    
    res.status(201).json({
      success: true,
      data: nft,
      transaction
    });
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create NFT',
      error: error.message
    });
  }
};

// Update NFT
exports.updateNFT = async (req, res) => {
  try {
    const nft = await NFT.findOne({ tokenId: req.params.tokenId });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    // Only allow owner to update
    if (nft.owner.toLowerCase() !== req.body.address.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this NFT'
      });
    }
    
    // Fields that can be updated
    const allowedUpdates = [
      'title',
      'description',
      'price',
      'isListed',
      'category'
    ];
    
    // Update only allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        nft[field] = req.body[field];
      }
    });
    
    // If listing status changed, create a transaction
    if (req.body.isListed !== undefined && req.body.isListed !== nft.isListed) {
      const transactionType = req.body.isListed ? 'list' : 'unlist';
      
      const transaction = await Transaction.create({
        type: transactionType,
        nftId: nft._id,
        tokenId: nft.tokenId,
        from: nft.owner,
        to: nft.owner,
        price: req.body.price || nft.price,
        currency: 'USDC',
        txHash: req.body.txHash || `0x${Math.random().toString(16).slice(2, 66)}`,
        timestamp: new Date()
      });
      
      nft.transactionHistory.push(transaction._id);
    }
    
    await nft.save();
    
    res.status(200).json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Error updating NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update NFT',
      error: error.message
    });
  }
};

// Buy NFT
exports.buyNFT = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { tokenId, buyer, txHash } = req.body;
    
    const nft = await NFT.findOne({ tokenId }).session(session);
    
    if (!nft) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    if (!nft.isListed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'NFT is not listed for sale'
      });
    }
    
    const oldOwner = nft.owner;
    
    // Create buy transaction
    const transaction = await Transaction.create([{
      type: 'buy',
      nftId: nft._id,
      tokenId: nft.tokenId,
      from: oldOwner,
      to: buyer,
      price: nft.price,
      currency: 'USDC',
      txHash: txHash || `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: new Date()
    }], { session });
    
    // Update NFT
    nft.owner = buyer;
    nft.isListed = false;
    nft.transactionHistory.push(transaction[0]._id);
    await nft.save({ session });
    
    // Update old owner
    const oldOwnerUser = await User.findOne({ address: oldOwner }).session(session);
    if (oldOwnerUser) {
      oldOwnerUser.nftsOwned = oldOwnerUser.nftsOwned.filter(
        id => id.toString() !== nft._id.toString()
      );
      oldOwnerUser.totalVolume += nft.price;
      await oldOwnerUser.save({ session });
    }
    
    // Update buyer
    let buyerUser = await User.findOne({ address: buyer }).session(session);
    if (!buyerUser) {
      buyerUser = await User.create([{
        address: buyer,
        nftsOwned: [nft._id]
      }], { session });
    } else {
      buyerUser.nftsOwned.push(nft._id);
      await buyerUser.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      data: {
        nft,
        transaction: transaction[0]
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error buying NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to buy NFT',
      error: error.message
    });
  }
};

// Get NFTs by owner
exports.getNFTsByOwner = async (req, res) => {
  try {
    const { address } = req.params;
    const nfts = await NFT.find({ owner: address });
    
    res.status(200).json({
      success: true,
      data: nfts
    });
  } catch (error) {
    console.error('Error getting NFTs by owner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFTs',
      error: error.message
    });
  }
};

// Get NFTs by creator
exports.getNFTsByCreator = async (req, res) => {
  try {
    const { address } = req.params;
    const nfts = await NFT.find({ creator: address });
    
    res.status(200).json({
      success: true,
      data: nfts
    });
  } catch (error) {
    console.error('Error getting NFTs by creator:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFTs',
      error: error.message
    });
  }
};

// Get transaction history by token ID
exports.getTransactionHistoryByTokenId = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const nft = await NFT.findOne({ tokenId });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    const transactions = await Transaction.find({ nftId: nft._id })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error.message
    });
  }
};

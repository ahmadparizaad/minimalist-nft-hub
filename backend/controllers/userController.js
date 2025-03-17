
const User = require('../models/User');
const NFT = require('../models/NFT');
const { validationResult } = require('express-validator');

// Get user profile by address
exports.getUserByAddress = async (req, res) => {
  try {
    const { address } = req.params;
    
    let user = await User.findOne({ address });
    
    if (!user) {
      // Create a basic user profile if it doesn't exist
      user = await User.create({ address });
    }
    
    // Get created NFTs
    const createdNFTs = await NFT.find({ creator: address });
    
    // Get owned NFTs
    const ownedNFTs = await NFT.find({ owner: address });
    
    // Return user data with NFTs
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        createdNFTs,
        ownedNFTs
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { address } = req.params;
    
    // Check if address in params matches the address in the body
    if (req.body.address && req.body.address.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    // Find the user
    let user = await User.findOne({ address });
    
    if (!user) {
      // Create a new user if doesn't exist
      user = new User({
        address,
        ...req.body
      });
    } else {
      // Update allowed fields
      const allowedUpdates = [
        'username',
        'bio',
        'profileImage',
        'coverImage',
        'email',
        'socials'
      ];
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'socials') {
            user.socials = {
              ...user.socials,
              ...req.body.socials
            };
          } else {
            user[field] = req.body[field];
          }
        }
      });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const { address } = req.params;
    
    // Count NFTs created
    const createdCount = await NFT.countDocuments({ creator: address });
    
    // Count NFTs owned
    const ownedCount = await NFT.countDocuments({ owner: address });
    
    // Get total volume
    const user = await User.findOne({ address });
    const totalVolume = user ? user.totalVolume : 0;
    
    res.status(200).json({
      success: true,
      data: {
        createdCount,
        ownedCount,
        totalVolume
      }
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
};


const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  trait_type: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const nftSchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USDC'
    },
    owner: {
      type: String,
      required: true
    },
    creator: {
      type: String,
      required: true
    },
    royaltyFee: {
      type: Number,
      default: 0
    },
    isListed: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['Art', 'Collectible', 'Photography', 'Music', 'Video', 'Other'],
      default: 'Art'
    },
    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
      default: 'Common'
    },
    tokenStandard: {
      type: String,
      enum: ['ERC-721', 'ERC-1155'],
      default: 'ERC-721'
    },
    attributes: [attributeSchema],
    ipfsHash: {
      type: String,
      required: true
    },
    metadataURI: {
      type: String
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null
    },
    utilityPercent: {
      type: Number,
      default: 0
    },
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create a compound index for tokenId to ensure uniqueness
nftSchema.index({ tokenId: 1 }, { unique: true });

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;

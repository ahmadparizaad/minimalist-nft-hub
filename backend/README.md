
# NFT Marketplace Backend

This is the backend server for the NFT Marketplace application. It provides APIs for NFT management, user profiles, collections, and transaction history.

## Technology Stack

- Node.js + Express.js
- MongoDB (with Mongoose ORM)
- RESTful API architecture

## Setup Instructions

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Set up environment variables by creating a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nft-marketplace
   NODE_ENV=development
   ```

3. Start MongoDB:
   If you have MongoDB installed locally, start it:
   ```
   mongod
   ```
   Or use MongoDB Atlas for cloud hosting.

4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### NFT Endpoints

- `GET /api/nfts` - Get all NFTs (with pagination and filtering)
- `GET /api/nfts/:id` - Get NFT by ID
- `GET /api/nfts/token/:tokenId` - Get NFT by token ID
- `POST /api/nfts` - Create new NFT
- `PUT /api/nfts/:tokenId` - Update NFT
- `POST /api/nfts/buy` - Buy NFT
- `GET /api/nfts/owner/:address` - Get NFTs by owner
- `GET /api/nfts/creator/:address` - Get NFTs by creator
- `GET /api/nfts/transactions/:tokenId` - Get transaction history by token ID

### User Endpoints

- `GET /api/users/:address` - Get user by address
- `PUT /api/users/:address` - Update user profile
- `GET /api/users` - Get all users
- `GET /api/users/stats/:address` - Get user stats

### Collection Endpoints

- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get collection by ID
- `POST /api/collections` - Create new collection
- `PUT /api/collections/:id` - Update collection
- `GET /api/collections/creator/:address` - Get collections by creator
- `POST /api/collections/add-nft` - Add NFT to collection

### Transaction Endpoints

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/user/:address` - Get transactions by user
- `GET /api/transactions/nft/:id` - Get transactions by NFT
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/recent` - Get recent transactions

## Database Models

- **User** - Stores user profile information
- **NFT** - Stores NFT metadata and ownership information
- **Collection** - Stores collection information and associated NFTs
- **Transaction** - Stores transaction history for NFTs

## Integration with Frontend

The backend is designed to work seamlessly with the frontend React application, which communicates with this server through RESTful API calls.

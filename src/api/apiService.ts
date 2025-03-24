import axios from "axios";
import { NFT, Transaction, Collection, Creator } from "@/types";

// API URL - Updated to use production URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Log API URL for debugging - helpful when deployed to see which endpoint is being used
console.log("Using API URL:", API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 15000,
  // Ensure credentials (cookies) are sent
  withCredentials: false,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", {
        request: error.request,
        url: error.config?.url,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// NFT API
export const nftAPI = {
  getAllNFTs: async (params?: unknown) => {
    try {
      const response = await api.get("/nfts", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all NFTs:", error);
      return { data: [], success: false };
    }
  },
  
  getNFTById: async (id: string) => {
    try {
      const response = await api.get(`/nfts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NFT with ID ${id}:`, error);
      return { data: null, success: false };
    }
  },
  
  getNFTByTokenId: async (tokenId: number) => {
    try {
      console.log(`Fetching NFT with token ID ${tokenId}`);
      const response = await api.get(`/nfts/token/${tokenId}`);
      console.log('NFT by token ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NFT with token ID ${tokenId}:`, error);
      
      // Provide a fallback NFT with default values
      return { 
        success: false, 
        data: {
          _id: `fallback-${tokenId}`,
          tokenId: tokenId,
          title: `NFT #${tokenId}`,
          description: "NFT Description (Fallback)",
          image: "https://via.placeholder.com/500?text=NFT+Image",
          price: 0,
          currency: "USDC",
          owner: "0x0000000000000000000000000000000000000000",
          creator: "0x0000000000000000000000000000000000000000",
          royaltyFee: 0,
          isListed: false,
          category: "Art",
          rarity: "Common",
          tokenStandard: "ERC-721",
          createdAt: new Date().toISOString()
        } 
      };
    }
  },
  
  createNFT: async (nftData: Partial<NFT>) => {
    const response = await api.post("/nfts", nftData);
    return response.data;
  },
  
  updateNFT: async (tokenId: number, updateData: Partial<NFT>) => {
    try {
      const response = await api.put(`/nfts/${tokenId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating NFT with tokenId ${tokenId}:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  
  buyNFT: async (tokenId: number, buyer: string, txHash?: string) => {
    const response = await api.post("/nfts/buy", { tokenId, buyer, txHash });
    return response.data;
  },
  
  getNFTsByOwner: async (address: string) => {
    const response = await api.get(`/nfts/owner/${address}`);
    return response.data;
  },
  
  getNFTsByCreator: async (address: string) => {
    try {
      console.log(`Fetching NFTs created by ${address}`);
      const response = await api.get(`/nfts/creator/${address}`);
      console.log('Creator NFTs response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NFTs created by ${address}:`, error);
      // Check if error has response data
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return { data: [], success: false };
    }
  },
  
  getTransactionHistory: async (tokenId: number) => {
    const response = await api.get(`/nfts/transactions/${tokenId}`);
    return response.data;
  },
  
  getTrendingNFTs: async (limit = 4) => {
    try {
      console.log(`Fetching trending NFTs, limit: ${limit}`);
      const response = await api.get(`/nfts/trending?limit=${limit}`);
      console.log('Trending NFTs response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending NFTs:", error);
      // Provide a fallback response if the API call fails
      return { 
        success: false, 
        data: [] 
      };
    }
  }
};

// User API
export const userAPI = {
  getUserByAddress: async (address: string) => {
    const response = await api.get(`/users/${address}`);
    return response.data;
  },
  
  updateUser: async (address: string, userData: unknown) => {
    const response = await api.put(`/users/${address}`, userData);
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  
  getUserStats: async (address: string) => {
    const response = await api.get(`/users/stats/${address}`);
    return response.data;
  },
  
  getTopTraders: async (limit = 6) => {
    try {
      console.log(`Fetching top traders, limit: ${limit}`);
      const response = await api.get(`/users/top-traders?limit=${limit}`);
      
      if (!response.data || !response.data.success) {
        console.warn('Top traders API response was not successful:', response.data);
        return { success: false, data: [] };
      }
      
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.warn('Top traders API returned invalid data format:', response.data);
        return { success: true, data: [] };
      }
      
      console.log(`Received ${response.data.data.length} top traders from API`);
      return response.data;
    } catch (error) {
      console.error("Error fetching top traders:", error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      // Return empty array for consistent handling
      return { success: false, data: [] };
    }
  },
  
  followUser: async (followerAddress: string, followingAddress: string) => {
    try {
      console.log(`User ${followerAddress} following ${followingAddress}`);
      const response = await api.post(`/users/follow`, {
        followerAddress,
        followingAddress
      });
      return response.data;
    } catch (error) {
      console.error("Error following user:", error);
      return { success: false, message: "Failed to follow user" };
    }
  },
  
  unfollowUser: async (followerAddress: string, followingAddress: string) => {
    try {
      console.log(`User ${followerAddress} unfollowing ${followingAddress}`);
      const response = await api.post(`/users/unfollow`, {
        followerAddress,
        followingAddress
      });
      return response.data;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return { success: false, message: "Failed to unfollow user" };
    }
  },
  
  getFollowStatus: async (followerAddress: string, followingAddress: string) => {
    try {
      const response = await api.get(`/users/follow-status`, {
        params: { followerAddress, followingAddress }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting follow status:", error);
      return { isFollowing: false, success: false };
    }
  }
};

// Collection API
export const collectionAPI = {
  getAllCollections: async (params?: unknown) => {
    const response = await api.get("/collections", { params });
    return response.data;
  },
  
  getCollectionById: async (id: string) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },
  
  createCollection: async (collectionData: Partial<Collection>) => {
    const response = await api.post("/collections", collectionData);
    return response.data;
  },
  
  updateCollection: async (id: string, updateData: Partial<Collection>) => {
    const response = await api.put(`/collections/${id}`, updateData);
    return response.data;
  },
  
  getCollectionsByCreator: async (address: string) => {
    const response = await api.get(`/collections/creator/${address}`);
    return response.data;
  },
  
  addNFTToCollection: async (collectionId: string, nftId: string, address: string) => {
    const response = await api.post("/collections/add-nft", { 
      collectionId, 
      nftId,
      address 
    });
    return response.data;
  }
};

// Transaction API
export const transactionAPI = {
  getAllTransactions: async (params?: unknown) => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },
  
  getTransactionsByUser: async (address: string) => {
    const response = await api.get(`/transactions/user/${address}`);
    return response.data;
  },
  
  getTransactionsByNFT: async (nftId: string) => {
    const response = await api.get(`/transactions/nft/${nftId}`);
    return response.data;
  },
  
  createTransaction: async (transactionData: Partial<Transaction>) => {
    const response = await api.post("/transactions", transactionData);
    return response.data;
  },
  
  getRecentTransactions: async (limit?: number) => {
    const response = await api.get("/transactions/recent", { 
      params: { limit } 
    });
    return response.data;
  }
};

// Export all APIs
export default {
  nft: nftAPI,
  user: userAPI,
  collection: collectionAPI,
  transaction: transactionAPI
};

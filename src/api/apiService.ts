import axios from "axios";
import { NFT, Transaction, Collection, Creator } from "@/types";

// API URL - Updated to work in development environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const response = await api.get(`/nfts/token/${tokenId}`);
    return response.data;
  },
  
  createNFT: async (nftData: Partial<NFT>) => {
    const response = await api.post("/nfts", nftData);
    return response.data;
  },
  
  updateNFT: async (tokenId: number, updateData: Partial<NFT>) => {
    const response = await api.put(`/nfts/${tokenId}`, updateData);
    return response.data;
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
    const response = await api.get(`/nfts/creator/${address}`);
    return response.data;
  },
  
  getTransactionHistory: async (tokenId: number) => {
    const response = await api.get(`/nfts/transactions/${tokenId}`);
    return response.data;
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


import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Web3State } from '@/types';
import { toast } from 'sonner';

// Initial state
const initialState: Web3State = {
  account: null,
  isConnected: false,
  chain: null,
  sFuelBalance: 0,
  usdcBalance: 0,
  isLoading: false,
  hasRequestedSFuel: false,
  error: null
};

// Create context
const Web3Context = createContext<{
  web3State: Web3State;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  requestSFuel: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}>({
  web3State: initialState,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  requestSFuel: async () => {},
  switchNetwork: async () => {},
});

// Provider component
export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>(initialState);
  
  // Mock function to simulate wallet connection
  const connectWallet = async () => {
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      // Mock connection - in a real app, you would use ethers.js or web3.js
      setTimeout(() => {
        const mockAccount = '0x' + Math.random().toString(16).slice(2, 42);
        setWeb3State(prev => ({
          ...prev,
          account: mockAccount,
          isConnected: true,
          chain: 1,
          sFuelBalance: 0.01,
          usdcBalance: 100,
          isLoading: false
        }));
        toast.success('Wallet connected successfully');
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setWeb3State(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3State(initialState);
    toast.info('Wallet disconnected');
  };

  // Request sFuel
  const requestSFuel = async () => {
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      // Mock request - in a real app, you would call the faucet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWeb3State(prev => ({
        ...prev,
        sFuelBalance: prev.sFuelBalance + 0.1,
        hasRequestedSFuel: true,
        isLoading: false
      }));
      
      toast.success('sFuel received successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request sFuel';
      setWeb3State(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
    }
  };

  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      // Mock switch - in a real app, you would use wallet methods
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeb3State(prev => ({
        ...prev,
        chain: chainId,
        isLoading: false
      }));
      
      toast.success(`Switched to network ID: ${chainId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      setWeb3State(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast.error(errorMessage);
    }
  };

  // Check if wallet is already connected (e.g., from local storage)
  useEffect(() => {
    const checkConnection = async () => {
      // In a real app, you would check if the user is already connected
      // For now, we'll just initialize as disconnected
    };
    
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3State,
        connectWallet,
        disconnectWallet,
        requestSFuel,
        switchNetwork
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

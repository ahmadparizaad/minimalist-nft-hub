import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '@/types';
import { toast } from 'sonner';
import axios from 'axios';
import { contractAddress, abi } from './secret_final';
import { nftAPI } from '@/api/apiService';
import { checkSufficientSFuel } from "@/utils/web3";

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

// Miner class for sFuel mining
class Miner {
  static MAX_NUMBER = ethers.constants.MaxUint256;

  async mineGasForTransaction(nonce: number | string, gasAmount: number, address: string) {
    // Convert nonce to a number if necessary
    nonce = typeof nonce === 'string' && ethers.utils.isHexString(nonce) ? Number(nonce) : nonce;
    gasAmount = Number(gasAmount);
    return await this.mineFreeGas(gasAmount, address, nonce);
  }

  async mineFreeGas(gasAmount: number, address: string, nonce: number | string) {
    const nonceHash = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.hexZeroPad(ethers.utils.hexlify(Number(nonce)), 32)));
    const addressHash = ethers.BigNumber.from(ethers.utils.keccak256(address));
    const nonceAddressXOR = nonceHash.xor(addressHash);
    const divConstant = Miner.MAX_NUMBER;
    let candidate;
    let iterations = 0;

    for(;;) {
      candidate = ethers.utils.randomBytes(32);
      const candidateHash = ethers.BigNumber.from(ethers.utils.keccak256(candidate));
      const resultHash = nonceAddressXOR.xor(candidateHash);
      const externalGas = divConstant.div(resultHash);
      
      if (externalGas.gte(ethers.BigNumber.from(gasAmount))) {
        break;
      }
      iterations++;
      if (iterations % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    return { gasPrice: ethers.BigNumber.from(candidate), iterations };
  }
}

/**
 * claimSFuel - Claims sFUEL using PoW distribution.
 */
async function claimSFuel(
  distributionContractAddress: string, 
  functionSignature: string, 
  targetAddress: string, 
  provider: ethers.providers.Provider
) {
  // Create a random wallet (no sFUEL required)
  const randomWallet = ethers.Wallet.createRandom().connect(provider);
  const nonce = await provider.getTransactionCount(randomWallet.address);
  const gasLimit = ethers.BigNumber.from("100000"); // Example gas limit

  const miner = new Miner();
  const { gasPrice, iterations } = await miner.mineGasForTransaction(nonce, Number(gasLimit), randomWallet.address);
  console.log("Mined gasPrice:", gasPrice.toString(), "iterations:", iterations);

  // Build data payload: function signature + target address (padded)
  const paddedAddress = targetAddress.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const data = functionSignature + paddedAddress;

  const txRequest = {
    to: distributionContractAddress,
    data: data,
    gasLimit: gasLimit,
    gasPrice: gasPrice
  };

  console.log("Sending sFUEL claim transaction:", txRequest);
  const txResponse = await randomWallet.sendTransaction(txRequest);
  await txResponse.wait();
  console.log("sFUEL successfully claimed, tx hash:", txResponse.hash);
  return txResponse;
}

// Create context
const Web3Context = createContext<{
  web3State: Web3State;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  requestSFuel: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  mintNFT: (data: { ipfsHash: string, price: string, royaltyFee: string, title?: string, description?: string }) => Promise<unknown>;
  buyNFT: (tokenId: number) => Promise<void>;
  getAllNFTs: () => Promise<unknown[]>;
  getNFTDetails: (tokenId: number) => Promise<unknown>;
  getMyNFTs: () => Promise<unknown[]>;
  getTransactionHistory: (tokenId: number) => Promise<string[]>;
  updateBalances: () => Promise<void>;
}>({
  web3State: initialState,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  requestSFuel: async () => {},
  switchNetwork: async () => {},
  mintNFT: async () => ({}),
  buyNFT: async () => {},
  getAllNFTs: async () => [],
  getNFTDetails: async () => ({}),
  getMyNFTs: async () => [],
  getTransactionHistory: async () => [],
  updateBalances: async () => {}
});

// Provider component
export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>(initialState);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [nfts, setNfts] = useState<unknown[]>([]);
  const [myNfts, setMyNfts] = useState<unknown[]>([]);
  
  const SKALE_CHAIN_ID = "0x3a14269b"; // SKALE network chain ID in hex
  const SKALE_RPC_URL = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet";
  const DISTRIBUTION_CONTRACT = "0x62Fe932FF26e0087Ae383f6080bd2Ed481bA5A8A"; // sFUEL Distribution contract
  const FUNCTION_SIGNATURE = "0x0c11dedd"; // sFUEL claim function signature
  const USDC_CONTRACT_ADDRESS = "0x2aebcdc4f9f9149a50422fff86198cb0939ea165"; // USDC on SKALE
  
  const getSkaleProvider = async () => {
    try {
      // Creating a custom network definition to avoid ENS lookups
      const customNetwork = {
        name: "SKALE Calypso Hub Testnet",
        chainId: parseInt(SKALE_CHAIN_ID, 16),
        ensAddress: null  // Set to null to disable ENS lookups
      };
      
      const skaleProvider = new ethers.providers.JsonRpcProvider(SKALE_RPC_URL, customNetwork);
      console.log("SKALE provider initialized:", skaleProvider);
      setProvider(skaleProvider);
      return skaleProvider;
    } catch (error) {
      console.error("Failed to load SKALE provider:", error);
      setWeb3State(prev => ({ ...prev, error: "Failed to load SKALE provider" }));
      throw error;
    }
  };

  const getSkaleContract = async () => {
    try {
      const skaleProvider = await getSkaleProvider();
      const contractInstance = new ethers.Contract(contractAddress, abi, skaleProvider);
      console.log("Contract initialized:", contractInstance);
      setContract(contractInstance);
      return contractInstance;
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      setWeb3State(prev => ({ ...prev, error: "Failed to initialize contract" }));
      throw error;
    }
  };

  const switchToSkaleNetwork = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      
      // Try to switch to the SKALE network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SKALE_CHAIN_ID }]
      });
      console.log("Switched to SKALE network");
    } catch (error) {
      // 4902 error code indicates the chain has not been added
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SKALE_CHAIN_ID,
              chainName: "SKALE Calypso Hub Testnet",
              nativeCurrency: {
                name: "sFUEL",
                symbol: "sFUEL",
                decimals: 18
              },
              rpcUrls: [SKALE_RPC_URL],
              blockExplorerUrls: ['https://giant-half-dual-testnet.explorer.testnet.skalenodes.com']
            }]
          });
          // After adding, try switching again
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SKALE_CHAIN_ID }]
          });
          console.log("Added and switched to SKALE network");
        } catch (addError) {
          console.error("Failed to add SKALE network", addError);
          throw addError;
        }
      } else {
        console.error("Failed to switch to SKALE network", error);
        throw error;
      }
    }
  };
  
  // Connect wallet
  const connectWallet = async () => {
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      if (!window.ethereum) {
        if (/Mobi|Android|Tablet|iPad|iPhone/i.test(navigator.userAgent)) {
          toast("Open MetaMask", {duration: 2000});
          window.location.href = "https://metamask.app.link/dapp/napft.com"; // Update with your URL
          return;
        } else {
          toast.error("Please install Metamask extension in your browser");
          throw new Error('Please install MetaMask');
        }
      }

      // Check current network
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== SKALE_CHAIN_ID) {
        // Switch to SKALE network
        await switchToSkaleNetwork();
      }
   
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountAddress = accounts[0];
      
      // Create a custom network definition to avoid ENS lookups
      const customNetwork = {
        name: "SKALE Calypso Hub Testnet",
        chainId: parseInt(SKALE_CHAIN_ID, 16),
        ensAddress: null  // Set to null to disable ENS lookups
      };
      
      const browserProvider = new ethers.providers.Web3Provider(window.ethereum, customNetwork);
      const signerInstance = browserProvider.getSigner();
      const contractWithSigner = new ethers.Contract(contractAddress, abi, signerInstance);
      
      setProvider(browserProvider);
      setSigner(signerInstance);
      setContract(contractWithSigner);
      
      // Get sFuel balance
      const sFuelBalance = parseFloat(
        ethers.utils.formatEther(await browserProvider.getBalance(accountAddress))
      );

      // Get USDC balance
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        ['function balanceOf(address owner) view returns (uint256)'],
        browserProvider
      );
      const usdcBalance = parseFloat(
        ethers.utils.formatUnits(await usdcContract.balanceOf(accountAddress), 6)
      );
      
      setWeb3State({
        account: accountAddress,
        isConnected: true,
        chain: parseInt(SKALE_CHAIN_ID, 16),
        sFuelBalance,
        usdcBalance,
        isLoading: false,
        hasRequestedSFuel: false,
        error: null
      });
      
      toast.success("Wallet Connected Successfully");

      // if (!checkSufficientSFuel(sFuelBalance)) {
      //   await new Promise((resolve) => setTimeout(resolve, 4000));
      //   toast.error("Filling sFuel");
      //   await requestSFuel();
      // }
      
      // Fetch NFTs after successful connection
      getAllNFTs();
      
    } catch (error) {
      console.error("Wallet connection error:", error);
      setWeb3State({
        ...initialState,
        error: (error instanceof Error ? error.message : String(error)),
        isLoading: false
      });
      toast.error("Failed to connect wallet: " + error.message);
    } finally {
      // Ensure isLoading is reset in all cases
      setWeb3State((prev) => ({ ...prev, isLoading: false }));
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setWeb3State(initialState);
    setContract(null);
    setSigner(null);
    toast.info('Wallet disconnected');
  };
  
  // Request sFuel
  const requestSFuel = async () => {
    try {
      
      if (!web3State.account) {
        toast.error("Please connect your wallet first");
        return;
      }
      
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      await claimSFuel(
        DISTRIBUTION_CONTRACT,
        FUNCTION_SIGNATURE,
        web3State.account,
        provider as ethers.providers.Provider
      );
      
      // Update sFuel balance
      if (provider && web3State.account) {
        const newBalance = parseFloat(
          ethers.utils.formatEther(await provider.getBalance(web3State.account))
        );
        
        setWeb3State(prev => ({
          ...prev,
          sFuelBalance: newBalance,
          hasRequestedSFuel: true,
          isLoading: false
        }));
      }
      
      toast.success('sFuel received successfully');
    } catch (error: unknown) {
      console.error("Error requesting sFuel:", error);
      setWeb3State(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        isLoading: false 
      }));
      toast.error('Failed to request sFuel: ' + (error as Error).message);
    }
  };
  
  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      
      const chainIdHex = `0x${chainId.toString(16)}`;
      
      // Try to switch to the requested network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });
      
      // If we successfully switched, update the chain in the state
      setWeb3State(prev => ({
        ...prev,
        chain: chainId,
        isLoading: false
      }));
      
      toast.success(`Switched to network ID: ${chainId}`);
    } catch (error: unknown) {
      console.error("Failed to switch network:", error);
      setWeb3State(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        isLoading: false 
      }));
      toast.error('Failed to switch network: ' + (error as Error).message);
    }
  };
  
  // Get all NFTs from the contract
  const getAllNFTs = async () => {
    try {
      if (!contract) {
        console.error("Contract is not defined");
        return [];
      }
  
      const tokenCount = await contract.GetCurrentToken();
      const tokenId = tokenCount.toNumber();
      console.log("Total NFTs:", tokenId);
  
      const nftsArray = [];
  
      for (let i = tokenId; i >= 1; i--) {
        const nftDetails = await contract.getNFTDetails(i);
  
        const nft = {
          id: i,
          tokenId: i,
          creator: nftDetails.creator,
          owner: nftDetails.owner,
          price: parseFloat(ethers.utils.formatUnits(nftDetails.price, 6)),
          paymentToken: nftDetails.paymentToken,
          ipfsHash: nftDetails.ipfsHash,
          image: `https://gateway.pinata.cloud/ipfs/${nftDetails.ipfsHash}`,
          metadataURI: `https://gateway.pinata.cloud/ipfs/${nftDetails.ipfsHash}`,
          royaltyFee: parseFloat(ethers.utils.formatUnits(nftDetails.royaltyFee, 6)),
          transactionHistory: nftDetails.transactionHistory,
          currency: 'USDC',
          title: `NFT #${i}`,
          description: "NFT Description",
          category: "Art",
          rarity: "Common",
          tokenStandard: "ERC-721",
          isListed: true,
          createdAt: new Date().toISOString(),
          attributes: [
            { trait_type: "Level", value: i },
            { trait_type: "Background", value: "Blue" }
          ]
        };
  
        nftsArray.push(nft);
      }
  
      return nftsArray;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Failed to load NFTs: " + error.message);
      return [];
    }
  };
  
  
  // Get details of a specific NFT
  const getNFTDetails = async (tokenId: number) => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      
      const nftDetails = await contract.getNFTDetails(tokenId);
      
      const nft = {
        id: tokenId,
        tokenId: tokenId,
        creator: nftDetails.creator,
        owner: nftDetails.owner,
        price: parseFloat(ethers.utils.formatUnits(nftDetails.price, 6)),
        paymentToken: nftDetails.paymentToken,
        ipfsHash: nftDetails.ipfsHash,
        image: `https://gateway.pinata.cloud/ipfs/${nftDetails.ipfsHash}`,
        metadataURI: `https://gateway.pinata.cloud/ipfs/${nftDetails.ipfsHash}`,
        royaltyFee: parseFloat(ethers.utils.formatUnits(nftDetails.royaltyFee, 6)),
        transactionHistory: nftDetails.transactionHistory,
        currency: 'USDC',
        title: `NFT #${tokenId}`, 
        description: "NFT Description", 
        category: "Art", 
        rarity: "Common",
        tokenStandard: "ERC-721",
        isListed: true,
        createdAt: new Date().toISOString(),
        attributes: [
          { trait_type: "Level", value: tokenId },
          { trait_type: "Background", value: "Blue" }
        ]
      };
      
      return nft;
    } catch (error: unknown) {
      console.error("Error fetching NFT details:", error);
      toast.error("Failed to load NFT details: " + (error as Error).message);
      return null;
    }
  };
  
  // Get transaction history for a specific NFT
  const getTransactionHistory = async (tokenId: number) => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized");
      }
      
      const nftDetails = await contract.getNFTDetails(tokenId);
      const transactions = nftDetails.transactionHistory
      console.log("Transaction history for NFT #", tokenId, ":", transactions);
      return transactions;
    } catch (error: unknown) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to load transaction history: " + (error as Error).message);
      return [];
    }
  };
  
  // Get NFTs owned by the connected account
  const getMyNFTs = async () => {
    try {
      if (!contract || !web3State.account) {
        console.error("Contract not initialized or wallet not connected");
        return [];
      }
    
      const tokenCount = await contract.GetCurrentToken();
      const tokenId = tokenCount.toNumber();
    
      // Fetch all NFTs in parallel using Promise.all
      const nftsData = await Promise.all(
        Array.from({ length: tokenId }, async (_, index) => {
          const i = index + 1; // Start from tokenId 1
          const nft = await contract.getNFTDetails(i);
          
          // Compare addresses in lowercase to avoid case mismatch issues
          if (nft.owner.toLowerCase() === web3State.account?.toLowerCase()) {
            return {
              id: i,
              tokenId: i,
              creator: nft.creator,
              owner: nft.owner,
              price: parseFloat(ethers.utils.formatUnits(nft.price, 6)),
              paymentToken: nft.paymentToken,
              ipfsHash: nft.ipfsHash,
              image: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
              metadataURI: `https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`,
              royaltyFee: parseFloat(ethers.utils.formatUnits(nft.royaltyFee, 6)),
              transactionHistory: nft.transactionHistory,
              currency: 'USDC',
              title: `NFT #${i}`, // These would come from IPFS metadata in a real implementation
              description: "NFT Description", // These would come from IPFS metadata in a real implementation
              category: "Art", // These would come from IPFS metadata in a real implementation
              rarity: "Common", // These would come from IPFS metadata in a real implementation
              tokenStandard: "ERC-721",
              isListed: true,
              createdAt: new Date().toISOString(),
              attributes: [
                { trait_type: "Level", value: i },
                { trait_type: "Background", value: "Blue" }
              ]
            };
          }
          return null; // Ignore if not owned
        })
      );
    
      // Remove null values (NFTs not owned by the connected account)
      const myNftsList = nftsData.filter((nft) => nft !== null) as unknown[];
    
      setMyNfts(myNftsList);
      return myNftsList;
    
    } catch (error: unknown) {
      console.error("Error fetching my NFTs:", error);
      toast.error("Failed to load your NFTs: " + (error as Error).message);
      return [];
    }
  };
  
  // Mint a new NFT
  const mintNFT = async ({
    ipfsHash,
    price,
    royaltyFee,
    title = "My NFT",
    description = "Some Description...."
  }: {
    ipfsHash: string,
    price: string,
    royaltyFee: string,
    title?: string,
    description?: string
  }) => {
    if (!web3State.account || !signer || !contract) {
      toast.error("Please connect your wallet first");
      return null;
    }
  
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
  
      const paymentToken = USDC_CONTRACT_ADDRESS;
      const tokenDecimals = 6;
  
      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        toast.error("Price must be greater than zero");
        return null;
      }
  
      const formattedPrice = ethers.utils.parseUnits(parseFloat(price).toFixed(6), tokenDecimals);
      const formattedRoyaltyFee = Number(royaltyFee);
  
      if (isNaN(formattedRoyaltyFee) || formattedRoyaltyFee < 0 || formattedRoyaltyFee > 255) {
        toast.error("Royalty fee must be between 0 and 255");
        return null;
      }
  
      // Request sFuel if needed
      if (web3State.sFuelBalance <= 0.001) {
        console.log("Requesting sFuel...");
        await requestSFuel();
      }
  
      const contractWithSigner = contract.connect(signer);
  
      toast.loading("Please confirm transaction in your wallet...", { id: "mint-nft" });
  
      const tx = await contractWithSigner.createToken(ipfsHash, formattedPrice, formattedRoyaltyFee, paymentToken);
  
      toast.loading("Transaction submitted. Waiting for confirmation...", { id: "mint-nft" });
  
      const receipt = await tx.wait();
  
      // Extract Token ID
      const tokenId = receipt.events.find(
        (event: { event: string; args: [string, string, ethers.BigNumber] }) =>
          event.event === "Transfer"
      )?.args[2].toString();
  
      if (!tokenId) {
        throw new Error("Failed to get token ID from transaction receipt");
      }
  
      const nftDetails = await contract.getNFTDetails(tokenId);
  
      const newNft = {
        tokenId: Number(tokenId),
        title,
        description,
        image: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        price: parseFloat(ethers.utils.formatUnits(nftDetails.price, 6)),
        owner: nftDetails.owner,
        creator: nftDetails.owner,
        royaltyFee: parseFloat(royaltyFee),
        isListed: true,
        category: "Art",
        rarity: "Common",
        tokenStandard: "ERC-721" as const,
        ipfsHash,
        metadataURI: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        txHash: tx.hash
      };
  
      try {
        await nftAPI.createNFT(newNft);
      } catch (dbError) {
        console.error("Error saving NFT to database:", dbError);
        toast.error("NFT minted but failed to save details to database");
      }
  
      toast.success("NFT minted successfully!", { id: "mint-nft" });
  
      getAllNFTs();
  
      return newNft;
    } catch (error: unknown) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT: " + (error as Error).message, { id: "mint-nft" });
      return null;
    } finally {
      setWeb3State(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  
  // Buy an NFT
  const buyNFT = async (tokenId: number) => {
    if (!web3State.account || !signer || !contract) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      setWeb3State(prev => ({ ...prev, isLoading: true }));
      
      const contractWithSigner = contract.connect(signer);
      
      // Check if user is the owner of the NFT
      const nftOwner = await contractWithSigner.ownerOf(tokenId);
      
      if (nftOwner.toLowerCase() === web3State.account.toLowerCase()) {
        toast.error("You can't buy your own NFT");
        setWeb3State(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Get the price of the NFT
      const price = await contract.GetNftPrice(tokenId);
      const tokenDecimals = 6;
      console.log("NFT Price in Wei:", price.toString());
      console.log("NFT Price in USDC:", ethers.utils.formatUnits(price, tokenDecimals));
      
      // Get USDC Contract instance
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      );
      
      // Approve NFT Marketplace Contract to spend USDC
      // toast.info("Approving USDC spend...");
      const approvalTx = await usdcContract.approve(contractAddress, price);
      await approvalTx.wait();
      console.log("Approval Successful");
      
      // Buy the NFT
      toast.info("Purchasing NFT...");
      const tx = await contractWithSigner.buy(tokenId);
      await tx.wait();
      
      // After successful on-chain purchase, update the backend
      try {
        // Call the API to update the backend
        const res = await nftAPI.buyNFT(tokenId, web3State.account || "", "");
        console.log("Backend updated with purchase:", res);
      } catch (apiError) {
        console.error("Error updating backend after purchase:", apiError);
        // Don't throw here, we still want to consider the purchase successful
        // since the blockchain transaction went through
      }
      
      // Update the NFTs list
      getAllNFTs();
      
      setWeb3State(prev => ({ ...prev, isLoading: false }));
      toast.success("You successfully purchased this NFT!");
      
    } catch (error) {
      console.error("Error buying NFT:", error);
      
      let errorMessage = "Transaction failed";
      
      if (error.data?.message === 'ERC20: transfer amount exceeds balance') {
        errorMessage = "Insufficient USDC balance";
      } else if (error.data?.message === 'Cannot buy your own NFT') {
        errorMessage = "You can't buy your own NFT";
      }
      
      setWeb3State(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  };
  
  // Check if wallet is connected on load
  const isWalletConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if ((accounts as string[]).length) {
          const accountAddress = accounts[0];
          
          // Create a custom network definition to avoid ENS lookups
          const customNetwork = {
            name: "SKALE Calypso Hub Testnet",
            chainId: parseInt(SKALE_CHAIN_ID, 16),
            ensAddress: null  // Set to null to disable ENS lookups
          };
          
          const browserProvider = new ethers.providers.Web3Provider(window.ethereum, customNetwork);
          const signerInstance = browserProvider.getSigner();
          const contractWithSigner = new ethers.Contract(contractAddress, abi, signerInstance);
          
          setProvider(browserProvider);
          setSigner(signerInstance);
          setContract(contractWithSigner);
          
          // Get sFuel balance
          const sFuelBalance = parseFloat(
            ethers.utils.formatEther(await browserProvider.getBalance(accountAddress))
          );
          
          // Get USDC balance
          const usdcContract = new ethers.Contract(
            USDC_CONTRACT_ADDRESS,
            ['function balanceOf(address owner) view returns (uint256)'],
            browserProvider
          );
          const usdcBalance = parseFloat(
            ethers.utils.formatUnits(await usdcContract.balanceOf(accountAddress), 6)
          );
          
          setWeb3State({
            account: accountAddress,
            isConnected: true,
            chain: parseInt(await browserProvider.send("eth_chainId", []), 16),
            sFuelBalance,
            usdcBalance,
            isLoading: false,
            hasRequestedSFuel: false,
            error: null
          });
          
          // Fetch NFTs
          getAllNFTs();
        }
        
        // Setup event listeners for wallet events
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        
        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet(); // Reconnect with the new account
          } else {
            disconnectWallet(); // User disconnected their wallet
          }
        });
      }
    } catch (error: unknown) {
      console.error("Failed to check wallet connection:", error);
    }
  };
  
  // Initialize contract and check wallet connection on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await getSkaleContract();
        await isWalletConnected();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    
    initialize();
    
    // Cleanup event listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // useEffect(() => {
  //   const updateBalances = async () => {
  //     if (provider && web3State.account) {
  //       try {
  //         // Update sFuel balance
  //         const newSFuelBalance = parseFloat(
  //           ethers.utils.formatEther(await provider.getBalance(web3State.account))
  //         );

  //         // Update USDC balance
  //         const usdcContract = new ethers.Contract(
  //           USDC_CONTRACT_ADDRESS,
  //           ['function balanceOf(address owner) view returns (uint256)'],
  //           provider
  //         );
  //         const newUSDCBalance = parseFloat(
  //           ethers.utils.formatUnits(await usdcContract.balanceOf(web3State.account), 6)
  //         );

  //         setWeb3State((prev) => ({
  //           ...prev,
  //           sFuelBalance: newSFuelBalance,
  //           usdcBalance: newUSDCBalance,
  //         }));
  //       } catch (error) {
  //         console.error("Error updating balances:", error);
  //       }
  //     }
  //   };

  //   // Listen for account changes or balance updates
  //   if (window.ethereum) {
  //     window.ethereum.on('accountsChanged', updateBalances);
  //     window.ethereum.on('chainChanged', updateBalances);
  //   }

  //   // Cleanup listeners on unmount
  //   return () => {
  //     if (window.ethereum) {
  //       window.ethereum.removeListener('accountsChanged', updateBalances);
  //       window.ethereum.removeListener('chainChanged', updateBalances);
  //     }
  //   };
  // }, [provider, web3State.account]);

// Function to update balances
const updateBalances = async () => {
  if (provider && web3State.account) {
    try {
      // Update sFuel balance
      const newSFuelBalance = parseFloat(
        ethers.utils.formatEther(await provider.getBalance(web3State.account))
      );

      // Update USDC balance
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        ['function balanceOf(address owner) view returns (uint256)'],
        provider
      );
      const newUSDCBalance = parseFloat(
        ethers.utils.formatUnits(await usdcContract.balanceOf(web3State.account), 6)
      );

      setWeb3State((prev) => ({
        ...prev,
        sFuelBalance: newSFuelBalance,
        usdcBalance: newUSDCBalance,
      }));
    } catch (error) {
      console.error("Error updating balances:", error);
    }
  }
};

  return (
    <Web3Context.Provider
      value={{
        web3State,
        connectWallet,
        disconnectWallet,
        requestSFuel,
        switchNetwork,
        mintNFT,
        buyNFT,
        getAllNFTs,
        getNFTDetails,
        getMyNFTs,
        getTransactionHistory,
        updateBalances,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

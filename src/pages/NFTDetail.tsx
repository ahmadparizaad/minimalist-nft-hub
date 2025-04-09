import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatAddress, formatPrice, checkSufficientBalance, checkSufficientSFuel } from "@/utils/web3";
import { toast } from "sonner";
import { useWeb3 } from "@/context/Web3Context";
import { NFT, Transaction, Creator } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag, Repeat, Shield, ExternalLink, Share2 } from "lucide-react";
import { contractAddress } from "@/context/secret_final";
import { nftAPI, userAPI } from "@/api/apiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const getFallbackImage = (address: string) => 
  `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#${address.slice(2,8)}"/></svg>`)}`;

export default function NFTDetail() {
  const { id } = useParams<{ id: string }>();
  const { web3State, connectWallet, requestSFuel, buyNFT: buyNFTOnChain } = useWeb3();
  const { isConnected, account, sFuelBalance, usdcBalance } = web3State;
  const navigate = useNavigate();
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Creator | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<Creator | null>(null);
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEnjoyingDialog, setShowEnjoyingDialog] = useState(false);
  const itemsPerPage = 10;

  const isOwner = useMemo(
    () => isConnected && account?.toLowerCase() === nft?.owner?.toLowerCase(),
    [isConnected, account, nft?.owner]
  );

  useEffect(() => {
    const fetchNFTData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        const response = await nftAPI.getNFTById(id);
        const nftDetails = response.data;
        
        if (nftDetails) {
          setNft(nftDetails);
          
          // Preload main image
          if (nftDetails.image) {
            const img = new Image();
            img.src = nftDetails.image;
          }

          // Parallel profile fetching
          try {
            const [creatorResponse, ownerResponse] = await Promise.all([
              userAPI.getUserByAddress(nftDetails.creator),
              userAPI.getUserByAddress(nftDetails.owner)
            ]);
            
            if (creatorResponse?.data) setCreatorProfile(creatorResponse.data);
            if (ownerResponse?.data) setOwnerProfile(ownerResponse.data);
          } catch (error) {
            console.error("Error fetching profiles:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        toast.error("Failed to load NFT details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTData();
  }, [id]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!nft?.tokenId) return;
      setIsLoadingHistory(true);
      try {
        const txHistory = await nftAPI.getTransactionHistory(nft.tokenId);
        interface RawTransaction {
          type: string;
          from?: string;
          to?: string;
          price?: string;
          timestamp?: string;
        }

        const formattedTxs: Transaction[] = txHistory.data.map((tx: RawTransaction, index: number) => ({
          id: `tx-${index}`,
          type: tx.type,
          nftId: id,
          from: tx.from || '',
          to: tx.to || '',
          price: parseFloat(tx.price || '0'),
          currency: 'USDC',
          timestamp: tx.timestamp || new Date().toISOString(),
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`
        }));
        setTransactions(formattedTxs);
      } catch (error) {
        console.error("Error loading transaction history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [nft?.tokenId, id]);

  const handlePurchase = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isConnected || !nft || isOwner) {
      if (!isConnected) toast.error("Please connect your wallet first");
      if (isOwner) toast.error("You already own this NFT");
      return;
    }

    if (!checkSufficientBalance(usdcBalance, nft.price)) {
      setShowInsufficientFundsDialog(true);
      return;
    }

    setIsPurchasing(true);
    try {
      if (!checkSufficientSFuel(sFuelBalance)) {
        requestSFuel();
        return;
      }

      await buyNFTOnChain(parseInt(nft.tokenId.toString()));
      const updatedNftResponse = await nftAPI.getNFTById(id || "");
      setNft(updatedNftResponse.data);

      // Show the "Enjoying" dialog
      setShowEnjoyingDialog(true);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      toast.error("Failed to purchase NFT");
    } finally {
      setIsPurchasing(false);
    }
  };

  const formattedTransactions = useMemo(() => 
    transactions.slice(0, currentPage * itemsPerPage).map(tx => ({
      ...tx,
      timeAgo: formatTimeAgo(tx.timestamp)
    })), [transactions, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-6xl py-12">
            <div className="h-96 rounded-xl bg-muted animate-pulse"></div>
            <div className="mt-8 h-8 w-1/3 rounded-md bg-muted animate-pulse"></div>
            <div className="mt-4 h-24 rounded-md bg-muted animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-6xl py-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">NFT Not Found</h1>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  function formatTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    const intervals = [
      { label: 'year', duration: 31536000000 },
      { label: 'month', duration: 2628000000 },
      { label: 'week', duration: 604800000 },
      { label: 'day', duration: 86400000 },
      { label: 'hour', duration: 3600000 },
      { label: 'minute', duration: 60000 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diff / interval.duration);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={nft.image || getFallbackImage(nft.creator)} 
                  alt={nft.name} 
                  className="object-cover w-full h-96" 
                />
              </div>
              <div className="mt-6">
                <h2 className="text-3xl font-semibold">{nft.name}</h2>
                <div className="mt-4 text-xl text-muted">{formatPrice(nft.price)} USDC</div>
                <div className="mt-4">
                  {nft.owner && (
                    <div className="flex items-center gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar>
                              <AvatarImage src={getFallbackImage(nft.owner)} />
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <h3>{nft.owner}</h3>
                              <p>{ownerProfile?.username}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-sm">Owned by {nft.owner}</p>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="details" className="mt-12">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="mt-4">
                    <p>{nft.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <div className="mt-4">
                    {isLoadingHistory ? (
                      <div className="animate-pulse">Loading transaction history...</div>
                    ) : (
                      <ul>
                        {formattedTransactions.map(tx => (
                          <li key={tx.id}>
                            <div className="flex justify-between">
                              <div>{tx.type}</div>
                              <div>{tx.timeAgo}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {isPurchasing ? (
                <Button disabled className="mt-8" fullWidth>
                  Processing Purchase...
                </Button>
              ) : (
                <Button onClick={handlePurchase} className="mt-8" fullWidth>
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

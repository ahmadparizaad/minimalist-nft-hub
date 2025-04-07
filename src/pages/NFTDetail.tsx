import { useEffect, useState, useMemo, useRef } from "react";
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
  const itemsPerPage = 5;

  const loaderRef = useRef<HTMLDivElement>(null);
const [hasMore, setHasMore] = useState(true);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    },
    { threshold: 1.0 }
  );

  if (loaderRef.current) {
    observer.observe(loaderRef.current);
  }

  return () => observer.disconnect();
}, [hasMore]);

useEffect(() => {
  setHasMore(currentPage * itemsPerPage < transactions.length);
}, [transactions, currentPage]);

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
          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 shadow-sm">
                <img loading="lazy"
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                  
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <img src="/skale-logo.svg" alt="SKALE" className="h-7 w-7" />
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none">
                    {nft.tokenStandard}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-black/30 text-white backdrop-blur-sm border-none rounded-full"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <p className="font-medium">#{nft.tokenId}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Royalty</p>
                  <p className="font-medium">{nft.royaltyFee.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(nft.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-4 mb-3">
                {/* <Badge variant="outline" className={nft.isListed ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}>
                  {nft.isListed ? "Listed" : "Not Listed"}
                </Badge> */}
                <Badge variant="secondary">{nft.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-display font-bold mb-3">{nft.title}</h1>
              <p className="text-muted-foreground mb-8">{nft.description}</p>

              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground mb-1">Creator</p>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/profile/${nft.creator}`}>
                            <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                              <AvatarImage loading="lazy"
                                src={creatorProfile?.profileImage || `https://source.unsplash.com/random/300x300?profile&sig=${nft.creator}`} 
                                alt={`${formatAddress(nft.creator)} profile`} 
                              />
                              <AvatarFallback>{nft.creator.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>View Creator Profile</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <a 
                      href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${nft.creator}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-500 hover:underline"
                    >
                      {formatAddress(nft.creator)}
                    </a>                  
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground mb-1">Owner</p>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/profile/${nft.owner}`}>
                            <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                              <AvatarImage loading="lazy"
                                src={ownerProfile?.profileImage || `https://source.unsplash.com/random/300x300?profile&sig=${nft.owner}`} 
                                alt={`${formatAddress(nft.owner)} profile`} 
                              />
                              <AvatarFallback>{nft.owner.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>View Owner Profile</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <a 
                      href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${nft.creator}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-500 hover:underline"
                    >
                      {formatAddress(nft.owner)}
                    </a>
                  </div>
                </div>
              </div>

              {nft.isListed ? (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-display font-bold">{formatPrice(nft.price, nft.currency)}</p>
                      </div>
                      {isOwner ? (
                        <Button variant="outline" className="border-green-500 text-green-500">
                          You Own This NFT
                        </Button>
                      ) : (
                        <Button
                          onClick={handlePurchase}
                          disabled={isPurchasing || !isConnected}
                          className="bg-primary text-white"
                          type="button"
                        >
                        {isPurchasing ? (
                            <div className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-50"></span>
                              Processing
                            </div>
                          ) : (
                            'Buy Now'
                          )}                        </Button>
                      )}
                    </div>
                    {!isConnected && (
                      <Button onClick={connectWallet} className="w-full">
                        Connect Wallet to Buy
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-medium text-red-500">Not Listed</p>
                      {isOwner && (
                        <Button 
                          variant="outline"
                          className="border-blue-500 text-blue-500"
                          onClick={() => navigate(`/update-nft/${nft.tokenId}`)}
                        >
                          List for Sale
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="history">
                <TabsList className="w-full">
                  <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
  <div className="space-y-4">
    {isLoadingHistory ? (
      <div className="text-center py-8">Loading history...</div>
    ) : formattedTransactions.length > 0 ? (
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto scrollbar-rounded">
          {formattedTransactions.map((tx, index) => (
            <div 
              key={tx.id} 
              className="flex items-center p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              ref={index === formattedTransactions.length - 1 ? loaderRef : null}
            >
              {tx.type === 'mint' && <Shield className="text-blue-500 mr-3" />}
              {tx.type === 'buy' && <ArrowRight className="text-green-500 mr-3" />}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">{tx.timeAgo}</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm">
                    {formatAddress(tx.from)} → {formatAddress(tx.to)}
                  </p>
                  {tx.price > 0 && <p className="text-sm font-medium">{formatPrice(tx.price, tx.currency)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        No transaction history found
      </div>
    )}
  </div>
</TabsContent>

                <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  {/* Contract Address */}
                  <div className="flex justify-between p-3">
                    <p>Contract Address</p>
                    <p className="font-mono">{formatAddress(contractAddress)}</p>
                  </div>

                  {/* Token ID */}
                  <div className="flex justify-between p-3">
                    <p>Token ID</p>
                    <p className="font-mono">#{nft.tokenId}</p>
                  </div>

                  {/* Token Standard */}
                  <div className="flex justify-between p-3">
                    <p>Token Standard</p>
                    <p>{nft.tokenStandard}</p>
                  </div>

                  {/* Royalty Fee */}
                  <div className="flex justify-between p-3">
                    <p>Royalty Fee</p>
                    <p>{nft.royaltyFee.toFixed(1)}%</p>
                  </div>

                  {/* Created Date */}
                  <div className="flex justify-between p-3">
                    <p>Created Date</p>
                    <p>{new Date(nft.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Category */}
                  <div className="flex justify-between p-3">
                    <p>Category</p>
                    <p>{nft.category}</p>
                  </div>

                  {/* View on Explorer */}
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/0xC202B26262b4a3110d3Df2617325c41DfB62933e`} 
                      target="_blank"
                      rel="noopener"
                    >
                      View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      <Dialog open={showInsufficientFundsDialog} onOpenChange={setShowInsufficientFundsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Funds</DialogTitle>
          </DialogHeader>
          <p>Bridge USDC tokens to the SKALE testnet.</p>
          <DialogFooter>
            <Button asChild>
              <a
                href="https://testnet.portal.skale.space/bridge?from=mainnet&to=giant-half-dual-testnet&token=usdc&type=erc20"
                target="_blank"
                rel="noopener"
              >
                Bridge Funds
              </a>
            </Button>
            <Button variant="outline" onClick={() => setShowInsufficientFundsDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnjoyingDialog} onOpenChange={setShowEnjoyingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
          </DialogHeader>
          <p>You have successfully purchased this NFT. Enjoy your new digital asset! 😍</p>
          <DialogFooter>
            <Button onClick={() => setShowEnjoyingDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
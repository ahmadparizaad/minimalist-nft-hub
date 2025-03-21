import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { formatAddress, formatPrice, checkSufficientBalance, checkSufficientSFuel } from "@/utils/web3";
import { toast } from "sonner";
import { useWeb3 } from "@/context/Web3Context";
import { NFT, Transaction } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag, Repeat, Shield, Info, ExternalLink, Share2, User, Image } from "lucide-react";
import { contractAddress } from "@/context/secret_final";
import { nftAPI, userAPI } from "@/api/apiService";

export default function NFTDetail() {
  const { id } = useParams<{ id: string }>();
  const { web3State, connectWallet, requestSFuel, getTransactionHistory, buyNFT: buyNFTOnChain } = useWeb3();
  const { isConnected, account, sFuelBalance, usdcBalance } = web3State;
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const fetchNFTData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        const response = await nftAPI.getNFTById(id);
        const nftDetails = response.data;
        
        if (nftDetails) {
          setNft(nftDetails);
          
          setIsOwner(isConnected && account?.toLowerCase() === nftDetails.owner?.toLowerCase());
          
          if (nftDetails.tokenId) {
            console.log(nftDetails.tokenId)
            const txHistory = await nftAPI.getTransactionHistory(nftDetails.tokenId);
            console.log(txHistory)
            
            const formattedTxs: Transaction[] = txHistory.data.map((tx: { type: string; from: string; to: string; price: string; timestamp: string }, index: number) => {
              return {
                id: `tx-${index}`,
                type: tx.type,
                nftId: id,
                from: tx.from || '',
                to: tx.to || '',
                price: parseFloat(tx.price || '0'),
                currency: 'USDC',
                timestamp: tx.timestamp || new Date().toISOString(),
                txHash: `0x${Math.random().toString(16).slice(2, 66)}`
              };
            });
            
            setTransactions(formattedTxs);
          }
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        toast.error("Failed to load NFT details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchNFTData();
    }
  }, [id, getTransactionHistory, account, isConnected]);

  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!nft) return;
    
    if (isOwner) {
      toast.error("You already own this NFT");
      return;
    }
    
    if (!checkSufficientSFuel(sFuelBalance)) {
      toast.error("Insufficient sFuel for transaction");
      requestSFuel();
      return;
    }
    
    if (!checkSufficientBalance(usdcBalance, nft.price)) {
      toast.error(
        "Insufficient balance to purchase this NFT. Please add more USDC to your wallet.",
        {
          action: {
            label: "Bridge USDC",
            onClick: () => window.open("https://bridge.skale.network/", "_blank"),
          },
        }
      );
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      await buyNFTOnChain(parseInt(nft.tokenId.toString()));
      
      await nftAPI.buyNFT(nft.tokenId, account || "", "");
      
      const updatedNftResponse = await nftAPI.getNFTById(id || "");
      setNft(updatedNftResponse.data);
      setIsOwner(true);
      
      toast.success("NFT purchased successfully!");
      
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'buy',
        nftId: nft._id,
        from: nft.owner,
        to: account ?? "",
        price: nft.price,
        currency: nft.currency,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`
      };
      
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      toast.error("Failed to purchase NFT");
    } finally {
      setIsPurchasing(false);
    }
  };

  const setAsProfileImage = async () => {
    if (!nft || !isOwner || !account) return;
    
    try {
      toast.loading("Setting as profile image...");
      
      await userAPI.updateUser(account, {
        address: account,
        profileImage: nft.image
      });
      
      toast.dismiss();
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.dismiss();
      toast.error("Failed to update profile image");
    }
  };

  const setAsBannerImage = async () => {
    if (!nft || !isOwner || !account) return;
    
    try {
      toast.loading("Setting as banner image...");
      
      await userAPI.updateUser(account, {
        address: account,
        coverImage: nft.image
      });
      
      toast.dismiss();
      toast.success("Banner image updated successfully");
    } catch (error) {
      console.error("Error updating banner image:", error);
      toast.dismiss();
      toast.error("Failed to update banner image");
    }
  };

  const handleShare = async () => {
    if (!nft) return;
    
    try {
      const shareData = {
        title: nft.title,
        text: `Check out this NFT: ${nft.title}`,
        url: window.location.href,
      };
      
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("NFT shared successfully!");
      } else {
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}\n\nImage: ${nft.image}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("NFT link and image copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing NFT:", error);
      toast.error("Failed to share NFT");
    }
  };

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
            <p className="text-muted-foreground mb-8">
              The NFT you're looking for could not be found.
            </p>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
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
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none">
                    {nft.tokenStandard}
                  </Badge>
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none">
                    {nft.category}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-black/30 text-white backdrop-blur-sm border-none rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <p className="font-medium">#{nft.tokenId}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Rarity</p>
                  <p className="font-medium">{nft.rarity}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Royalty</p>
                  <p className="font-medium">{(nft.royaltyFee).toFixed(1)}%</p>
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
                <Badge variant="outline" className={nft.isListed ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}>
                  {nft.isListed ? "Listed" : "Not Listed"}
                </Badge>
                <Badge variant="secondary">{nft.category}</Badge>
                <Badge variant="secondary">{nft.tokenStandard}</Badge>
              </div>
              
              <h1 className="text-3xl font-display font-bold mb-3">{nft.title}</h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-medium">{formatAddress(nft.creator)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-medium">{formatAddress(nft.owner)}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-8">{nft.description}</p>
              
              {isOwner && (
                <div className="mb-8 flex gap-3">
                  {/* Set profile and banner buttons removed */}
                </div>
              )}
              
              {nft.isListed && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-display font-bold">{formatPrice(nft.price, nft.currency)}</p>
                      </div>
                      {isOwner ? (
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                          onClick={async () => {
                            try {
                              toast.loading("Unlisting NFT...");
                              
                              await nftAPI.updateNFT(nft.tokenId, {
                                isListed: false,
                                owner: nft.owner,
                                address: account
                              });
                              
                              // Refresh NFT data
                              const updatedNftResponse = await nftAPI.getNFTById(id || "");
                              setNft(updatedNftResponse.data);
                              
                              // Add transaction to history
                              const newTransaction: Transaction = {
                                id: `tx-${Date.now()}`,
                                type: 'unlist',
                                nftId: nft._id,
                                from: nft.owner,
                                to: nft.owner,
                                price: nft.price,
                                currency: nft.currency,
                                timestamp: new Date().toISOString(),
                                txHash: `0x${Math.random().toString(16).slice(2, 66)}`
                              };
                              
                              setTransactions([newTransaction, ...transactions]);
                              
                              toast.dismiss();
                              toast.success("NFT unlisted successfully");
                            } catch (error) {
                              console.error("Error unlisting NFT:", error);
                              toast.dismiss();
                              toast.error("Failed to unlist NFT");
                            }
                          }}
                        >
                          Unlist
                        </Button>
                      ) : (
                        <Button
                          onClick={handlePurchase}
                          disabled={isPurchasing || !isConnected || isOwner}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          {isPurchasing ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                              Processing...
                            </>
                          ) : (
                            <>Buy Now</>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {!isConnected && (
                      <Button onClick={() => connectWallet()} className="w-full">
                        Connect Wallet to Buy
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <Tabs defaultValue="attributes" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attributes" className="mt-4">
                  {nft.attributes && nft.attributes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {nft.attributes.map((attr, index) => (
                        <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                          <p className="text-xs text-muted-foreground uppercase">{attr.trait_type}</p>
                          <p className="font-medium truncate">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No attributes</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center p-4 rounded-lg border border-border/30">
                          {tx.type === 'mint' && <Shield className="h-5 w-5 mr-3 text-blue-500" />}
                          {tx.type === 'buy' && <ArrowRight className="h-5 w-5 mr-3 text-green-500" />}
                          {tx.type === 'sell' && <Tag className="h-5 w-5 mr-3 text-purple-500" />}
                          {tx.type === 'transfer' && <Repeat className="h-5 w-5 mr-3 text-orange-500" />}
                          {tx.type === 'list' && <Tag className="h-5 w-5 mr-3 text-yellow-500" />}
                          {tx.type === 'unlist' && <Tag className="h-5 w-5 mr-3 text-red-500" />}
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium capitalize">{tx.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm">
                                <span className="text-muted-foreground">From: </span>
                                {formatAddress(tx.from)}
                                <span className="mx-2 text-muted-foreground">To: </span>
                                {formatAddress(tx.to)}
                              </p>
                              {tx.price && (
                                <p className="text-sm font-medium">
                                  {formatPrice(tx.price, tx.currency)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No transaction history found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 border-b border-border/30">
                      <p className="text-muted-foreground">Contract Address</p>
                      <p className="font-medium">{formatAddress(contractAddress)}</p>
                    </div>
                    <div className="flex justify-between p-3 border-b border-border/30">
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">#{nft.tokenId}</p>
                    </div>
                    <div className="flex justify-between p-3 border-b border-border/30">
                      <p className="text-muted-foreground">Token Standard</p>
                      <p className="font-medium">{nft.tokenStandard}</p>
                    </div>
                    <div className="flex justify-between p-3 border-b border-border/30">
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(nft.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" className="w-full flex gap-2" asChild>
                      <a 
                        href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/token/${contractAddress}?a=${nft.tokenId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// NFTDetail.tsx

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { ArrowRight, Shield, ExternalLink } from "lucide-react";
import { contractAddress } from "@/context/secret_final";
import { nftAPI, userAPI } from "@/api/apiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const getFallbackImage = (address: string) =>
  `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#${address.slice(2, 8)}"/></svg>`)}`;

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
  const [showEnjoyingDialog, setShowEnjoyingDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const loaderRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  const isOwner = useMemo(
    () => isConnected && account?.toLowerCase() === nft?.owner?.toLowerCase(),
    [isConnected, account, nft?.owner]
  );

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

  useEffect(() => {
    const fetchNFTData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        const response = await nftAPI.getNFTById(id);
        const nftDetails = response.data;
        if (nftDetails) {
          setNft(nftDetails);
          if (nftDetails.image) new Image().src = nftDetails.image;
          try {
            const [creatorRes, ownerRes] = await Promise.all([
              userAPI.getUserByAddress(nftDetails.creator),
              userAPI.getUserByAddress(nftDetails.owner)
            ]);
            if (creatorRes?.data) setCreatorProfile(creatorRes.data);
            if (ownerRes?.data) setOwnerProfile(ownerRes.data);
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
        const formattedTxs: Transaction[] = txHistory.data.map((tx: any, i: number) => ({
          id: `tx-${i}`,
          type: tx.type,
          nftId: id,
          from: tx.from || "",
          to: tx.to || "",
          price: parseFloat(tx.price || "0"),
          currency: "USDC",
          timestamp: tx.timestamp || new Date().toISOString(),
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`
        }));
        setTransactions(formattedTxs);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [nft?.tokenId, id]);

  const handlePurchase = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      const updatedNFT = await nftAPI.getNFTById(id || "");
      setNft(updatedNFT.data);
      setShowEnjoyingDialog(true);
    } catch (err) {
      console.error("Error purchasing NFT:", err);
      toast.error("Failed to purchase NFT");
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    const intervals = [
      { label: "year", duration: 31536000000 },
      { label: "month", duration: 2628000000 },
      { label: "week", duration: 604800000 },
      { label: "day", duration: 86400000 },
      { label: "hour", duration: 3600000 },
      { label: "minute", duration: 60000 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diff / interval.duration);
      if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }

    return "just now";
  };

  const formattedTransactions = useMemo(() => {
    return transactions.slice(0, currentPage * itemsPerPage).map(tx => ({
      ...tx,
      timeAgo: formatTimeAgo(tx.timestamp)
    }));
  }, [transactions, currentPage]);

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
              <Link to="/marketplace">Go back to Marketplace</Link>
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
            {/* Left Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 shadow-sm">
                <img
                  loading="lazy"
                  src={nft.image || getFallbackImage(nft.creator)}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2"
            >
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-display font-bold">{nft.title}</h1>
                  <p className="mt-2 text-muted-foreground">{nft.description}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={creatorProfile?.profileImage || ""} />
                    <AvatarFallback>
                      {creatorProfile?.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Created by</p>
                    <p className="text-muted-foreground text-sm">{creatorProfile?.displayName || formatAddress(nft.creator)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">{formatPrice(nft.price)} USDC</p>
                  </div>
                  {!isOwner && (
                    <Button onClick={handlePurchase} disabled={isPurchasing}>
                      {isPurchasing ? "Processing..." : "Buy Now"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs for History */}
          <div className="mt-12">
            <Tabs defaultValue="history" className="w-full">
              <TabsList>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                {isLoadingHistory ? (
                  <div className="mt-4 text-center text-muted-foreground">Loading history...</div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {formattedTransactions.map((tx) => (
                      <Card key={tx.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">
                              From {formatAddress(tx.from)} to {formatAddress(tx.to)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(tx.price)} {tx.currency}</p>
                            <p className="text-sm text-muted-foreground">{tx.timeAgo}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div ref={loaderRef}></div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

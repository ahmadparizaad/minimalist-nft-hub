import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NFTCard } from "@/components/NFTCard";
import { NFT } from "@/types";
import { nftAPI } from "@/api/apiService";
import { motion } from "framer-motion";

export default function TrendingNFTs() {
  const [trendingNFTs, setTrendingNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingNFTs = async () => {
      setIsLoading(true);
      try {
        // Get all trending NFTs (no limit)
        const response = await nftAPI.getTrendingNFTs(20);
        if (response.success && response.data) {
          console.log('Trending NFTs:', response.data);
          setTrendingNFTs(response.data);
        } else {
          console.error('Failed to fetch trending NFTs');
          setTrendingNFTs([]);
        }
      } catch (error) {
        console.error('Error fetching trending NFTs:', error);
        setTrendingNFTs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingNFTs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trending NFTs
            </h1>
            <p className="text-muted-foreground">
              Discover the most popular and trending NFTs on the platform.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : trendingNFTs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingNFTs.map((nft, index) => (
                <NFTCard key={nft._id} nft={nft} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No trending NFTs found</h3>
              <p className="text-muted-foreground">
                Check back later for trending items.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
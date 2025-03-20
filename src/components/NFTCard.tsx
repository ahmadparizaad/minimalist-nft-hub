
import { NFT } from "@/types";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/web3";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nftAPI } from "@/api/apiService";
import { Shield } from "lucide-react";

interface NFTCardProps {
  nft: NFT;
  index?: number;
}

export function NFTCard({ nft, index = 0 }: NFTCardProps) {
  const [nftData, setNftData] = useState<NFT>(nft);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (nft._id) {
      console.log(nft._id);
      const fetchNFTData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch the latest NFT data from backend
          const response = await nftAPI.getNFTById(nft._id);
          console.log(response.data);
          if (response.success && response.data) {
            setNftData(response.data);
          }
        } catch (error) {
          console.error("Error fetching NFT data:", error);
          setError("Failed to load NFT data");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchNFTData();
    }
  }, [nft._id]);
  
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="nft-card flex flex-col h-full border border-border rounded-xl overflow-hidden bg-muted/30"
      >
        <div className="aspect-square bg-muted animate-pulse" />
        <div className="p-4">
          <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </div>
      </motion.div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="nft-card flex flex-col h-full border border-border rounded-xl overflow-hidden bg-muted/10"
      >
        <div className="aspect-square bg-muted/20 flex items-center justify-center">
          <Shield className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <div className="p-4">
          <h3 className="font-display font-medium text-foreground/90">{nft.title || "NFT"}</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
    >
      <Link
        to={`/nft/${nftData._id}`}
        className="group block overflow-hidden"
      >
        <div className="nft-card flex flex-col h-full border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={nftData.image}
              alt={nftData.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs rounded-full bg-black/50 text-white backdrop-blur-sm">
                {nftData.category}
              </span>
            </div>

            {!nftData.isListed && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs rounded-full bg-red-500/80 text-white backdrop-blur-sm">
                  Not Listed
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-medium text-foreground/90 line-clamp-1">
                {nftData.title || "Untitled NFT"}
              </h3>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                #{nftData.tokenId}
              </span>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
              {nftData.description || "No description available."}
            </p>

            <div className="mt-auto pt-3 border-t border-border/40 flex justify-between items-center">
              <div className="text-sm">
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">{formatPrice(nftData.price)}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                {nftData.tokenStandard}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

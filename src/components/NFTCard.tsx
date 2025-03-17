import { NFT } from "@/types";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/web3";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

interface NFTCardProps {
  nft: NFT;
  index?: number;
}

const API_URL = "http://localhost:5000/api";

export function NFTCard({ nft, index = 0 }: NFTCardProps) {
  const [nftData, setNftData] = useState<NFT>(nft);
  
  useEffect(() => {
    if (nft.tokenId) {
      const fetchNFTData = async () => {
        try {
          const response = await axios.get(`${API_URL}/nfts/token/${nft.tokenId}`);
          if (response.data.success) {
            setNftData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching NFT data:", error);
        }
      };
      
      fetchNFTData();
    }
  }, [nft.tokenId]);
  
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
        to={`/nft/${nftData.id}`}
        className="group block overflow-hidden"
      >
        <div className="nft-card flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={nftData.image}
              alt={nftData.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute top-2 left-2">
              <span className="chip bg-black/50 text-white backdrop-blur-sm border-none">
                {nftData.category}
              </span>
            </div>

            {!nftData.isListed && (
              <div className="absolute top-2 right-2">
                <span className="chip bg-red-500/80 text-white backdrop-blur-sm border-none">
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
              <span className="chip bg-muted text-muted-foreground">
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
              <span className="chip bg-primary/10 text-primary">
                {nftData.tokenStandard}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

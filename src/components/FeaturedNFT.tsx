import { NFT } from "@/types";
import { formatPrice } from "@/utils/web3";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface FeaturedNFTProps {
  nft: NFT;
}

export function FeaturedNFT({ nft }: FeaturedNFTProps) {
  // Safety check for null or undefined NFT
  if (!nft) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-background to-muted shadow-lg border border-border/40"
    >
      <div className="flex flex-col md:flex-row">
        <motion.div 
          initial={{ scale: 1.1, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden"
        >
          <img 
            src={nft.image || "https://via.placeholder.com/500?text=NFT+Image"}
            alt={nft.title || "NFT"}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-2 mb-3">
              <span className="chip bg-primary text-white">{nft.category || "Art"}</span>
              <span className="chip bg-secondary text-secondary-foreground">
                {nft.tokenStandard || "ERC-721"}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              {nft.title || `NFT #${nft.tokenId || 0}`}
            </h2>
            
            <p className="text-muted-foreground mb-6 md:text-lg">
              {nft.description || "No description available."}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 p-4 rounded-xl bg-secondary/70 backdrop-blur-sm"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="text-sm text-muted-foreground">Token ID: #{nft.tokenId || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-display font-bold">
                {formatPrice(nft.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                Royalty: {((nft.royaltyFee || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-auto flex gap-4"
          >
            <Button 
              asChild
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
            >
              <Link to={`/nft/${nft._id || nft.tokenId || 0}`}>
                View Details
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-primary text-primary hover:bg-primary/10 rounded-xl h-12"
              asChild
            >
              <Link to={`/marketplace`}>
                Browse More
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

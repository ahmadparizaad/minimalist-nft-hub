import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAddress } from "@/utils/web3";
import { Creator } from "@/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users2 } from "lucide-react";

interface TopTradersProps {
  traders: Creator[];
  isLoading: boolean;
}

export function TopTraders({ traders, isLoading }: TopTradersProps) {
  if (isLoading) {
    return (
      <div className="flex overflow-x-auto py-4 gap-6 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Display empty state if no traders are found
  if (!traders || traders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users2 className="h-12 w-12 mb-2" />
        <h3 className="text-lg font-medium">No Top Traders Found</h3>
        <p className="text-sm">Top traders will appear here once users start trading.</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto py-4 gap-6 no-scrollbar">
      {traders.map((trader, i) => (
        <motion.div
          key={trader.id || trader.address}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex-shrink-0 flex flex-col items-center gap-2"
        >
          <Link 
            to={`/profile/${trader.address}`} 
            className="group relative"
          >
            <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-background group-hover:border-primary transition-colors">
              <AvatarImage 
                src={trader.profileImage || trader.avatar || `https://source.unsplash.com/random/300x300?profile&sig=${trader.address}`} 
                alt={trader.username || trader.name || formatAddress(trader.address)} 
              />
              <AvatarFallback>{formatAddress(trader.address).substring(0, 2)}</AvatarFallback>
            </Avatar>
            {trader.verified && (
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
          </Link>
          <div className="flex flex-col items-center">
            <Link 
              to={`/profile/${trader.address}`} 
              className="font-medium text-sm hover:text-primary transition-colors"
            >
              {trader.username || trader.name || formatAddress(trader.address)}
            </Link>
            <p className="text-xs text-muted-foreground">
              Volume: <span className="font-semibold">${trader.volumeTraded ? trader.volumeTraded.toLocaleString() : '0'}</span>
            </p>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
            Rank #{i + 1}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
} 
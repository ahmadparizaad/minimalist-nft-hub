
import { Collection } from "@/types";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/web3";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
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
        to={`/collection/${collection.id}`}
        className="block group"
      >
        <div className="overflow-hidden rounded-xl bg-white border border-border shadow-sm hover-lift">
          <div className="relative h-32 overflow-hidden">
            <img 
              src={collection.banner} 
              alt={`${collection.name} banner`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="relative -mt-10 mr-3">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-16 h-16 rounded-lg border-4 border-white object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-display font-medium flex items-center">
                  {collection.name}
                  {collection.verified && (
                    <CheckCircle2 className="ml-1 h-4 w-4 text-primary" />
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collection.items} items
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Floor</p>
                <p className="font-medium">{formatPrice(collection.floorPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{formatPrice(collection.volumeTraded)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

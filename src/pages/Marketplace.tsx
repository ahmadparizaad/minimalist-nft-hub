
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FilterBar } from "@/components/FilterBar";
import { NFTCard } from "@/components/NFTCard";
import { generateMockNFTs } from "@/utils/ipfs";
import { NFT, MarketplaceFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

// Initial filter state
const initialFilters: MarketplaceFilters = {
  priceRange: { min: 0, max: 1000 },
  categories: [],
  rarities: [],
  tokenStandards: [],
  sortBy: 'recently_listed',
  creators: [],
  collections: [],
  searchQuery: ''
};

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load NFTs
  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call with pagination
        const fetchedNfts = generateMockNFTs(24);
        setNfts(fetchedNfts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  // Check for category in URL params on first load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }));
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...nfts];
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(nft => 
        nft.title.toLowerCase().includes(query) || 
        nft.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(nft => 
      nft.price >= filters.priceRange.min &&
      nft.price <= filters.priceRange.max
    );
    
    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(nft => 
        filters.categories.includes(nft.category)
      );
    }
    
    // Filter by rarities
    if (filters.rarities.length > 0) {
      result = result.filter(nft => 
        filters.rarities.includes(nft.rarity)
      );
    }
    
    // Filter by token standards
    if (filters.tokenStandards.length > 0) {
      result = result.filter(nft => 
        filters.tokenStandards.includes(nft.tokenStandard)
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low_high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'recently_listed':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most_popular':
        // This would typically use a popularity metric; for now, just randomize
        result.sort(() => Math.random() - 0.5);
        break;
    }
    
    setFilteredNfts(result);
  }, [nfts, filters]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
  };

  // Load more NFTs (infinite scrolling simulation)
  const loadMoreNFTs = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      // In a real app, this would fetch the next page of NFTs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For this demo, we'll just generate more mock NFTs
      if (page < 3) {
        const moreNfts = generateMockNFTs(12);
        setNfts(prev => [...prev, ...moreNfts]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more NFTs:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover, collect, and sell extraordinary NFTs
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search NFTs by name or description"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Active filters display */}
              <div className="flex-1">
                {(filters.categories.length > 0 || 
                  filters.rarities.length > 0 || 
                  filters.tokenStandards.length > 0 ||
                  filters.searchQuery) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {filters.searchQuery && (
                      <div className="chip bg-secondary">
                        <span>Search: {filters.searchQuery}</span>
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    {filters.categories.map(category => (
                      <div key={category} className="chip bg-secondary">
                        <span>{category}</span>
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            categories: prev.categories.filter(c => c !== category)
                          }))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {filters.rarities.map(rarity => (
                      <div key={rarity} className="chip bg-secondary">
                        <span>{rarity}</span>
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            rarities: prev.rarities.filter(r => r !== rarity)
                          }))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {filters.tokenStandards.map(standard => (
                      <div key={standard} className="chip bg-secondary">
                        <span>{standard}</span>
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            tokenStandards: prev.tokenStandards.filter(s => s !== standard)
                          }))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFilters(initialFilters)}
                      className="text-muted-foreground hover:text-foreground h-6"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  Showing {filteredNfts.length} results
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
            <FilterBar 
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : filteredNfts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-display font-medium mb-2">No NFTs Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {filteredNfts.map((nft, index) => (
                      <NFTCard key={nft.id} nft={nft} index={index} />
                    ))}
                  </motion.div>
                  
                  {hasMore && (
                    <div className="mt-12 text-center">
                      <Button 
                        onClick={loadMoreNFTs} 
                        disabled={isLoadingMore}
                        size="lg"
                        className="rounded-xl"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

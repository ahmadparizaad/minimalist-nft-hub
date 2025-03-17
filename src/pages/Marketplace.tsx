
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { NFT, MarketplaceFilters, PriceRange } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Filter, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/context/Web3Context";
import { nftAPI } from "@/api/apiService";

// Default filters
const defaultFilters: MarketplaceFilters = {
  priceRange: { min: 0, max: 1000 },
  categories: [],
  rarities: [],
  tokenStandards: [],
  sortBy: 'recently_listed',
  creators: [],
  collections: [],
  searchQuery: '',
};

export default function Marketplace() {
  const { web3State } = useWeb3();
  const { account } = web3State;
  
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableRarities, setAvailableRarities] = useState<string[]>([]);

  // For mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // Fetch NFTs from backend API instead of blockchain
        const response = await nftAPI.getAllNFTs();
        const fetchedNFTs = response.data || [];
  
        if (!fetchedNFTs.length) {
          setNfts([]);
          setFilteredNfts([]);
          setAvailableCategories([]);
          setAvailableRarities([]);
          return;
        }
  
        setNfts(fetchedNFTs);
        setFilteredNfts(fetchedNFTs);
        
        // Extract available categories and rarities - add explicit type casting
        const categories = [...new Set(fetchedNFTs.map((nft: NFT) => nft.category))] as string[];
        const rarities = [...new Set(fetchedNFTs.map((nft: NFT) => nft.rarity))] as string[];
        
        setAvailableCategories(categories);
        setAvailableRarities(rarities);
  
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        toast.error("Failed to load NFTs");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNFTs();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, nfts]);

  const applyFilters = () => {
    const { priceRange, categories, rarities, tokenStandards, sortBy, searchQuery } = filters;

    let filtered = [...nfts];

    // Filter by price range
    filtered = filtered.filter(
      (nft) => nft.price >= priceRange.min && nft.price <= priceRange.max
    );

    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter((nft) => categories.includes(nft.category));
    }

    // Filter by rarities
    if (rarities.length > 0) {
      filtered = filtered.filter((nft) => rarities.includes(nft.rarity));
    }

    // Filter by token standards
    if (tokenStandards.length > 0) {
      filtered = filtered.filter((nft) => tokenStandards.includes(nft.tokenStandard));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query)
      );
    }

    // Sort results
    switch (sortBy) {
      case 'price_low_high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'recently_listed':
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'most_popular':
        // In a real app, this would sort by views/likes/etc.
        // For now, just randomize
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    setFilteredNfts(filtered);
  };

  const handleFilterChange = (updatedFilters: Partial<MarketplaceFilters>) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  const handlePriceRangeChange = (priceRange: PriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ searchQuery });
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  const handleToggleCategory = (category: string) => {
    const currentCategories = [...filters.categories];
    const index = currentCategories.indexOf(category);

    if (index === -1) {
      currentCategories.push(category);
    } else {
      currentCategories.splice(index, 1);
    }

    handleFilterChange({ categories: currentCategories });
  };

  const handleToggleRarity = (rarity: string) => {
    const currentRarities = [...filters.rarities];
    const index = currentRarities.indexOf(rarity);

    if (index === -1) {
      currentRarities.push(rarity);
    } else {
      currentRarities.splice(index, 1);
    }

    handleFilterChange({ rarities: currentRarities });
  };

  const handleToggleTokenStandard = (standard: "ERC-721" | "ERC-1155") => {
    const currentStandards = [...filters.tokenStandards] as string[];
    const index = currentStandards.indexOf(standard);

    if (index === -1) {
      currentStandards.push(standard);
    } else {
      currentStandards.splice(index, 1);
    }

    handleFilterChange({ tokenStandards: currentStandards as string[] });
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.rarities.length > 0 ||
      filters.tokenStandards.length > 0 ||
      filters.priceRange.min > defaultFilters.priceRange.min ||
      filters.priceRange.max < defaultFilters.priceRange.max || filters.searchQuery !== ''
    );
  };

  // Filter panel content - shared between desktop and mobile
  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min}
            onChange={(e) =>
              handlePriceRangeChange({ ...filters.priceRange, min: Number(e.target.value) })
            }
            className="w-24"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) =>
              handlePriceRangeChange({ ...filters.priceRange, max: Number(e.target.value) })
            }
            className="w-24"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePriceRangeChange({ min: 0, max: 1000 })}
          >
            Reset
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <Badge
              key={category}
              variant={filters.categories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Rarities</h3>
        <div className="flex flex-wrap gap-2">
          {availableRarities.map((rarity) => (
            <Badge
              key={rarity}
              variant={filters.rarities.includes(rarity) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleRarity(rarity)}
            >
              {rarity}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Token Standard</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filters.tokenStandards.includes("ERC-721") ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleToggleTokenStandard("ERC-721")}
          >
            ERC-721
          </Badge>
          <Badge
            variant={filters.tokenStandards.includes("ERC-1155") ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleToggleTokenStandard("ERC-1155")}
          >
            ERC-1155
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value as string })}
          className="w-full border border-border rounded-md p-2"
        >
          <option value="recently_listed">Recently Listed</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="most_popular">Most Popular</option>
        </select>
      </div>

      {hasActiveFilters() && (
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full mt-4"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 pb-16">
        <div className="container mx-auto max-w-6xl py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold">Marketplace</h1>

              <div className="flex items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search NFTs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </form>

                {/* Mobile Filter Button */}
                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium">Filters</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileFilterOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                      <FilterPanel />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2"
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters()}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters() ? "Clear Filters" : "Filters"}
                </Button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6 md:hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </form>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Desktop Filter Panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block w-64 flex-shrink-0"
              >
                <FilterPanel />
              </motion.div>

              {/* NFT Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : filteredNfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNfts.map((nft, index) => (
                      <NFTCard key={nft.id} nft={nft} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No NFTs Found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      No NFTs match your current filter criteria. Try adjusting your filters or search query.
                    </p>
                    <Button onClick={handleClearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

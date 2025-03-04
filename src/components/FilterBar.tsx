
import { MarketplaceFilters } from "@/types";
import { PriceFilter } from "./PriceFilter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface FilterBarProps {
  initialFilters: MarketplaceFilters;
  onFilterChange: (filters: MarketplaceFilters) => void;
}

// Categories for filtering
const categories = [
  "Art",
  "Collectible",
  "Photography",
  "Music",
  "Video",
  "Sports",
  "Utility",
  "Virtual Worlds"
];

// Rarities for filtering
const rarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Unique"
];

// Token standards for filtering
const tokenStandards = [
  "ERC-721",
  "ERC-1155"
];

export function FilterBar({ initialFilters, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle category change
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  // Handle rarity change
  const toggleRarity = (rarity: string) => {
    setFilters(prev => {
      const rarities = prev.rarities.includes(rarity)
        ? prev.rarities.filter(r => r !== rarity)
        : [...prev.rarities, rarity];
      return { ...prev, rarities };
    });
  };

  // Handle token standard change
  const toggleTokenStandard = (standard: string) => {
    setFilters(prev => {
      const tokenStandards = prev.tokenStandards.includes(standard)
        ? prev.tokenStandards.filter(s => s !== standard)
        : [...prev.tokenStandards, standard];
      return { ...prev, tokenStandards };
    });
  };

  // Handle price change
  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  // Handle sorting change
  const handleSortChange = (sortBy: MarketplaceFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 1000 },
      categories: [],
      rarities: [],
      tokenStandards: [],
      sortBy: 'recently_listed',
      creators: [],
      collections: [],
      searchQuery: ''
    });
  };

  return (
    <aside className={`
      fixed md:relative inset-y-0 left-0 z-40 w-72 bg-background border-r border-border
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-medium">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset All
          </Button>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4">
          <div className="space-y-6">
            {/* Price Range Filter */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <PriceFilter
                initialRange={filters.priceRange}
                maxPrice={1000}
                onChange={handlePriceChange}
              />
            </div>

            <Separator />

            {/* Sort By */}
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'recently_listed', label: 'Recently Listed' },
                  { value: 'price_low_high', label: 'Price: Low to High' },
                  { value: 'price_high_low', label: 'Price: High to Low' },
                  { value: 'most_popular', label: 'Most Popular' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleSortChange(option.value as MarketplaceFilters['sortBy'])}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rarities */}
            <div>
              <h3 className="font-medium mb-3">Rarities</h3>
              <div className="space-y-2">
                {rarities.map(rarity => (
                  <div key={rarity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rarity-${rarity}`}
                      checked={filters.rarities.includes(rarity)}
                      onCheckedChange={() => toggleRarity(rarity)}
                    />
                    <label
                      htmlFor={`rarity-${rarity}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {rarity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Token Standards */}
            <div>
              <h3 className="font-medium mb-3">Token Standards</h3>
              <div className="space-y-2">
                {tokenStandards.map(standard => (
                  <div key={standard} className="flex items-center space-x-2">
                    <Checkbox
                      id={`standard-${standard}`}
                      checked={filters.tokenStandards.includes(standard)}
                      onCheckedChange={() => toggleTokenStandard(standard)}
                    />
                    <label
                      htmlFor={`standard-${standard}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {standard}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Mobile toggle button */}
      <Button
        variant="secondary"
        className="md:hidden absolute -right-12 top-4 p-2 h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '☰'}
      </Button>
    </aside>
  );
}

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeaturedNFT } from "@/components/FeaturedNFT";
import { NFTCard } from "@/components/NFTCard";
import { CollectionCard } from "@/components/CollectionCard";
import { TopTraders } from "@/components/TopTraders";
import { mockNFTs, mockCollections, generateMockNFTs, generateMockCollections, generateMockCreators } from "@/utils/ipfs";
import { NFT, Collection, Creator } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { nftAPI, userAPI } from "@/api/apiService";
import Waves from "@/components/ui/waves";
import { Search } from "lucide-react";

export default function Index() {
  const [featuredNFT, setFeaturedNFT] = useState<NFT | null>(null);
  const [trendingNFTs, setTrendingNFTs] = useState<NFT[]>([]);
  const [topCollections, setTopCollections] = useState<Collection[]>([]);
  const [topTraders, setTopTraders] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    featured: true,
    trending: true,
    traders: true
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Use a staggered approach to fetch data
      try {
        // Start all fetch operations in parallel
        const trendingPromise = nftAPI.getTrendingNFTs(4);
        const tradersPromise = userAPI.getTopTraders(6);
        const featuredPromise = nftAPI.getNFTByTokenId(26);
        
        // Handle trending NFTs
        try {
          const trendingResponse = await trendingPromise;
          if (trendingResponse.success && trendingResponse.data && trendingResponse.data.length > 0) {
            setTrendingNFTs(trendingResponse.data);
            console.log('Using real trending NFTs from API');
          } else {
            // Fallback to mock data if API fails
            setTrendingNFTs(generateMockNFTs(4));
            console.log('Using mock trending NFTs');
          }
        } catch (error) {
          console.error("Error fetching trending NFTs:", error);
          setTrendingNFTs(generateMockNFTs(4));
        } finally {
          setLoadingStates(prev => ({ ...prev, trending: false }));
        }
        
        // Handle top traders
        try {
          const tradersResponse = await tradersPromise;
          if (tradersResponse.success && tradersResponse.data && tradersResponse.data.length > 0) {
            setTopTraders(tradersResponse.data);
            console.log('Using real top traders from database');
          } else {
            setTopTraders(generateMockCreators(6));
          }
        } catch (error) {
          console.error("Error fetching top traders:", error);
          setTopTraders(generateMockCreators(6));
        } finally {
          setLoadingStates(prev => ({ ...prev, traders: false }));
        }
        
        // Handle featured NFT
        try {
          const response = await featuredPromise;
          console.log('Featured NFT response:', response);
          
          if (response.success && response.data) {
            setFeaturedNFT(response.data);
          } else {
            // Use the first trending NFT as a fallback for featured
            const mockData = generateMockNFTs(1);
            setFeaturedNFT(mockData[0]);
          }
        } catch (error) {
          console.error("Error fetching featured NFT:", error);
          const mockData = generateMockNFTs(1);
          setFeaturedNFT(mockData[0]);
        } finally {
          setLoadingStates(prev => ({ ...prev, featured: false }));
        }
        
        // Generate collections data (mock for now)
        setTopCollections(generateMockCollections(4));
      } catch (error) {
        console.error("Error in fetch operations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper component for the featured NFT skeleton
  const FeaturedNFTSkeleton = () => (
    <div className="bg-card/30 rounded-3xl overflow-hidden shadow-lg animate-pulse">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 aspect-square lg:aspect-auto bg-muted"></div>
        <div className="w-full lg:w-2/5 p-6 lg:p-8 flex flex-col justify-center">
          <div className="h-8 bg-muted rounded-full w-3/4 mb-4"></div>
          <div className="h-6 bg-muted rounded-full w-1/2 mb-6"></div>
          <div className="h-24 bg-muted rounded-xl mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-muted rounded-xl w-32"></div>
            <div className="h-12 bg-muted rounded-xl w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <Waves
          lineColor="#DCECFC"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
        {/* Hero Section */}
        <section className="pt-12 pb-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                Trade, Earn and Own
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  with Confidence
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                NapFT redefines NFTs with real-world asset backing, dynamic pricing, and a gas free transaction for seamless trading experience.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8"
                >
                  <Link to="/marketplace">
                    Explore
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 rounded-xl h-12 px-8"
                >
                  <Link to="/mint">
                    Create
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Search Section */}
            {/* <div className="mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input 
                    type="search" 
                    className="block w-full p-4 pl-10 text-sm rounded-xl border border-input bg-background focus:ring-primary focus:border-primary" 
                    placeholder="Search for NFTs, collections or creators..." 
                  />
                </div>
              </div>
            </div> */}

            {/* Featured NFT - with loading skeleton */}
            {loadingStates.featured ? <FeaturedNFTSkeleton /> : featuredNFT && <FeaturedNFT nft={featuredNFT} />}
          </div>
        </section>

        {/* Top Traders Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Top Traders
              </h2>
              <Button asChild variant="outline">
                <Link to="/marketplace">
                  View All
                </Link>
              </Button>
            </div>

            <TopTraders traders={topTraders} isLoading={loadingStates.traders} />
          </div>
        </section>

        {/* Trending NFTs Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Trending NFTs
              </h2>
              <Button asChild variant="outline">
                <Link to="/trending">
                  View All
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loadingStates.trending
                ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse overflow-hidden">
                    <div className="h-3/4 bg-muted/80"></div>
                    <div className="p-4">
                      <div className="h-4 bg-muted/80 rounded-full w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted/80 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))
                : trendingNFTs.slice(0, 4).map((nft, index) => (
                  <NFTCard key={nft._id} nft={nft} index={index} />
                ))
              }
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Create and Sell Your NFTs
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of creators and collectors in the world's
                most accessible and user-friendly NFT marketplace.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8"
              >
                <Link to="/mint">
                  Start Creating
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

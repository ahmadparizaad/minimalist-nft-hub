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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch trending NFTs from API
        const trendingResponse = await nftAPI.getTrendingNFTs(4);
        let trendingData: NFT[] = [];

        if (trendingResponse.success && trendingResponse.data && trendingResponse.data.length > 0) {
          trendingData = trendingResponse.data;
          console.log('Using real trending NFTs from API');
        } else {
          // Fallback to mock data if API fails
          trendingData = generateMockNFTs(4);
          console.log('Using mock trending NFTs');
        }

        // Fetch top traders from the database
        const tradersResponse = await userAPI.getTopTraders(6);
        let tradersData: Creator[] = [];

        if (tradersResponse.success && tradersResponse.data && tradersResponse.data.length > 0) {
          tradersData = tradersResponse.data;
          console.log('Using real top traders from database');
        }

        // Generate collections data (mock for now)
        const collections = generateMockCollections(4);

        // Fetch a real NFT from the API for the featured slot
        const response = await nftAPI.getNFTByTokenId(26);
        console.log('Featured NFT response:', response);

        // Only set the featuredNFT if the API call was successful and the data exists
        if (response.success && response.data) {
          setFeaturedNFT(response.data);
        } else {
          // Use the first trending NFT as a fallback for featured
          setFeaturedNFT(trendingData[0]);
        }

        setTrendingNFTs(trendingData);
        setTopCollections(collections);
        setTopTraders(tradersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use mock data as fallback in case of error for NFTs and collections
        const mockData = generateMockNFTs(8);

        setFeaturedNFT(mockData[0]);
        setTrendingNFTs(mockData.slice(1, 5));
        // We don't use mock data for traders anymore
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

            {/* Featured NFT */}
            {featuredNFT && <FeaturedNFT nft={featuredNFT} />}
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

            <TopTraders traders={topTraders} isLoading={isLoading} />
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
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                ))
                : trendingNFTs.slice(0, 4).map((nft, index) => (
                  <NFTCard key={nft._id} nft={nft} index={index} />
                ))
              }
            </div>
          </div>
        </section>

        {/* Top Collections Section */}
        {/* <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Top Collections
              </h2>
              <Button asChild variant="outline">
                <Link to="/marketplace">
                  View All
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading 
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                  ))
                : topCollections.map((collection, index) => (
                    <CollectionCard key={collection.id} collection={collection} index={index} />
                  ))
              }
            </div>
          </div>
        </section> */}

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

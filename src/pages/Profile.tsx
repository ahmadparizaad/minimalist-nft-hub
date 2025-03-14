import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAddress } from "@/utils/web3";
import { useWeb3 } from "@/context/Web3Context";
import { NFT, Transaction, Creator } from "@/types";
import { generateMockNFTs, generateMockTransactions, generateMockCreators } from "@/utils/ipfs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Edit, CheckCircle2, Share2 } from "lucide-react";

export default function Profile() {
  const { address } = useParams<{ address: string }>();
  const { web3State, getAllNFTs,getMyNFTs } = useWeb3();
  const { account } = web3State;
  const [nfts, setNfts] = useState([]);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [createdNFTs, setCreatedNFTs] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("owned");

  const isOwner = address === account || !address;
  const profileAddress = address || account;
  console.log("Address Prop:", address);
  console.log("Address Prop2:", account);
console.log("Account:", account);
console.log("Final Profile Address:", profileAddress);

  useEffect(() => {
    console.log("Profile Address:", profileAddress);
  }, [profileAddress]);

  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("mintedNFTs") || "[]");
    setNfts(storedNFTs);
  }, []);
  

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const allNFTs = await getAllNFTs();
        console.log("Fetched NFTs in profile:", allNFTs);
        setAllNfts(allNFTs); // Store ALL NFTs in a separate state

        {allNFTs.length > 0 ? (
          allNFTs.map(nft => (
              <div key={nft.id} className="nft-card">
                  <img src={nft.image} alt={nft.title} />
                  <h3>{nft.title}</h3>
                  <p>{nft.description}</p>
              </div>
          ))
      ) : (
          <p>No NFTs owned.</p>
      )}
      

      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (profileAddress) {
      console.log("Fetching NFTs for:", profileAddress);
      fetchProfileData();
    }
  }, [profileAddress]);
  
  // In your component's state:
  const [allNfts, setAllNfts] = useState<any[]>([]); // All NFTs
  const [profileNfts, setProfileNfts] = useState<any[]>([]); // Profile-specific NFTs
  


  const handleCopyAddress = () => {
    if (profileAddress) {
      navigator.clipboard.writeText(profileAddress);
      toast.success("Address copied to clipboard");
    }
  };

  if (!profileAddress) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-6xl py-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Connect Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to view your profile.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-6xl py-12">
            <div className="h-40 rounded-xl bg-muted animate-pulse mb-8"></div>
            <div className="flex items-center mb-8">
              <div className="h-24 w-24 rounded-full bg-muted animate-pulse mr-4"></div>
              <div className="space-y-2">
                <div className="h-8 w-32 rounded-md bg-muted animate-pulse"></div>
                <div className="h-4 w-48 rounded-md bg-muted animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 rounded-md bg-muted animate-pulse mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/30 to-primary/10">
          {isOwner && (
            <div className="container mx-auto max-w-6xl h-full flex justify-end items-start pt-4 px-4">
              <Button variant="outline" size="sm" className="bg-white/30 backdrop-blur-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Banner
              </Button>
            </div>
          )}
        </div>

        <div className="container mx-auto max-w-6xl px-4">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -mt-16 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              <div className="relative">
                <img
                  src={creator?.avatar || `https://source.unsplash.com/random/300x300?profile&sig=${profileAddress}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-background object-cover"
                />
                {creator?.verified && (
                  <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm rounded-full p-1 h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                    {creator?.name || `User ${profileAddress?.substring(2, 6)}`}
                  </h1>
                  {creator?.verified && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center mt-2 text-muted-foreground">
                  <span className="font-mono">{formatAddress(profileAddress)}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyAddress} className="h-8 w-8">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={`https://explorer.skale.network/address/${profileAddress}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>

                <p className="mt-2 text-muted-foreground">
                  {creator?.bio || "No bio provided"}
                </p>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                {!isOwner && (
                  <Button variant="outline">
                    Follow
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                {isOwner && (
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 md:w-auto md:inline-grid gap-6 mt-6 bg-muted/30 rounded-xl p-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold">{ownedNFTs.length}</p>
                <p className="text-sm text-muted-foreground">Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold">{creator?.followers || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold">{creator?.following || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="owned" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="owned" className="flex-1">
                Owned
                <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                  {ownedNFTs.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="created" className="flex-1">
                Created
                <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                  {createdNFTs.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">
                Activity
                <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                  {transactions.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owned">
              {allNfts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allNfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center mt-4">
                  No NFTs owned.
                </p>
              )}
            </TabsContent>


            <TabsContent value="created" className="mt-6">
              {createdNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {createdNFTs.map((nft, index) => (
                    <NFTCard key={nft.id} nft={nft} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <h3 className="text-xl font-display font-medium mb-2">No NFTs created yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {isOwner
                      ? "Start creating your own NFTs to display them here"
                      : "This user hasn't created any NFTs yet"}
                  </p>
                  {isOwner && (
                    <Button>
                      Create NFT
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center p-4 rounded-lg border border-border/30">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        {tx.type === 'mint' && <span className="text-lg">🔨</span>}
                        {tx.type === 'buy' && <span className="text-lg">💰</span>}
                        {tx.type === 'sell' && <span className="text-lg">🏷️</span>}
                        {tx.type === 'transfer' && <span className="text-lg">↔️</span>}
                        {tx.type === 'list' && <span className="text-lg">📋</span>}
                        {tx.type === 'unlist' && <span className="text-lg">🚫</span>}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {tx.type === 'mint' && 'Minted an NFT'}
                              {tx.type === 'buy' && 'Purchased an NFT'}
                              {tx.type === 'sell' && 'Sold an NFT'}
                              {tx.type === 'transfer' && 'Transferred an NFT'}
                              {tx.type === 'list' && 'Listed an NFT'}
                              {tx.type === 'unlist' && 'Unlisted an NFT'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tx.type === 'transfer' && `To: ${formatAddress(tx.to)}`}
                              {tx.type === 'buy' && `From: ${formatAddress(tx.from)}`}
                              {tx.type === 'sell' && `To: ${formatAddress(tx.to)}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                            {tx.price && (
                              <p className="font-medium">{tx.price} {tx.currency}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <h3 className="text-xl font-display font-medium mb-2">No activity yet</h3>
                  <p className="text-muted-foreground">
                    {isOwner
                      ? "Your transaction history will appear here"
                      : "This user doesn't have any activity yet"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

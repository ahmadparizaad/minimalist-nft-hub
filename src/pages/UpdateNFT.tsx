import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useWeb3 } from "@/context/Web3Context";
import { toast } from "sonner";
import { NFT } from "@/types";
import { nftAPI } from "@/api/apiService";

export default function UpdateNFT() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const { web3State } = useWeb3();
  const { account, isConnected } = web3State;

  const [nft, setNft] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isListed, setIsListed] = useState(false);

  useEffect(() => {
    const fetchNFT = async () => {
      setIsLoading(true);
      try {
        if (!tokenId) return;

        const response = await nftAPI.getNFTByTokenId(parseInt(tokenId));
        const nftData = response.data;

        if (nftData) {
          setNft(nftData);
          setTitle(nftData.title || "");
          setDescription(nftData.description || "");
          setPrice(nftData.price?.toString() || "");
          setIsListed(nftData.isListed || false);
          setIsOwner(isConnected && account?.toLowerCase() === nftData.owner?.toLowerCase());
        }
      } catch (error) {
        console.error("Error fetching NFT:", error);
        toast.error("Failed to load NFT details");
      } finally {
        setIsLoading(false);
      }
    };

    if (tokenId) {
      fetchNFT();
    }
  }, [tokenId, account, isConnected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nft || !isOwner) {
      toast.error("You don't have permission to update this NFT");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error("Please enter a valid price");
        setIsUpdating(false);
        return;
      }
      
      await nftAPI.updateNFT(nft.tokenId, {
        title,
        description,
        price: priceValue,
        isListed,
        owner: nft.owner // Ensure owner is included to fix the unlist bug
      });
      
      toast.success("NFT updated successfully");
      navigate(`/nft/${nft._id}`);
    } catch (error) {
      console.error("Error updating NFT:", error);
      toast.error("Failed to update NFT");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-4xl py-12">
            <div className="h-8 w-1/3 rounded-md bg-muted animate-pulse mb-4"></div>
            <div className="h-64 rounded-xl bg-muted animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-4xl py-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">NFT Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The NFT you're looking for could not be found.
            </p>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 px-4">
          <div className="container mx-auto max-w-4xl py-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You don't have permission to update this NFT.
            </p>
            <Button asChild>
              <Link to={`/nft/${nft._id}`}>Back to NFT</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-4xl py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Update NFT</h1>
            <p className="text-muted-foreground">
              Update the details of your NFT
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <Card className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{nft.title}</CardTitle>
                  <CardDescription>Token ID: #{nft.tokenId}</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="lg:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Details</CardTitle>
                  <CardDescription>
                    Update the information for your NFT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="NFT Title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your NFT"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USDC)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="10.00"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="listed"
                        checked={isListed}
                        onCheckedChange={setIsListed}
                      />
                      <Label htmlFor="listed">Listed for sale</Label>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/nft/${nft._id}`)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Updating...
                          </>
                        ) : (
                          "Update NFT"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
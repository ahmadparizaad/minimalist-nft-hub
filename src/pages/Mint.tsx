import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useWeb3 } from "@/context/Web3Context";
import { toast } from "sonner";
import { checkSufficientSFuel } from "@/utils/web3";
import { motion } from "framer-motion";
import { UploadCloud, Image, AlertTriangle } from "lucide-react";
import { NFTAttribute } from "@/types";
import { useNavigate } from 'react-router-dom';


export default function Mint() {
  const navigate = useNavigate();
  const { web3State, connectWallet, requestSFuel, mintNFT, updateBalances } = useWeb3();
  const { isConnected, account, sFuelBalance } = web3State;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.1");
  const [royaltyFee, setRoyaltyFee] = useState(5); // 2.5%
  const [category, setCategory] = useState("Art");
  const [rarity, setRarity] = useState("Common");
  const [isListed, setIsListed] = useState(true);
  const [tokenStandard, setTokenStandard] = useState<"ERC-721" | "ERC-1155">("ERC-721");
  const [attributes, setAttributes] = useState<NFTAttribute[]>([
    { trait_type: "Background", value: "Blue" },
    { trait_type: "Level", value: 1 }
  ]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };
  
  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };
  
  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string | number) => {
    const newAttributes = [...attributes];
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: value
    };
    setAttributes(newAttributes);
  };
  
  const handleMint = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }
    
    if (!title || !description || parseFloat(price) <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsMinting(true);
    
    try {
      // Check and request sFuel if needed
      if (!checkSufficientSFuel(sFuelBalance)) {
        setMintingStep(1);
        toast.loading("Obtaining sFUEL for gas...", { id: "sfuel-toast" });
        
        try {
          await requestSFuel();
          toast.success("sFUEL obtained successfully", { id: "sfuel-toast" });
          // Force balance update after requesting sFuel
          await updateBalances();
        } catch (sFuelError) {
          toast.error("Failed to obtain sFUEL. Please try again.", { id: "sfuel-toast" });
          setIsMinting(false);
          return;
        }
      }
      
      // Now proceed with image upload and minting
      setMintingStep(2);
      toast.loading("Minting NFT...", { id: "mint-toast" });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UI feedback
      
      const metadata = {
        description,
        price: parseFloat(price).toString(),
        royaltyFee: (royaltyFee).toString(),
        category,
        rarity,
        isListed: isListed.toString(),
        tokenStandard,
        attributes: JSON.stringify(attributes),
        createdAt: new Date().toISOString()
      };
      const options = JSON.stringify({
        cidVersion: 0,
      });

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("pinataMetadata", JSON.stringify({
        name: title,
        keyvalues: metadata
      }));
      formData.append("pinataOptions", options);
      
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Pinata API error:", errorData);
        throw new Error(`Pinata API error: ${errorData.error}`);
      }

      const resData = await res.json();
      console.log("Pinata upload response:", resData);

      setMintingStep(3);
      toast.loading("Minting NFT...", { id: "mint-toast" });
      await new Promise(resolve => setTimeout(resolve, 800)); // Small delay for UI feedback
      
      setMintingStep(4);
      toast.loading("Minting NFT...", { id: "mint-toast" });
      
      const result = await mintNFT({
        ipfsHash: resData.IpfsHash,
        price,
        royaltyFee: (royaltyFee).toString(),
        title,
        description
      });
      
      if (result) {
        toast.success("NFT minted successfully!", { id: "mint-toast" });
      
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("0.1");
        setImageFile(null);
        setImagePreview(null);
        navigate("/profile?tab=created");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT ", { id: "mint-toast" });
    } finally {
      setIsMinting(false);
      setMintingStep(0);
    }
  };
//navigate('/profile?tab=created')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 px-4 pb-16">
        <div className="container mx-auto max-w-4xl py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Create New NFT
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create and mint your unique NFT. Once minted, it will be visible in your profile
              and can be listed on the marketplace.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                      <img 
                        src={imagePreview} 
                        alt="NFT Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="outline" onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}>
                          Replace Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                      <span className="text-muted-foreground mb-2">Click to upload</span>
                      <span className="text-sm text-muted-foreground">PNG, JPG, GIF (Max 10MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </CardContent>
                {imagePreview && (
                  <CardFooter>
                    <p className="text-sm text-muted-foreground text-center w-full">
                      <Image className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
                      {imageFile?.name} - {(imageFile?.size ? imageFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                    </p>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>NFT Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isConnected && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Wallet Not Connected</h4>
                        <p className="text-sm text-yellow-700">Connect your wallet to mint NFTs.</p>
                        <Button onClick={() => connectWallet()} className="mt-2 bg-primary hover:bg-primary/90 text-white">
                          Connect Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter NFT title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Describe your NFT"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USDC) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        min="0.01" 
                        step="0.01" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="royalty">Royalty (%)</Label>
                      <div className="pt-2">
                        <Slider
                          id="royalty"
                          value={[royaltyFee]}
                          min={0}
                          max={10}
                          step={0.5}
                          onValueChange={(value) => setRoyaltyFee(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{royaltyFee}%</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Art">Art</SelectItem>
                          <SelectItem value="Collectible">Collectible</SelectItem>
                          <SelectItem value="Photography">Photography</SelectItem>
                          {/* <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Video">Video</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rarity">Rarity</Label>
                      <Select value={rarity} onValueChange={setRarity}>
                        <SelectTrigger id="rarity">
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Common">Common</SelectItem>
                          <SelectItem value="Uncommon">Uncommon</SelectItem>
                          <SelectItem value="Rare">Rare</SelectItem>
                          <SelectItem value="Epic">Epic</SelectItem>
                          <SelectItem value="Legendary">Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tokenStandard">Token Standard</Label>
                    <Select value={tokenStandard} onValueChange={(value: "ERC-721" | "ERC-1155") => setTokenStandard(value)}>
                      <SelectTrigger id="tokenStandard">
                        <SelectValue placeholder="Select token standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ERC-721">ERC-721 (Non-Fungible)</SelectItem>
                        <SelectItem value="ERC-1155">ERC-1155 (Multi-Token)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="isListed" 
                      checked={isListed} 
                      onCheckedChange={setIsListed} 
                    />
                    <Label htmlFor="isListed">List on marketplace immediately</Label>
                  </div>
                </CardContent>
              </Card>
              
             
            </motion.div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleMint} 
              disabled={isMinting || !isConnected || !imageFile || !title || !description}
              className="w-full max-w-md h-12 bg-primary hover:bg-primary/90 text-white"
            >
              {isMinting ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  {mintingStep === 1 && "Obtaining sFUEL for gas..."}
                  {mintingStep === 2 && "Minting NFT..."}
                  {mintingStep === 3 && "Minting NFT..."}
                  {mintingStep === 4 && "Minting NFT..."}
                </div>
               ) : !isConnected ? (
                "Connect Wallet to Mint"
              ) : (
                "Mint NFT"
              )}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

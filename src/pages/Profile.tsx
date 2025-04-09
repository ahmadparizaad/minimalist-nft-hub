import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAddress } from "@/utils/web3";
import { useWeb3 } from "@/context/Web3Context";
import { NFT, Transaction, Creator } from "@/types";
import { 
  mockNFTs, 
  mockCreators, 
  mockTransactions, 
  generateMockNFTs, 
  generateMockTransactions, 
  generateMockCreators 
} from "@/utils/ipfs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Edit, CheckCircle2, Share2, User, Image, MoreHorizontal, Users } from "lucide-react";
import { nftAPI, userAPI, transactionAPI } from "@/api/apiService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Jazzicon from "@metamask/jazzicon";

export default function Profile() {
  const { address } = useParams<{ address: string }>();
  const { web3State, getAllNFTs, getMyNFTs } = useWeb3();
  const { account } = web3State;
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [createdNFTs, setCreatedNFTs] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allNfts, setAllNfts] = useState<NFT[]>([]); // All NFTs
  const [profileNfts, setProfileNfts] = useState<NFT[]>([]); // Profile-specific NFTs
  const isOwner = address === account || !address;
  const profileAddress = address || account;
  
  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  
  // Followers/Following dialog state
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followersList, setFollowersList] = useState<{ address: string; username?: string; profileImage?: string; isFollowing: boolean }[]>([]);
  const [followingList, setFollowingList] = useState<{ address: string; username?: string; profileImage?: string; isFollowing: boolean }[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  
  // Dialog states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editUsernameValue, setEditUsernameValue] = useState("");
  const [editBioValue, setEditBioValue] = useState("");
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editProfileImageOpen, setEditProfileImageOpen] = useState(false);
  const [bannerURL, setBannerURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("");
  
  // Update form values when creator data changes
  useEffect(() => {
    if (creator) {
      setEditUsernameValue(creator.name || "");
      setEditBioValue(creator.bio || "");
    }
  }, [creator]);
  
  // Check follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!account || isOwner) return;
      
      try {
        const response = await userAPI.getFollowStatus(account, profileAddress);
        if (response && response.success) {
          setIsFollowing(response.isFollowing);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    
    if (account && profileAddress) {
      checkFollowStatus();
    }
  }, [account, profileAddress, isOwner]);
  
  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!account || isOwner) return;
    
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const response = await userAPI.unfollowUser(account, profileAddress);
        if (response && response.success) {
          setIsFollowing(false);
          // Update local count state
          setFollowersCount(prev => Math.max(0, prev - 1));
          // Also update the creator object if it exists
          if (creator) {
            if (typeof creator.followersCount === 'number') {
              setCreator({
                ...creator,
                followersCount: Math.max(0, creator.followersCount - 1)
              });
            } else if (Array.isArray(creator.followers)) {
              // Filter out the current user from followers array
              const updatedFollowers = creator.followers.filter(
                addr => addr.toLowerCase() !== account.toLowerCase()
              );
              setCreator({
                ...creator,
                followers: updatedFollowers
              });
            }
          }
          toast.success(`Unfollowed ${creator?.username || formatAddress(profileAddress)}`);
        } else {
          toast.error("Failed to unfollow user");
        }
      } else {
        // Follow
        const response = await userAPI.followUser(account, profileAddress);
        if (response && response.success) {
          setIsFollowing(true);
          // Update local count state
          setFollowersCount(prev => prev + 1);
          // Also update the creator object if it exists
          if (creator) {
            if (typeof creator.followersCount === 'number') {
              setCreator({
                ...creator,
                followersCount: creator.followersCount + 1
              });
            } else if (Array.isArray(creator.followers)) {
              // Add current user to followers array if not already present
              if (!creator.followers.some(addr => addr.toLowerCase() === account.toLowerCase())) {
                setCreator({
                  ...creator,
                  followers: [...creator.followers, account]
                });
              }
            }
          }
          toast.success(`Following ${creator?.username || formatAddress(profileAddress)}`);
        } else {
          toast.error("Failed to follow user");
        }
      }
    } catch (error) {
      console.error("Error handling follow:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  };
  
  // Add functions to set profile/banner image
  const setAsProfileImage = async (nftImage: string) => {
    if (!isOwner || !account) return;
    
    try {
      toast.loading("Setting as profile image...");
      
      await userAPI.updateUser(account, {
        address: account,
        profileImage: nftImage
      });
      
      toast.dismiss();
      toast.success("Profile image updated successfully");
      // Update local state to avoid reload
      setCreator(prev => prev ? {...prev, profileImage: nftImage} : null);
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.dismiss();
      toast.error("Failed to update profile image");
    }
  };

  const setAsBannerImage = async (nftImage: string) => {
    if (!isOwner || !account) return;
    
    try {
      toast.loading("Setting as banner image...");
      
      await userAPI.updateUser(account, {
        address: account,
        coverImage: nftImage
      });
      
      toast.dismiss();
      toast.success("Banner image updated successfully");
      // Update local state to avoid reload
      setCreator(prev => prev ? {...prev, coverImage: nftImage} : null);
    } catch (error) {
      console.error("Error updating banner image:", error);
      toast.dismiss();
      toast.error("Failed to update banner image");
    }
  };
  
  // Handle sharing profile
  const handleShareProfile = async () => {
    try {
      // Create share data
      const shareData = {
        title: `${creator?.name || formatAddress(profileAddress)} | NFT Profile`,
        text: `Check out ${creator?.name || formatAddress(profileAddress)}'s NFT collection`,
        url: window.location.href,
      };
      
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Profile shared successfully!");
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast.error("Failed to share profile");
    }
  };
  
  // Update profile information
  const handleUpdateProfile = async () => {
    if (!isOwner || !account) return;
    
    try {
      toast.loading("Updating profile...");
      
      await userAPI.updateUser(account, {
        address: account,
        username: editUsernameValue,
        bio: editBioValue
      });
      
      // Update local state
      setCreator(prev => prev ? {
        ...prev, 
        username: editUsernameValue,
        name: editUsernameValue, // Update both fields to ensure consistency
        bio: editBioValue
      } : null);
      
      toast.dismiss();
      toast.success("Profile updated successfully");
      setEditProfileOpen(false);
      
      // Save to local storage to persist between refreshes
      localStorage.setItem('userProfile', JSON.stringify({
        address: account,
        username: editUsernameValue,
        name: editUsernameValue,
        bio: editBioValue,
        profileImage: creator?.profileImage,
        coverImage: creator?.coverImage
      }));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.dismiss();
      toast.error("Failed to update profile");
    }
  };
  
  // Update banner with URL
  const handleUpdateBanner = async () => {
    if (!isOwner || !account || !bannerURL) return;
    
    try {
      toast.loading("Updating banner...");
      
      await userAPI.updateUser(account, {
        address: account,
        coverImage: bannerURL
      });
      
      // Update local state
      setCreator(prev => prev ? {...prev, coverImage: bannerURL} : null);
      
      toast.dismiss();
      toast.success("Banner updated successfully");
      setEditBannerOpen(false);
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.dismiss();
      toast.error("Failed to update banner");
    }
  };
  
  // Update profile image with URL
  const handleUpdateProfileImage = async () => {
    if (!isOwner || !account || !profileImageURL) return;
    
    try {
      toast.loading("Updating profile image...");
      
      await userAPI.updateUser(account, {
        address: account,
        profileImage: profileImageURL
      });
      
      // Update local state
      setCreator(prev => prev ? {...prev, profileImage: profileImageURL} : null);
      
      toast.dismiss();
      toast.success("Profile image updated successfully");
      setEditProfileImageOpen(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.dismiss();
      toast.error("Failed to update profile image");
    }
  };
  
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
        // Fetch all data in parallel
        const [creatorResponse, ownedResponse, createdResponse, txResponse] = await Promise.all([
          userAPI.getUserByAddress(profileAddress), // Fetch profile details
          nftAPI.getNFTsByOwner(profileAddress),   // Fetch owned NFTs
          nftAPI.getNFTsByCreator(profileAddress), // Fetch created NFTs
          transactionAPI.getTransactionsByUser(profileAddress), // Fetch transactions
        ]);

        // Handle creator data
        if (creatorResponse?.data) {
          const creatorData = creatorResponse.data;
          setCreator(creatorData);

          // Update followers/following counts
          setFollowersCount(
            typeof creatorData.followersCount === "number"
              ? creatorData.followersCount
              : Array.isArray(creatorData.followers)
              ? creatorData.followers.length
              : 0
          );
          setFollowingCount(
            typeof creatorData.followingCount === "number"
              ? creatorData.followingCount
              : Array.isArray(creatorData.following)
              ? creatorData.following.length
              : 0
          );
        }

        // Handle owned NFTs
        setOwnedNFTs(ownedResponse?.data || []);

        // Handle created NFTs
        setCreatedNFTs(createdResponse?.data || []);

        // Handle transactions
        setTransactions(txResponse?.data || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (profileAddress) {
      fetchProfileData();
    }
  }, [profileAddress]);

  const handleCopyAddress = () => {
    if (profileAddress) {
      navigator.clipboard.writeText(profileAddress);
      toast.success("Address copied to clipboard");
    }
  };

  // Fetch followers and following lists
  const fetchFollowersList = async () => {
    if (!profileAddress) return;

    setIsLoadingFollowers(true);
    try {
      const response = await userAPI.getUserByAddress(profileAddress);

      if (response && response.data) {
        const followersArray = Array.isArray(response.data.followers) ? response.data.followers : [];
        if (followersArray.length > 0) {
          // Batch API calls to reduce time
          const batchSize = 10; // Adjust batch size as needed
          const batches = [];
          for (let i = 0; i < followersArray.length; i += batchSize) {
            const batch = followersArray.slice(i, i + batchSize);
            batches.push(
              Promise.all(
                batch.map(async (followerAddress) => {
                  try {
                    const followerResponse = await userAPI.getUserByAddress(followerAddress);
                    const isFollowingThisUser =
                      account &&
                      (await userAPI.getFollowStatus(account, followerAddress))?.isFollowing;

                    return {
                      address: followerAddress,
                      username: followerResponse?.data?.username || followerResponse?.data?.name,
                      profileImage: followerResponse?.data?.profileImage,
                      isFollowing: isFollowingThisUser || false,
                    };
                  } catch (error) {
                    console.error(`Error fetching follower ${followerAddress}:`, error);
                    return { address: followerAddress, isFollowing: false };
                  }
                })
              )
            );
          }

          const fetchedFollowers = (await Promise.all(batches)).flat();
          setFollowersList(fetchedFollowers);
        } else {
          setFollowersList([]);
        }
      } else {
        setFollowersList([]);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers");
      setFollowersList([]);
    } finally {
      setIsLoadingFollowers(false);
    }
  };
  
  const fetchFollowingList = async () => {
    if (!profileAddress) return;
    
    setIsLoadingFollowing(true);
    try {
      // Make a direct API call to get following
      const response = await userAPI.getUserByAddress(profileAddress);
      
      if (response && response.data) {
        // Handle the case where following is an array of addresses
        if (response.data.following && Array.isArray(response.data.following)) {
          const followingArray = response.data.following;
          
          if (followingArray.length > 0) {
            const fetchedFollowing = [];
            
            for (const followingAddress of followingArray) {
              try {
                const followingResponse = await userAPI.getUserByAddress(followingAddress);
                if (followingResponse && followingResponse.data) {
                  fetchedFollowing.push({
                    address: followingAddress,
                    username: followingResponse.data.username || followingResponse.data.name,
                    profileImage: followingResponse.data.profileImage,
                    isFollowing: true // If they're in our following list, we're following them
                  });
                } else {
                  fetchedFollowing.push({
                    address: followingAddress,
                    isFollowing: true
                  });
                }
              } catch (error) {
                console.error(`Error fetching following ${followingAddress}:`, error);
                fetchedFollowing.push({
                  address: followingAddress,
                  isFollowing: true
                });
              }
            }
            
            setFollowingList(fetchedFollowing);
          } else {
            // Empty following array
            setFollowingList([]);
          }
        } else {
          // Handle the case where following is not an array (just a count)
          console.log("No following array available, just a count:", 
            typeof response.data.followingCount === 'number' 
              ? response.data.followingCount 
              : typeof response.data.following === 'number' 
                ? response.data.following 
                : 0
          );
          setFollowingList([]);
        }
      } else {
        // No user data
        setFollowingList([]);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      toast.error('Failed to load following');
      setFollowingList([]);
    } finally {
      setIsLoadingFollowing(false);
    }
  };
  
  // Handle follow/unfollow from lists
  const handleFollowFromList = async (userAddress: string, isAlreadyFollowing: boolean, fromFollowersList: boolean) => {
    if (!account || userAddress === account) return;
    
    try {
      if (isAlreadyFollowing) {
        // Unfollow
        const response = await userAPI.unfollowUser(account, userAddress);
        if (response && response.success) {
          // Update the relevant list
          if (fromFollowersList) {
            setFollowersList(prev => 
              prev.map(user => 
                user.address === userAddress ? { ...user, isFollowing: false } : user
              )
            );
          } else {
            // For following list, you might want to remove them entirely
            setFollowingList(prev => prev.filter(user => user.address !== userAddress));
          }
          toast.success(`Unfollowed ${formatAddress(userAddress)}`);
        }
      } else {
        // Follow
        const response = await userAPI.followUser(account, userAddress);
        if (response && response.success) {
          // Update the followers list if that's where the action came from
          if (fromFollowersList) {
            setFollowersList(prev => 
              prev.map(user => 
                user.address === userAddress ? { ...user, isFollowing: true } : user
              )
            );
          }
          toast.success(`Following ${formatAddress(userAddress)}`);
        }
      }
    } catch (error) {
      console.error('Error handling follow from list:', error);
      toast.error('Failed to update follow status');
    }
  };
  
  // Handle opening the followers dialog
  const handleOpenFollowers = () => {
    fetchFollowersList();
    setFollowersOpen(true);
  };
  
  // Handle opening the following dialog
  const handleOpenFollowing = () => {
    fetchFollowingList();
    setFollowingOpen(true);
  };

  const generateJazzicon = (address: string) => {
    const seed = parseInt(address.slice(2, 10), 16); // Generate a seed from the address
    const jazzicon = Jazzicon(32, seed); // Create a Jazzicon with size 32
    return jazzicon.outerHTML; // Return the HTML string
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("owned");

  // Synchronize activeTab with the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["owned", "created", "activity"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update the URL when the tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
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
        <div 
          className="h-48 md:h-64 bg-gradient-to-r from-primary/30 to-primary/10"
          style={creator?.coverImage ? { 
            backgroundImage: `url(${creator.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {isOwner && (
            <div className="container mx-auto max-w-6xl h-full flex justify-end items-start pt-4 px-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/30 backdrop-blur-sm"
                onClick={() => setEditBannerOpen(true)}
              >
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
                {creator?.profileImage ? (
                  <img loading="lazy"
                    src={creator.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-background object-cover"
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-4 border-background"
                    dangerouslySetInnerHTML={{
                      __html: generateJazzicon(profileAddress || "0x0000000000000000"),
                    }}
                  />
                )}
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
                    onClick={() => setEditProfileImageOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl text-black font-display font-semibold bg-white bg-opacity-50 rounded-3xl px-5 py-1">
                        {creator?.username || creator?.name || formatAddress(profileAddress)}
                      </h1>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-black"
                          onClick={() => {
                            setEditUsernameValue(creator?.username || creator?.name || "");
                            setEditBioValue(creator?.bio || "");
                            setEditProfileOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {creator?.verified && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-2 text-muted-foreground">
                  <span className="font-mono">{formatAddress(profileAddress)}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyAddress} className="h-8 w-8">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${profileAddress}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>

                {/* <p className="mt-2 text-muted-foreground">
                  {creator?.bio || "No bio provided"}
                </p> */}
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                {!isOwner && (
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    className={isFollowing ? "border-primary text-primary hover:bg-primary/10" : ""}
                  >
                    {isFollowLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        Loading...
                      </>
                    ) : isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleShareProfile}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {/* {isOwner && (
                  <Button onClick={() => setEditProfileOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )} */}  
              </div>
            </div>

            <div className="grid grid-cols-3 md:w-auto md:inline-grid gap-6 mt-6 bg-muted/30 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold">{ownedNFTs.length}</p>
                <p className="text-sm text-muted-foreground">Items</p>
              </div>
              <div 
                className="text-center cursor-pointer transition-all rounded-lg p-2 hover:bg-muted/60 hover:shadow-sm hover:scale-105 group" 
                onClick={handleOpenFollowers}
              >
                <p className="text-2xl font-display font-bold group-hover:text-primary">
                  {typeof creator?.followersCount === 'number' 
                    ? creator.followersCount 
                    : Array.isArray(creator?.followers) 
                      ? creator.followers.length 
                      : followersCount}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  Followers 
                  <Users className="h-3 w-3 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
              <div 
                className="text-center cursor-pointer transition-all rounded-lg p-2 hover:bg-muted/60 hover:shadow-sm hover:scale-105 group" 
                onClick={handleOpenFollowing}
              >
                <p className="text-2xl font-display font-bold group-hover:text-primary">
                  {typeof creator?.followingCount === 'number' 
                    ? creator.followingCount 
                    : Array.isArray(creator?.following) 
                      ? creator.following.length 
                      : followingCount}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  Following
                  <Users className="h-3 w-3 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information to share with the world.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="Enter a username"
                      value={editUsernameValue}
                      onChange={(e) => setEditUsernameValue(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell the world about yourself..."
                      value={editBioValue}
                      onChange={(e) => setEditBioValue(e.target.value)}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProfile}>
                    Update Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit Banner Dialog */}
            <Dialog open={editBannerOpen} onOpenChange={setEditBannerOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit Banner</DialogTitle>
                  <DialogDescription>
                    Select one of your NFTs or enter an image URL.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="nfts">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nfts">Select NFT</TabsTrigger>
                    <TabsTrigger value="url">Enter URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="nfts" className="py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                      {ownedNFTs.length > 0 ? (
                        ownedNFTs.map((nft) => (
                          <div 
                            key={nft._id} 
                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                              bannerURL === nft.image ? 'border-primary' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setBannerURL(nft.image)}
                          >
                            <img loading="lazy"
                              src={nft.image} 
                              alt={nft.title} 
                              className="w-full h-full object-cover"
                            />
                            {bannerURL === nft.image && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 py-8 text-center text-muted-foreground">
                          You don't own any NFTs yet. Purchase some NFTs first or use an image URL.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="py-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bannerURL" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="bannerURL"
                          placeholder="https://example.com/banner.jpg"
                          value={bannerURL}
                          onChange={(e) => setBannerURL(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      {bannerURL && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <img loading="lazy"
                            src={bannerURL} 
                            alt="Banner Preview" 
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditBannerOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateBanner} disabled={!bannerURL}>
                    Update Banner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit Profile Image Dialog */}
            <Dialog open={editProfileImageOpen} onOpenChange={setEditProfileImageOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile Image</DialogTitle>
                  <DialogDescription>
                    Select one of your NFTs or enter an image URL.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="nfts">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nfts">Select NFT</TabsTrigger>
                    <TabsTrigger value="url">Enter URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="nfts" className="py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                      {ownedNFTs.length > 0 ? (
                        ownedNFTs.map((nft) => (
                          <div 
                            key={nft._id} 
                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                              profileImageURL === nft.image ? 'border-primary' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setProfileImageURL(nft.image)}
                          >
                            <img loading="lazy"
                              src={nft.image} 
                              alt={nft.title} 
                              className="w-full h-full object-cover"
                            />
                            {profileImageURL === nft.image && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 py-8 text-center text-muted-foreground">
                          You don't own any NFTs yet. Purchase some NFTs first or use an image URL.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="py-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="profileImageURL" className="text-right">
                          Image URL
                        </Label>
                        <Input
                          id="profileImageURL"
                          placeholder="https://example.com/profile.jpg"
                          value={profileImageURL}
                          onChange={(e) => setProfileImageURL(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      {profileImageURL && (
                        <div className="mt-2 flex justify-center">
                          <img loading="lazy"
                            src={profileImageURL} 
                            alt="Profile Preview" 
                            className="w-32 h-32 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditProfileImageOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProfileImage} disabled={!profileImageURL}>
                    Update Profile Image
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="owned" value={activeTab} onValueChange={handleTabChange} className="mb-8">
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
              {ownedNFTs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {ownedNFTs.map((nft) => (
                    <div key={nft._id} className="relative">
                      <NFTCard key={nft._id} nft={nft} />
                      {isOwner && (
                        <div className="absolute top-2 right-2">
                          <div className="relative group">
                            <Button variant="outline" size="icon" className="bg-black/50 text-white backdrop-blur-sm rounded-full border-none">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                            <div className="absolute top-0 right-0 mt-8 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                              <div className="p-1">
                                <Link
                                  to={`/update-nft/${nft.tokenId}`}
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted rounded-md"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit NFT
                                </Link>
                                <button 
                                  onClick={() => setAsProfileImage(nft.image)}
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted rounded-md"
                                >
                                  <User className="h-4 w-4 mr-2" />
                                  Set as Profile Image
                                </button>
                                <button 
                                  onClick={() => setAsBannerImage(nft.image)}
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted rounded-md"
                                >
                                  <Image className="h-4 w-4 mr-2" />
                                  Set as Banner
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {createdNFTs.map((nft, index) => (
                    <div key={nft._id} className="relative">
                      <NFTCard key={nft._id} nft={nft} index={index} />
                      {isOwner && (
                        <div className="absolute top-2 right-2">
                          <div className="relative group">
                            <Button variant="outline" size="icon" className="bg-black/50 text-white backdrop-blur-sm rounded-full border-none">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                            <div className="absolute top-0 right-0 mt-8 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                              <div className="p-1">
                                <Link
                                  to={`/update-nft/${nft.tokenId}`}
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted rounded-md"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Update NFT
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <Link to="/mint" onClick={() => console.log("Create NFT button clicked")}>
                      <Button>Create NFT</Button>
                    </Link>
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

      {/* Followers Dialog */}
      <Dialog open={followersOpen} onOpenChange={setFollowersOpen}>
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Followers {followersList.length > 0 && <span className="ml-2 text-muted-foreground">({followersList.length})</span>}</span>
            </DialogTitle>
            <DialogDescription>
              People who follow this profile
            </DialogDescription>
          </DialogHeader>

          {isLoadingFollowers ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : followersList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No followers yet</p>
              {account === profileAddress && (
                <p className="text-sm text-muted-foreground mt-1">Share your profile to get more followers</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {followersList.map((follower) => (
                <div key={follower.address} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-muted">
                      <AvatarImage 
                        src={follower.profileImage || `https://source.unsplash.com/random/300x300?profile&sig=${follower.address}`} 
                        alt={follower.username || formatAddress(follower.address)} 
                      />
                      <AvatarFallback>{follower.address.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      {/* <p className="font-medium">{follower.username || formatAddress(follower.address)}</p> */}
                      <a 
                        href={`https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/address/${follower.address}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        {follower.username || formatAddress(follower.address)}
                      </a>
                      <p className="text-xs text-muted-foreground">{formatAddress(follower.address)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {account && follower.address !== account && (
                      <Button 
                        variant={follower.isFollowing ? "outline" : "default"}
                        size="sm" 
                        onClick={() => handleFollowFromList(follower.address, follower.isFollowing, true)}
                        className={follower.isFollowing ? "border-primary text-primary hover:bg-primary/10" : ""}
                      >
                        {follower.isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/profile/${follower.address}`} onClick={() => setFollowersOpen(false)}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Following Dialog */}
      <Dialog open={followingOpen} onOpenChange={setFollowingOpen}>
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Following {followingList.length > 0 && <span className="ml-2 text-muted-foreground">({followingList.length})</span>}</span>
            </DialogTitle>
            <DialogDescription>
              People this profile follows
            </DialogDescription>
          </DialogHeader>

          {isLoadingFollowing ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : followingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Not following anyone yet</p>
              {account === profileAddress && (
                <p className="text-sm text-muted-foreground mt-1">Discover creators to follow</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {followingList.map((following) => (
                <div key={following.address} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-muted " >
                      <AvatarImage loading="lazy"
                        src={following.profileImage || `https://source.unsplash.com/random/300x300?profile&sig=${following.address}`} 
                        alt={following.username || formatAddress(following.address)} 
                      />
                      <AvatarFallback>{following.address.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{following.username || formatAddress(following.address)}</p>
                      <p className="text-xs text-muted-foreground">{formatAddress(following.address)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {account && following.address !== account && (
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => handleFollowFromList(following.address, true, false)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        Following
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/profile/${following.address}`} onClick={() => setFollowingOpen(false)}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

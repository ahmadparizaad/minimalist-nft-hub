import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/context/Web3Context";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NFTDetail from "./pages/NFTDetail";
import Mint from "./pages/Mint";
import Profile from "./pages/Profile";
import UpdateNFT from "./pages/UpdateNFT";
import NotFound from "./pages/NotFound";
import TrendingNFTs from "./pages/TrendingNFTs";
import HelpCenter from "./pages/HelpCenter";
import Partners from "./pages/Partners";
import PlatformStatus from "./pages/PlatformStatus";
import Blog from "./pages/Blog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/update-nft/:tokenId" element={<UpdateNFT />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:address" element={<Profile />} />
            <Route path="/trending" element={<TrendingNFTs />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/status" element={<PlatformStatus />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;

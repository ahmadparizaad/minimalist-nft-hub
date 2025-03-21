import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/context/Web3Context";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NFTDetail from "./pages/NFTDetail";
import Mint from "./pages/Mint";
import Profile from "./pages/Profile";
import UpdateNFT from "./pages/UpdateNFT";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/update-nft/:tokenId" element={<UpdateNFT />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:address" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;

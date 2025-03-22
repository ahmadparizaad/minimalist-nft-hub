import { Link } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Track scrolling to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "py-2 bg-white/80 backdrop-blur-md shadow-sm" 
          : "py-3 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center">
          <Link to="/" className="flex gap-1 text-xl font-display font-bold">
          <img src="/processed_logo.png" alt="NapFT" className="h-7 w-auto my-0" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              NapFT
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          <NavLink to="/marketplace" current={location.pathname}>Marketplace</NavLink>
          <NavLink to="/mint" current={location.pathname}>Create</NavLink>
          <NavLink to="/profile" current={location.pathname}>Profile</NavLink>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`hidden md:flex items-center relative transition-all duration-300 ${
            scrolled ? "w-48" : "w-52"
          }`}>
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search NFTs..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-secondary/50 border border-border/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          <WalletButton />
        </div>
      </div>
    </motion.header>
  );
}

// Helper component for navigation links
function NavLink({ to, children, current }: { to: string; children: React.ReactNode; current: string }) {
  const isActive = current === to;
  
  return (
    <Link 
      to={to} 
      className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive 
          ? "text-primary" 
          : "text-foreground/80 hover:text-primary"
      }`}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-3"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      )}
    </Link>
  );
}

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-1 mb-2 text-xl font-display font-bold">
          <img src="/processed_logo.png" alt="NapFT" className="h-6 w-auto my-0" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              NapFT
            </span>
            </div>
            <p className="text-muted-foreground mb-4">
            Empowering NFT creators and traders with real world value, zero gas fees, and a seamless trading experience on SKALE.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-foreground/80 hover:text-primary transition-colors">All NFTs</Link></li>
              <li><Link to="/marketplace?category=Art" className="text-foreground/80 hover:text-primary transition-colors">Art</Link></li>
              <li><Link to="/marketplace?category=Collectibles" className="text-foreground/80 hover:text-primary transition-colors">Collectibles</Link></li>
              <li><Link to="/marketplace?category=Photography" className="text-foreground/80 hover:text-primary transition-colors">Photography</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-foreground/80 hover:text-primary transition-colors">Profile</Link></li>
              <li><Link to="/profile?tab=created" className="text-foreground/80 hover:text-primary transition-colors">Created</Link></li>
              <li><Link to="/profile?tab=owned" className="text-foreground/80 hover:text-primary transition-colors">Owned</Link></li>
              <li><Link to="/profile?tab=activity" className="text-foreground/80 hover:text-primary transition-colors">Activity</Link></li>
            </ul>
          </div>
          
          {/* <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-foreground/80 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/platform-status" className="text-foreground/80 hover:text-primary transition-colors">Platform Status</Link></li>
              <li><Link to="/partners" className="text-foreground/80 hover:text-primary transition-colors">Partners</Link></li>
              <li><Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div> */}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-border/30 pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NapFT. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-foreground/80 hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-foreground/80 hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

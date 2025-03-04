
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-display font-bold mb-4">Ethereal</h3>
            <p className="text-muted-foreground mb-4">
              The premier destination for discovering, collecting, and creating unique digital assets.
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
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/80 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-primary transition-colors">Platform Status</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-primary transition-colors">Partners</a></li>
              <li><a href="#" className="text-foreground/80 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ethereal. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

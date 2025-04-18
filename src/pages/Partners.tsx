import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Building2, 
  ChevronRight, 
  Code2, 
  Globe, 
  Handshake, 
  LayoutGrid, 
  Megaphone,
  ShieldCheck,
  Wallet
} from "lucide-react";

export default function Partners() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactType, setContactType] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your partnership request has been submitted. We'll be in touch soon.");
    // Reset form
    setContactName("");
    setContactEmail("");
    setContactCompany("");
    setContactWebsite("");
    setContactType("");
    setContactMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-20">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Partner With Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join our ecosystem of partners to build the future of digital ownership and collectibles
            </p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <a href="#become-partner">Become a Partner</a>
            </Button>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Trusted Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We collaborate with industry leaders to provide the best experience for our users.
            </p>
          </div>

          <Tabs defaultValue="blockchain">
            <TabsList className="grid grid-cols-3 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplaces</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
            </TabsList>

            <TabsContent value="blockchain" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/ethereum.png" alt="Ethereum" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Ethereum</h3>
                  <p className="text-sm text-muted-foreground mt-1">Primary Blockchain</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/polygon.png" alt="Polygon" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Polygon</h3>
                  <p className="text-sm text-muted-foreground mt-1">Scaling Solution</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/skale.png" alt="SKALE Network" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">SKALE Network</h3>
                  <p className="text-sm text-muted-foreground mt-1">Elastic Sidechains</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/chainlink.png" alt="Chainlink" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Chainlink</h3>
                  <p className="text-sm text-muted-foreground mt-1">Oracle Provider</p>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Blockchain Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      We support multiple blockchains to provide our users with flexibility, lower fees, and a better user experience.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" /> Secure Transactions
                      </li>
                      <li className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" /> Low Gas Fees
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" /> Cross-Chain Support
                      </li>
                    </ul>
                  </div>
                  <Button className="rounded-full" asChild>
                    <a href="#become-partner">Partner With Us <ChevronRight className="h-4 w-4 ml-1" /></a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/opensea.png" alt="OpenSea" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">OpenSea</h3>
                  <p className="text-sm text-muted-foreground mt-1">Marketplace Integration</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/rarible.png" alt="Rarible" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Rarible</h3>
                  <p className="text-sm text-muted-foreground mt-1">Marketplace Partner</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/nftport.png" alt="NFTPort" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">NFTPort</h3>
                  <p className="text-sm text-muted-foreground mt-1">NFT Infrastructure</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/superrare.png" alt="SuperRare" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">SuperRare</h3>
                  <p className="text-sm text-muted-foreground mt-1">Curation Partner</p>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Marketplace Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      We integrate with leading NFT marketplaces to provide wider exposure for creators and more options for collectors.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-primary" /> Wider Distribution
                      </li>
                      <li className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-primary" /> Increased Visibility
                      </li>
                      <li className="flex items-center gap-2">
                        <Handshake className="h-5 w-5 text-primary" /> Seamless Trading
                      </li>
                    </ul>
                  </div>
                  <Button className="rounded-full" asChild>
                    <a href="#become-partner">Partner With Us <ChevronRight className="h-4 w-4 ml-1" /></a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/aws.png" alt="AWS" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">AWS</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cloud Infrastructure</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/pinata.png" alt="Pinata" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Pinata</h3>
                  <p className="text-sm text-muted-foreground mt-1">IPFS Storage</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/alchemy.png" alt="Alchemy" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">Alchemy</h3>
                  <p className="text-sm text-muted-foreground mt-1">API Provider</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-border/20 shadow-sm hover:shadow-md transition-shadow">
                  <img src="/partners/thegraph.png" alt="The Graph" className="h-16 mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold">The Graph</h3>
                  <p className="text-sm text-muted-foreground mt-1">Indexing Protocol</p>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Technology Partners</h3>
                    <p className="text-muted-foreground mb-4">
                      We collaborate with leading technology providers to ensure our platform is fast, secure, and reliable.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" /> Developer APIs
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" /> Security Solutions
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" /> Global Infrastructure
                      </li>
                    </ul>
                  </div>
                  <Button className="rounded-full" asChild>
                    <a href="#become-partner">Partner With Us <ChevronRight className="h-4 w-4 ml-1" /></a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Partner Benefits */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Partnership Benefits</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Partner with us to unlock a range of benefits and opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-muted-foreground">
                  Access our growing community of collectors, creators, and enthusiasts from around the world.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Co-Marketing</h3>
                <p className="text-muted-foreground">
                  Joint marketing campaigns, content creation, social media promotion, and PR opportunities.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">API Access</h3>
                <p className="text-muted-foreground">
                  Priority access to our APIs, developer resources, and technical support for seamless integration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Types */}
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore various ways to collaborate with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Technology Integration</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Integrate your blockchain, wallet, infrastructure, or other technology with our platform to expand your reach and provide additional options to our users.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>API integration with your service</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Custom implementation of your technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Co-development of new features</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <a href="#become-partner">Apply Now</a>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Marketing Partnership</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Join forces with us for co-marketing initiatives, sponsor NFT drops, or participate in joint events to reach our growing community of collectors and creators.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Co-branded NFT collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Joint promotional campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Exclusive community events</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <a href="#become-partner">Apply Now</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Become a Partner Form */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-16" id="become-partner">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Become a Partner</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Interested in partnering with us? Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-border/20 max-w-3xl mx-auto">
              <form onSubmit={handlePartnershipSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name *
                    </label>
                    <Input 
                      id="name" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email *
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@example.com" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1">
                      Company *
                    </label>
                    <Input 
                      id="company" 
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      placeholder="Your company name" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-1">
                      Website *
                    </label>
                    <Input 
                      id="website" 
                      type="url" 
                      value={contactWebsite}
                      onChange={(e) => setContactWebsite(e.target.value)}
                      placeholder="https://example.com" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="partner-type" className="block text-sm font-medium mb-1">
                      Partnership Type *
                    </label>
                    <Select
                      value={contactType}
                      onValueChange={setContactType}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology Integration</SelectItem>
                        <SelectItem value="marketing">Marketing Partnership</SelectItem>
                        <SelectItem value="blockchain">Blockchain Partner</SelectItem>
                        <SelectItem value="marketplace">Marketplace Integration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Partnership Details *
                    </label>
                    <Textarea 
                      id="message" 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please describe your partnership proposal and how we can collaborate..." 
                      rows={5} 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Submit Partnership Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
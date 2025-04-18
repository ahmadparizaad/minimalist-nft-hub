import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Search, 
  HelpCircle, 
  FileText, 
  ShieldQuestion, 
  Wallet, 
  Truck, 
  PanelRight,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
    // Implement actual search functionality here
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent. We'll respond shortly.");
    // Reset form
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-16">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl font-display font-bold mb-6">How can we help you?</h1>
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  className="rounded-full px-6 py-6 pr-12 border-primary/20 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border/20 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Documentation</h3>
              <p className="text-muted-foreground mb-4">Learn how to use our platform with step-by-step guides.</p>
              <a href="#docs" className="text-primary flex items-center gap-1 hover:underline">
                Read guides <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border/20 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShieldQuestion className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FAQs</h3>
              <p className="text-muted-foreground mb-4">Find answers to the most common questions about our platform.</p>
              <a href="#faqs" className="text-primary flex items-center gap-1 hover:underline">
                View FAQs <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border/20 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-muted-foreground mb-4">Reach out to our team for personalized help and support.</p>
              <a href="#contact" className="text-primary flex items-center gap-1 hover:underline">
                Get in touch <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mb-16" id="faqs">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find quick answers to the most common questions about our platform.
              </p>
            </div>

            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                  <AccordionItem value="what-is-nft">
                    <AccordionTrigger>What is an NFT?</AccordionTrigger>
                    <AccordionContent>
                      NFT stands for Non-Fungible Token. Unlike cryptocurrencies such as Bitcoin or Ethereum, NFTs are unique digital assets that represent ownership of a specific item, such as digital art, music, videos, or in-game items. Each NFT has a unique identifier that cannot be replicated, making it one-of-a-kind.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-to-register">
                    <AccordionTrigger>How do I create an account?</AccordionTrigger>
                    <AccordionContent>
                      You don't need to create a traditional account to use our platform. Simply connect your Web3 wallet (like MetaMask) by clicking on the "Connect Wallet" button in the top right corner. This will serve as your account and allow you to buy, sell, and create NFTs on our platform.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="fees">
                    <AccordionTrigger>What fees are charged on the platform?</AccordionTrigger>
                    <AccordionContent>
                      Our platform charges a 2.5% fee on all sales. There may also be gas fees for transactions on the blockchain, which vary depending on network congestion. Creators can also set royalty fees (typically 5-10%) which are paid to them on secondary sales.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="supported-chains">
                    <AccordionTrigger>Which blockchains do you support?</AccordionTrigger>
                    <AccordionContent>
                      Currently, we support Ethereum, Polygon, and SKALE Network. We plan to add support for more blockchains in the future to provide our users with more options and lower fees.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="wallet">
                <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                  <AccordionItem value="supported-wallets">
                    <AccordionTrigger>Which wallets are supported?</AccordionTrigger>
                    <AccordionContent>
                      We support most popular Web3 wallets including MetaMask, WalletConnect, Coinbase Wallet, and Fortmatic. More wallets will be added in future updates.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="wallet-safety">
                    <AccordionTrigger>How do I keep my wallet safe?</AccordionTrigger>
                    <AccordionContent>
                      Never share your wallet's private key or seed phrase with anyone. Be cautious of phishing attempts. Always verify the website URL before connecting your wallet. Consider using a hardware wallet for additional security, and keep your wallet software updated.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="disconnect-wallet">
                    <AccordionTrigger>How do I disconnect my wallet?</AccordionTrigger>
                    <AccordionContent>
                      To disconnect your wallet, click on your profile icon in the top right corner and select "Disconnect Wallet" from the dropdown menu. You can also disconnect your wallet directly from your wallet's interface.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="nfts">
                <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                  <AccordionItem value="create-nft">
                    <AccordionTrigger>How do I create an NFT?</AccordionTrigger>
                    <AccordionContent>
                      To create an NFT, click on the "Create" button in the navigation bar. Upload your digital asset (image, video, audio, etc.), fill in the details like title, description, and price, and click "Create." You'll need to confirm the transaction in your wallet and pay a small gas fee to mint your NFT on the blockchain.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="file-types">
                    <AccordionTrigger>What file types can I upload?</AccordionTrigger>
                    <AccordionContent>
                      We support various file types including JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, and GLB. The maximum file size is 100MB. For the best experience, we recommend optimizing your files before uploading.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ownership">
                    <AccordionTrigger>What rights do I have when I buy an NFT?</AccordionTrigger>
                    <AccordionContent>
                      When you purchase an NFT, you own the token on the blockchain that represents the digital asset. This gives you ownership rights to the specific token, but not necessarily the copyright or intellectual property rights to the underlying work, unless explicitly specified by the creator. Always check the terms associated with each NFT.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="transactions">
                <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                  <AccordionItem value="transaction-time">
                    <AccordionTrigger>How long do transactions take?</AccordionTrigger>
                    <AccordionContent>
                      Transaction times vary depending on the blockchain network, gas fees paid, and network congestion. Ethereum transactions typically take 30 seconds to a few minutes, while transactions on Polygon and SKALE are usually faster and less expensive.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="transaction-failed">
                    <AccordionTrigger>What should I do if my transaction fails?</AccordionTrigger>
                    <AccordionContent>
                      If your transaction fails, check that you have enough funds to cover both the NFT price and gas fees. You can try again with a higher gas fee to increase the likelihood of success. If problems persist, check our platform status page for any network issues or contact our support team for assistance.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="refunds">
                    <AccordionTrigger>Are refunds possible?</AccordionTrigger>
                    <AccordionContent>
                      Due to the nature of blockchain transactions, refunds are generally not possible once a transaction is confirmed on the blockchain. All sales are final. We encourage users to thoroughly research NFTs before making purchases.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mb-16" id="docs">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Documentation & Guides</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive guides to help you navigate our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
                  <p className="text-muted-foreground mb-4">Learn the basics of using our NFT platform.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Wallet Setup</h3>
                  <p className="text-muted-foreground mb-4">Configure your wallet for buying and selling NFTs.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Selling Your NFTs</h3>
                  <p className="text-muted-foreground mb-4">Learn how to list and sell your digital assets.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <PanelRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Features</h3>
                  <p className="text-muted-foreground mb-4">Discover all the powerful features of our platform.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <ShieldQuestion className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Security Best Practices</h3>
                  <p className="text-muted-foreground mb-4">Keep your NFTs and wallet secure with these tips.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Creating NFT Collections</h3>
                  <p className="text-muted-foreground mb-4">Learn to create and manage collections of NFTs.</p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16" id="contact">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Contact Support</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Need help? Our support team is here to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-xl border border-border/20 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input 
                        id="name" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
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
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="How can we help you?" 
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please describe your issue in detail..." 
                      rows={6} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </div>

              <div>
                <div className="bg-white p-6 rounded-xl border border-border/20 shadow-sm mb-4">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">support@nfthub.example</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">+1 (888) 555-NFT1</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-border/20 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <p className="text-sm text-muted-foreground">
                      Response time: We aim to respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">NapFT Blog</h1>
          <p className="text-muted-foreground mb-8">
            Welcome to the NapFT Blog! Explore our latest articles, updates, and insights about the NFT ecosystem, platform features, and industry trends.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>March 2025:</strong> How NapFT is revolutionizing NFT trading</li>
            <li><strong>February 2025:</strong> Zero gas fees: The future of NFTs</li>
            <li><strong>January 2025:</strong> Top NFT trends to watch in 2025</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
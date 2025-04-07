import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function HelpCenter() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground mb-8">
            Welcome to the NapFT Help Center. Here, you can find answers to frequently asked questions, guides on how to use our platform, and support for any issues you may encounter.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>How to mint your first NFT</li>
            <li>Understanding gas-free transactions on SKALE</li>
            <li>Managing your NFT collections</li>
            <li>Contacting support for assistance</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
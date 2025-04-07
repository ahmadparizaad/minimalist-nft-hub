import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Partners() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">Our Partners</h1>
          <p className="text-muted-foreground mb-8">
            At NapFT, we collaborate with industry-leading partners to bring you a seamless and innovative NFT experience. Our partners help us ensure zero gas fees, high scalability, and a secure trading environment.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>SKALE Network:</strong> Powering our gas-free transactions</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">
            By using NapFT, you agree to the following terms and conditions. Please read them carefully to understand your rights and responsibilities.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must comply with all applicable laws and regulations</li>
            <li>NapFT is not responsible for the content of NFTs created by users</li>
            <li>Users are responsible for securing their wallets and private keys</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
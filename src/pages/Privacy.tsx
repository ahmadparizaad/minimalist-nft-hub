import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            At NapFT, we value your privacy. This policy outlines how we collect, use, and protect your personal information while using our platform.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not share your personal information with third parties</li>
            <li>All transactions are secured using blockchain technology</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
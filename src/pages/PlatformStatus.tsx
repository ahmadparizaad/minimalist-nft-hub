import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function PlatformStatus() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-12">
          <h1 className="text-3xl font-display font-bold mb-4">Platform Status</h1>
          <p className="text-muted-foreground mb-8">
            Stay updated on the current status of the NapFT platform. Here, you can find information about ongoing maintenance, resolved issues, and system performance.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Operational:</strong> All systems are running smoothly</li>
            <li><strong>Maintenance:</strong> Scheduled maintenance on April 10, 2025</li>
            <li><strong>Resolved Issues:</strong> Wallet connection bug fixed</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold">⚔️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Block Battle
            </h1>
            <p className="text-xs text-gray-400">Solana Betting Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Devnet</span>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}

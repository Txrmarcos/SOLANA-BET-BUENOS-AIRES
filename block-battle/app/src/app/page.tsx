"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CreateBet from "@/components/CreateBet";
import JoinBet from "@/components/JoinBet";
import ManageBet from "@/components/ManageBet";
import OpenBets from "@/components/OpenBets";

type Tab = "browse" | "create" | "join" | "manage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-400 font-medium">Live on Devnet</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-slide-in">
            Block Battle
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Decentralized block-based betting platform on Solana.
            <span className="block text-purple-400 font-semibold mt-2">
              Choose your block. Battle for victory. Claim your prize.
            </span>
          </p>

          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-300">Instant Settlement</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-2xl">🔒</span>
              <span className="text-gray-300">Trustless Escrow</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-2xl">👥</span>
              <span className="text-gray-300">Up to 100 Players</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[
            { id: "browse" as Tab, label: "Browse Bets", icon: "🎰" },
            { id: "create" as Tab, label: "Create Bet", icon: "🎯" },
            { id: "join" as Tab, label: "Join Bet", icon: "🎲" },
            { id: "manage" as Tab, label: "Manage", icon: "👑" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {activeTab === "browse" && <OpenBets />}
          {activeTab === "create" && <CreateBet />}
          {activeTab === "join" && <JoinBet />}
          {activeTab === "manage" && <ManageBet />}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold text-white mb-2">Create or Join</h3>
              <p className="text-gray-400">
                Create a new bet or join an existing one. Choose your block (1-25) and deposit your stake.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold text-white mb-2">Wait for Reveal</h3>
              <p className="text-gray-400">
                After the lock time, the arbiter reveals the winning block. Multiple winners split the pot proportionally.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold text-white mb-2">Claim Rewards</h3>
              <p className="text-gray-400">
                If you picked the winning block, claim your share of the prize pool instantly to your wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Program Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Program Address</p>
            <code className="text-xs text-purple-400 font-mono">
              EqzTrTYgAttzSmVbjpm6t6SBUVT5Ab2zWVTxaYDE9iBF
            </code>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Built on Solana • Powered by Anchor Framework</p>
          <p className="mt-2">Block Battle - Decentralized Betting Platform</p>
        </div>
      </footer>
    </div>
  );
}

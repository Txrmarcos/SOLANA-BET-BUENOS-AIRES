"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DungeonLayout from "@/components/pixel-dungeon/DungeonLayout";
import DungeonHeader from "@/components/pixel-dungeon/DungeonHeader";
import CreateBet from "@/components/CreateBet";
import ManageBet from "@/components/ManageBet";
import OpenBets from "@/components/OpenBets";
import QuickPlayPixel from "@/components/QuickPlayPixel";
import { motion } from "framer-motion";
import "@/styles/pixel-dungeon.css";

type Tab = "play" | "browse" | "create" | "manage";

const TAB_ICONS: Record<Tab, string> = {
  play: "⚔️",
  browse: "🗺️",
  create: "🔨",
  manage: "👑",
};

function HomeContent() {
  const [activeTab, setActiveTab] = useState<Tab>("play");
  const searchParams = useSearchParams();
  const betParam = searchParams.get("bet");

  useEffect(() => {
    if (betParam) {
      setActiveTab("play");
    }
  }, [betParam]);

  return (
    <DungeonLayout>
      {/* Pixel Dungeon Header */}
      <DungeonHeader />

      {/* Navigation Tabs */}
      <nav className="sticky top-20 z-40 backdrop-blur-xl bg-[#0E0E10]/90 border-b-4 border-purple-500/30 relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-center py-4">
            <div className="inline-flex items-center gap-2 bg-black/50 rounded-full p-1.5 border-4 border-purple-500/30">
              {[
                { id: "play" as Tab, label: "PLAY" },
                { id: "browse" as Tab, label: "BROWSE" },
                { id: "create" as Tab, label: "CREATE" },
                { id: "manage" as Tab, label: "MANAGE" },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full pixel-font text-xs transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{TAB_ICONS[tab.id]}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Only on Play tab */}
      {activeTab === "play" && (
        <section className="relative py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <motion.div
                className="space-y-4"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold pixel-font text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400"
                    style={{ textShadow: "4px 4px 0px #000, 6px 6px 0px rgba(168, 85, 247, 0.3)" }}>
                  🗝️ PIXEL DUNGEON 🗝️
                </h1>
                <div className="text-2xl md:text-4xl pixel-font">
                  <span className="text-yellow-300" style={{ textShadow: "3px 3px 0px #000" }}>
                    CHOOSE. RISK. CONQUER.
                  </span>
                </div>
              </motion.div>

              <motion.p
                className="text-sm md:text-base pixel-font text-cyan-300 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Only ONE door leads to treasure. The others hide deadly traps!
              </motion.p>

              <motion.div
                className="flex gap-3 justify-center flex-wrap pt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FeaturePill icon="⚡" text="Instant Reveal" />
                <FeaturePill icon="🎮" text="8-Bit RPG" />
                <FeaturePill icon="💰" text="On-Chain Loot" />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === "play" && <QuickPlayPixel betAddress={betParam} />}
          {activeTab === "browse" && <OpenBets />}
          {activeTab === "create" && <CreateBet />}
          {activeTab === "manage" && <ManageBet />}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-purple-500/30 mt-20 py-8 relative z-10 bg-black/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs pixel-font text-purple-300">
            BUILT ON SOLANA • POWERED BY PIXEL MAGIC ✨
          </p>
        </div>
      </footer>
    </DungeonLayout>
  );
}

function FeaturePill({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-2 border-purple-500/30 rounded-full hover:border-cyan-500/50 transition-all">
      <span className="text-base">{icon}</span>
      <span className="text-xs pixel-font text-gray-300">{text}</span>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mb-4"></div>
          <p className="pixel-font text-purple-300">LOADING DUNGEON...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

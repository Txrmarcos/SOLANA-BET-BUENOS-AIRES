"use client";

import { motion } from "framer-motion";
import PixelWalletButton from "./PixelWalletButton";

type Tab = "browse" | "create" | "manage";

const TAB_ICONS: Record<Tab, string> = {
  browse: "🗺️",
  create: "🔨",
  manage: "👑",
};

interface DungeonHeaderProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  showNavigation?: boolean;
}

export default function DungeonHeader({ activeTab, onTabChange, showNavigation = true }: DungeonHeaderProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/90 border-b-4 border-gray-800/50 relative crt-effect">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo with Pixel Art Style */}
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Logo Icon */}
            <motion.div
              className="relative w-10 h-10 bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700 flex items-center justify-center pixel-art"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255, 69, 0, 0.2)",
                  "0 0 30px rgba(255, 69, 0, 0.3)",
                  "0 0 20px rgba(255, 69, 0, 0.2)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
              }}
            >
              <motion.span
                className="text-xl filter drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                💀
              </motion.span>

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-700/50" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-700/50" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-700/50" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-700/50" />
            </motion.div>

            {/* Title */}
            <div>
              <motion.h1
                className="text-lg font-bold pixel-font text-gray-100"
                style={{
                  textShadow: "2px 2px 0px #000, 4px 4px 8px rgba(0, 0, 0, 0.8)",
                }}
              >
                PIXEL DUNGEON
              </motion.h1>
              <p className="text-[9px] pixel-font text-gray-600">
                Block Battle Arena
              </p>
            </div>
          </motion.div>

          {/* Center: Navigation Tabs (only show if not viewing a pool) */}
          {showNavigation && onTabChange && (
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                {/* Dark glow effect behind tabs */}
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-red-950/10 via-orange-950/10 to-red-950/10 blur-xl"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div
                  className="relative flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 border-4 border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
                  style={{
                    clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  {[
                    { id: "browse" as Tab, label: "BROWSE" },
                    { id: "create" as Tab, label: "CREATE" },
                    { id: "manage" as Tab, label: "MANAGE" },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`relative px-5 py-2.5 pixel-font text-xs transition-all group overflow-hidden ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-300"
                      }`}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      animate={activeTab === tab.id ? {
                        boxShadow: [
                          "0 0 15px rgba(255, 69, 0, 0.2)",
                          "0 0 25px rgba(255, 140, 0, 0.3)",
                          "0 0 15px rgba(255, 69, 0, 0.2)",
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {/* Active background with dark gradient */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-gray-700"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                          style={{
                            clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                          }}
                        />
                      )}

                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-red-900/0 group-hover:from-orange-900/10 group-hover:to-red-900/10 transition-all duration-300" />

                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-2">
                        <motion.span
                          className="text-lg"
                          animate={activeTab === tab.id ? {
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {TAB_ICONS[tab.id]}
                        </motion.span>
                        <span className="font-bold">{tab.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Side: Devnet Badge + Wallet */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Devnet Indicator */}
            <motion.div
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-lg pixel-art"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  opacity: [1, 0.3, 1],
                  boxShadow: [
                    "0 0 5px rgba(34, 197, 94, 0.8)",
                    "0 0 15px rgba(34, 197, 94, 0.8)",
                    "0 0 5px rgba(34, 197, 94, 0.8)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <span className="text-xs text-green-400 pixel-font">DEVNET</span>
            </motion.div>

            {/* Wallet Component */}
            <PixelWalletButton />
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-700/30 to-transparent" />
    </nav>
  );
}

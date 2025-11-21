"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function DungeonHeader() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0E0E10]/90 border-b-4 border-purple-500/30 relative crt-effect">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Pixel Art Style */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Logo Icon */}
            <motion.div
              className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 border-4 border-purple-400 flex items-center justify-center pixel-art"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 40px rgba(168, 85, 247, 0.8)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <motion.span
                className="text-3xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🗝️
              </motion.span>

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-sm" />
            </motion.div>

            {/* Title */}
            <div>
              <motion.h1
                className="text-2xl font-bold pixel-font text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400"
                style={{
                  textShadow: "2px 2px 0px #000, 4px 4px 0px rgba(168, 85, 247, 0.3)",
                }}
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              >
                PIXEL DUNGEON
              </motion.h1>
              <p className="text-xs pixel-font text-cyan-300/80">
                Block Battle Arena
              </p>
            </div>
          </motion.div>

          {/* Right Side: Devnet Badge + Wallet */}
          <div className="flex items-center gap-4">
            {/* Devnet Indicator */}
            <motion.div
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-lg pixel-art"
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
            <Header />
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
    </nav>
  );
}

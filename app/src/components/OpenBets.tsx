"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useBetsList } from "@/hooks/useBetsList";
import { getExplorerAddressUrl } from "@/lib/explorer";

export default function OpenBets() {
  const { bets, loading, error, loadOpenBets, invalidateCache } = useBetsList();

  useEffect(() => {
    // Always try to load on mount to check for new data
    // The hook will use cache if available and valid
    loadOpenBets();
  }, [loadOpenBets]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRefresh = async () => {
    invalidateCache();
    const result = await loadOpenBets(true);
    if (result) {
      toast.success(`Encontradas ${result.length} apostas abertas!`);
    }
  };

  const copyShareLink = (betAddress: string) => {
    const shareUrl = `${window.location.origin}?bet=${betAddress}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied!");
  };

  const joinBet = (betAddress: string) => {
    // Navigate with bet parameter
    window.location.href = `${window.location.origin}?bet=${betAddress}`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section - More dynamic */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Dark atmospheric glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-red-950/10 via-orange-950/10 to-red-950/10 blur-3xl" />

        <div className="relative bg-gradient-to-br from-black via-gray-950 to-black p-8 overflow-hidden border-4 border-gray-800 shadow-[inset_0_2px_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.8)]" style={{clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))'}}>
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[url('/stone-texture.png')] opacity-[0.06] mix-blend-overlay" />

          {/* Floating particles - REDUZIDO para 3 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gray-700/20 will-change-transform"
                style={{
                  left: `${25 + i * 25}%`,
                  top: `${35 + i * 15}%`,
                }}
                animate={{
                  y: [0, -35, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="text-6xl"
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🗺️
              </motion.div>
              <div>
                <motion.h2
                  className="text-3xl md:text-4xl pixel-font mb-1 text-gray-100"
                  style={{
                    textShadow: "4px 4px 0px #000, 8px 8px 20px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  ACTIVE DUNGEONS
                </motion.h2>
                <p className="text-sm pixel-font text-gray-600">Choose your doom, brave soul</p>
              </div>
            </div>

            <motion.button
              onClick={handleRefresh}
              disabled={loading}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white pixel-font text-xs transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,0,0,0.8)] border-2 border-gray-700 disabled:cursor-not-allowed"
              style={{clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'}}
            >
              {loading ? "CARREGANDO..." : "🔄 ATUALIZAR"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Dungeon List */}
      <div className="relative z-10">

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-gray-700 border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm pixel-font text-gray-500">Loading dungeons...</p>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💀</div>
            <p className="pixel-font text-gray-500">NO ACTIVE DUNGEONS</p>
            <p className="text-sm pixel-font text-gray-600 mt-2">Create one in the 🔨 tab!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet, index) => (
              <motion.div
                key={bet.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Hover glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-950/0 via-orange-950/0 to-red-950/0 group-hover:from-red-950/20 group-hover:via-orange-900/20 group-hover:to-red-950/20 blur-xl transition-all duration-500" />

                <div className="relative bg-gradient-to-br from-black/90 via-gray-950/90 to-black/90 p-6 border-4 border-gray-800 group-hover:border-gray-700 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_1px_10px_rgba(0,0,0,0.9),0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden" style={{clipPath: 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))'}}>
                  {/* Stone texture */}
                  <div className="absolute inset-0 bg-[url('/stone-texture.png')] opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" />

                  {/* Subtle animated shimmer */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-900/5 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 5,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        {/* Dungeon type badge with floating animation */}
                        <motion.div
                          className={`relative flex items-center gap-2 px-4 py-2 border-2 ${
                            bet.isAutomatic
                              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700'
                              : 'bg-gradient-to-br from-orange-950/40 to-red-950/40 border-orange-900/60'
                          } shadow-lg`}
                          style={{clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'}}
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2,
                          }}
                        >
                          <span className="text-3xl">{bet.isAutomatic ? "⚡" : "👑"}</span>
                          <div>
                            <p className={`text-[11px] pixel-font font-bold ${bet.isAutomatic ? 'text-gray-400' : 'text-orange-500'}`}>
                              {bet.isAutomatic ? 'AUTOMATIC' : 'ARBITER'}
                            </p>
                            <p className="text-[9px] pixel-font text-gray-400 font-mono">
                              {bet.address.slice(0, 6)}...{bet.address.slice(-4)}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => window.open(getExplorerAddressUrl(bet.address), "_blank")}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-orange-700 text-gray-400 hover:text-white pixel-font text-[10px] transition-all shadow-lg"
                          style={{clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'}}
                          title="View on Solana Explorer"
                        >
                          🔍
                        </motion.button>
                        <motion.button
                          onClick={() => copyShareLink(bet.address)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-orange-700 text-gray-400 hover:text-white pixel-font text-[10px] transition-all shadow-lg"
                          style={{clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'}}
                        >
                          📋
                        </motion.button>
                        <motion.button
                          onClick={() => joinBet(bet.address)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white pixel-font text-[11px]  transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-green-400/50"
                        >
                          ⚔️ ENTER
                        </motion.button>
                      </div>
                    </div>

                    {/* Stats row - flowing pills instead of grid */}
                    <div className="flex flex-wrap items-center gap-3">
                      <StatBadge icon="💰" label="Entry" value={`${bet.minDeposit.toFixed(2)} SOL`} color="gray" />
                      <StatBadge icon="🏆" label="Pool" value={`${bet.totalPool.toFixed(2)} SOL`} color="orange" />
                      <StatBadge icon="👥" label="Players" value={`${bet.playerCount}/100`} color="yellow" />
                      <StatBadge
                        icon={bet.isAutomatic ? "⚡" : "⏰"}
                        label={bet.isAutomatic ? "Auto" : "Lock"}
                        value={new Date(bet.lockTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        color="green"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat badge component for dungeon cards
function StatBadge({
  icon,
  label,
  value,
  color = "gray",
}: {
  icon: string;
  label: string;
  value: string;
  color?: "gray" | "orange" | "yellow" | "green";
}) {
  const colorClasses = {
    gray: "bg-gray-800/20 border-gray-700/40 text-gray-400",
    orange: "bg-orange-950/20 border-orange-900/40 text-orange-500",
    yellow: "bg-yellow-900/20 border-yellow-800/40 text-yellow-600",
    green: "bg-green-900/20 border-green-800/40 text-green-500",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5  border backdrop-blur-sm ${colorClasses[color]}`}
    >
      <span className="text-sm">{icon}</span>
      <div className="text-left">
        <p className="text-[8px] pixel-font opacity-70 leading-none">{label}</p>
        <p className="text-[11px] pixel-font font-bold text-white leading-none mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

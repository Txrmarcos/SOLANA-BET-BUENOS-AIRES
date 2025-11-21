"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PixelWalletButton() {
  const { wallet, connected, publicKey, connect, disconnect, select, wallets } = useWallet();
  const [showModal, setShowModal] = useState(false);

  const handleWalletClick = () => {
    if (connected) {
      disconnect();
    } else {
      setShowModal(true);
    }
  };

  const handleSelectWallet = async (walletName: string) => {
    const selectedWallet = wallets.find(w => w.adapter.name === walletName);
    if (selectedWallet) {
      select(selectedWallet.adapter.name);
      try {
        await connect();
        setShowModal(false);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* Wallet Button */}
      <motion.button
        onClick={handleWalletClick}
        className="relative px-4 py-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-4 border-gray-700 pixel-font text-sm text-white hover:border-orange-700 transition-all"
        style={{
          clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {connected && publicKey ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{formatAddress(publicKey.toBase58())}</span>
          </div>
        ) : (
          <span>🔐 CONNECT</span>
        )}

        {/* Button glow */}
        {!connected && (
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/20 to-red-600/20 blur -z-10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Wallet Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div
                className="relative bg-gradient-to-br from-black via-gray-950 to-black border-4 border-gray-800 p-6 shadow-2xl mx-4"
                style={{
                  clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)'
                }}
              >
                {/* Stone texture overlay */}
                <div className="absolute inset-0 bg-[url('/stone-texture.png')] opacity-5" />

                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-900 border-2 border-red-700 text-white pixel-font text-xs hover:bg-red-800 transition-colors"
                  style={{
                    clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                  }}
                >
                  ✕
                </button>

                {/* Header */}
                <div className="relative z-10 text-center mb-6">
                  <motion.div
                    className="inline-block text-4xl mb-3"
                    animate={{
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    🔐
                  </motion.div>
                  <h2
                    className="text-2xl pixel-font text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 mb-2"
                    style={{
                      textShadow: "4px 4px 0px #000",
                    }}
                  >
                    CONNECT WALLET
                  </h2>
                  <p className="text-xs pixel-font text-gray-500">
                    Choose your preferred wallet
                  </p>
                </div>

                {/* Wallet List */}
                <div className="relative z-10 space-y-3">
                  {wallets.filter(w => w.readyState === "Installed" || w.readyState === "Loadable").map((w) => (
                    <motion.button
                      key={w.adapter.name}
                      onClick={() => handleSelectWallet(w.adapter.name)}
                      className="w-full p-4 bg-gradient-to-r from-gray-900 to-black border-2 border-gray-800 hover:border-orange-700 transition-all group"
                      style={{
                        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
                      }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Wallet Icon */}
                          {w.adapter.icon && (
                            <img
                              src={w.adapter.icon}
                              alt={w.adapter.name}
                              className="w-8 h-8 rounded-lg"
                            />
                          )}
                          <span className="pixel-font text-sm text-white group-hover:text-orange-300 transition-colors">
                            {w.adapter.name}
                          </span>
                        </div>
                        <span className="text-orange-700 group-hover:text-orange-500 transition-colors">→</span>
                      </div>
                    </motion.button>
                  ))}

                  {/* No wallets found */}
                  {wallets.filter(w => w.readyState === "Installed" || w.readyState === "Loadable").length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">💀</div>
                      <p className="text-sm pixel-font text-gray-500 mb-4">
                        NO WALLETS DETECTED
                      </p>
                      <a
                        href="https://phantom.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-gradient-to-r from-orange-900 to-red-900 border-2 border-orange-700 text-white pixel-font text-xs hover:from-orange-800 hover:to-red-800 transition-all"
                        style={{
                          clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                        }}
                      >
                        📥 GET PHANTOM
                      </a>
                    </div>
                  )}
                </div>

                {/* Fire glow effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-orange-500/10 via-red-500/5 to-transparent blur-3xl pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

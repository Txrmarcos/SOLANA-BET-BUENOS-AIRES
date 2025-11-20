"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useBlockBattle } from "@/lib/useBlockBattle";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBetManager } from "@/hooks/useBetManager";

const TOTAL_BLOCKS = 25;

export default function ManageBet() {
  const { connected, publicKey } = useWallet();
  const { revealWinner, claimWinnings, cancelBet, getBetData } = useBlockBattle();
  const { activeBet, betData: activeBetData, refreshBet } = useBetManager();
  const [loading, setLoading] = useState(false);
  const [betAddress, setBetAddress] = useState("");
  const [betData, setBetData] = useState<any>(null);
  const [winningBlock, setWinningBlock] = useState<number | null>(null);

  // Auto-load active bet if available
  useEffect(() => {
    if (activeBet && !betAddress) {
      setBetAddress(activeBet.address);
      setBetData(activeBetData);
    }
  }, [activeBet, activeBetData]);

  const handleLoadBet = async () => {
    if (!betAddress) return;

    try {
      const betPDA = new PublicKey(betAddress);
      const data = await getBetData(betPDA);
      setBetData(data);
    } catch (error) {
      console.error("Error loading bet:", error);
    }
  };

  const handleReveal = async () => {
    if (!betAddress || winningBlock === null) return;

    setLoading(true);
    try {
      const betPDA = new PublicKey(betAddress);
      await revealWinner(betPDA, winningBlock);
      await handleLoadBet();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!betAddress) return;

    setLoading(true);
    try {
      const betPDA = new PublicKey(betAddress);
      await claimWinnings(betPDA);
      await handleLoadBet();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!betAddress) return;

    setLoading(true);
    try {
      const betPDA = new PublicKey(betAddress);
      await cancelBet(betPDA);
      await handleLoadBet();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isArbiter = betData && publicKey && betData.arbiter.toBase58() === publicKey.toBase58();
  const isCreator = betData && publicKey && betData.creator.toBase58() === publicKey.toBase58();
  const status = betData ? Object.keys(betData.status)[0] : null;

  if (!connected) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
        <p className="text-gray-400">Connect your wallet to manage bets</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <span className="text-2xl">👑</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Bet</h2>
          <p className="text-sm text-gray-400">Reveal winner or claim prizes</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bet Address
            {activeBet && (
              <span className="ml-2 text-xs text-green-400">
                ✓ Auto-loaded from your active bet
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={betAddress}
              onChange={(e) => setBetAddress(e.target.value)}
              className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
              placeholder="Bet PDA address"
            />
            <button
              onClick={handleLoadBet}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        {betData && (
          <>
            <div className="bg-black/30 rounded-xl p-4 border border-gray-700 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Pool</p>
                  <p className="text-white font-semibold text-lg">
                    {(betData.totalPool.toNumber() / 1e9).toFixed(4)} SOL
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Players</p>
                  <p className="text-white font-semibold text-lg">{betData.playerCount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    status === 'open' ? 'bg-blue-500/20 text-blue-400' :
                    status === 'revealed' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Winner Block</p>
                  <p className="text-white font-semibold text-lg">
                    {betData.winnerBlock ? betData.winnerBlock : "Not revealed"}
                  </p>
                </div>
              </div>

              {isArbiter && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-green-400 text-sm font-medium">✓ You are the arbiter</p>
                </div>
              )}

              {isCreator && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-blue-400 text-sm font-medium">✓ You created this bet</p>
                </div>
              )}
            </div>

            {/* Arbiter: Reveal Winner */}
            {isArbiter && status === 'open' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Select Winning Block
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: TOTAL_BLOCKS }, (_, i) => i + 1).map((block) => (
                    <button
                      key={block}
                      onClick={() => setWinningBlock(block)}
                      className={`aspect-square rounded-xl font-bold text-lg transition-all ${
                        winningBlock === block
                          ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-105 shadow-lg"
                          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleReveal}
                  disabled={loading || winningBlock === null}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
                >
                  {loading ? "Revealing..." : winningBlock ? `Reveal Block ${winningBlock} as Winner` : "Select a Block"}
                </button>
              </div>
            )}

            {/* Player: Claim Winnings */}
            {status === 'revealed' && (
              <button
                onClick={handleClaim}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
              >
                {loading ? "Claiming..." : "🏆 Claim Winnings"}
              </button>
            )}

            {/* Creator: Cancel Bet */}
            {isCreator && status === 'open' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50"
              >
                {loading ? "Cancelling..." : "❌ Cancel Bet"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
  const isPlayer = betData && publicKey && betData.players.some((player: any) => player.toBase58() === publicKey.toBase58());
  const status = betData ? Object.keys(betData.status)[0] : null;

  if (!connected) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold mb-2 text-white">Connect Wallet</h3>
        <p className="text-[#A1A1AA] text-sm">Connect your wallet to manage pools</p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
          Manage Pool
        </h2>
        <p className="text-sm text-[#A1A1AA]">Reveal winner or claim prizes</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
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
              className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
              placeholder="Bet PDA address"
            />
            <button
              onClick={handleLoadBet}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              Load
            </button>
          </div>
        </div>

        {betData && (
          <>
            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/[0.06] space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Total Pool</p>
                  <p className="text-white font-semibold text-lg">
                    {(betData.totalPool.toNumber() / 1e9).toFixed(4)} SOL
                  </p>
                </div>
                <div>
                  <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Players</p>
                  <p className="text-white font-semibold text-lg">{betData.playerCount}</p>
                </div>
                <div>
                  <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    status === 'open' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    status === 'revealed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Winner Block</p>
                  <p className="text-white font-semibold text-lg">
                    {betData.winnerBlock ? betData.winnerBlock : "Not revealed"}
                  </p>
                </div>
              </div>

              {isArbiter && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-green-400 text-sm font-medium">✓ You are the arbiter</p>
                </div>
              )}

              {isCreator && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-cyan-400 text-sm font-medium">✓ You created this bet</p>
                </div>
              )}

              {isPlayer && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-purple-400 text-sm font-medium">✓ You are a player in this bet</p>
                </div>
              )}
            </div>

            {/* Arbiter: Reveal Winner */}
            {isArbiter && status === 'open' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white mb-3">
                  Select Winning Block
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: TOTAL_BLOCKS }, (_, i) => i + 1).map((block) => (
                    <button
                      key={block}
                      onClick={() => setWinningBlock(block)}
                      className={`aspect-square rounded-xl font-bold text-lg transition-all ${
                        winningBlock === block
                          ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white scale-105 shadow-lg border border-purple-400/50"
                          : "bg-white/[0.03] hover:bg-white/[0.06] text-[#A1A1AA] hover:text-white border border-white/[0.06] hover:border-purple-500/30"
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleReveal}
                  disabled={loading || winningBlock === null}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                >
                  {loading ? "Revealing..." : winningBlock ? `Reveal Block ${winningBlock} as Winner` : "Select a Block"}
                </button>
              </div>
            )}

            {/* Player: Claim Winnings */}
            {status === 'revealed' && (
              <>
                {isPlayer ? (
                  <button
                    onClick={handleClaim}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                  >
                    {loading ? "Claiming..." : "🏆 Claim Winnings"}
                  </button>
                ) : (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
                    <p className="text-[#A1A1AA] text-sm">
                      You are not a player in this bet. Only players can claim winnings.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Creator: Cancel Bet */}
            {isCreator && status === 'open' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-[#A1A1AA] hover:text-red-400 font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cancelling..." : "Cancel Bet"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

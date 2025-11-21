"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useBlockBattle } from "@/lib/useBlockBattle";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBetPDA } from "@/lib/anchor";
import { useBetManager } from "@/hooks/useBetManager";
import toast from "react-hot-toast";

export default function CreateBet() {
  const { connected, publicKey } = useWallet();
  const { createBet, cancelBet } = useBlockBattle();
  const { saveBet, clearBet, activeBet } = useBetManager();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    minDeposit: "0.1",
    arbiter: "",
    lockTime: "300", // 5 minutes in seconds
  });

  const handleCancelPrevious = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const [betPDA] = getBetPDA(publicKey);
      await cancelBet(betPDA);
      clearBet(); // Clear from localStorage
      toast.success("Previous bet cancelled! You can now create a new one.");
    } catch (error: any) {
      console.error("Error cancelling bet:", error);
      if (error.message?.includes("Account does not exist")) {
        clearBet(); // Also clear if account doesn't exist
        toast.error("No previous bet found to cancel");
      } else {
        toast.error(error.message || "Failed to cancel bet");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const arbiterPubkey = new PublicKey(formData.arbiter);
      const result = await createBet(
        parseFloat(formData.minDeposit),
        arbiterPubkey,
        parseInt(formData.lockTime)
      );

      if (result) {
        await saveBet(result.betPDA); // Refresh from blockchain and cache

        // Generate shareable URL
        const shareUrl = `${window.location.origin}?bet=${result.betPDA.toBase58()}`;

        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success(`Bet created! Share link copied to clipboard!`);
        } catch (err) {
          toast.success(`Bet created! Share: ${result.betPDA.toBase58()}`);
        }

        console.log("Bet created at:", result.betPDA.toBase58());
        console.log("Share URL:", shareUrl);
        setFormData({ minDeposit: "0.1", arbiter: "", lockTime: "300" });
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("already in use")) {
        toast.error("You already have an active bet! Cancel it first using the button below.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold mb-2 text-white">Connect Wallet</h3>
        <p className="text-[#A1A1AA] text-sm">Connect your wallet to create a pool</p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
          Create New Pool
        </h2>
        <p className="text-sm text-[#A1A1AA]">Set up a new betting pool</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Minimum Deposit (SOL)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.minDeposit}
            onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-all"
            placeholder="0.1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Arbiter Address
          </label>
          <input
            type="text"
            value={formData.arbiter}
            onChange={(e) => setFormData({ ...formData, arbiter: e.target.value })}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-all font-mono text-sm"
            placeholder="Public key of the arbiter"
            required
          />
          <p className="text-xs text-[#A1A1AA] mt-2">Who will reveal the winner</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Lock Time (seconds)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: "1min", value: "60" },
              { label: "5min", value: "300" },
              { label: "15min", value: "900" },
              { label: "1hr", value: "3600" },
            ].map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFormData({ ...formData, lockTime: preset.value })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.lockTime === preset.value
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                    : "bg-white/[0.03] text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white border border-white/[0.06]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="60"
            value={formData.lockTime}
            onChange={(e) => setFormData({ ...formData, lockTime: e.target.value })}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
        >
          {loading ? "Creating..." : "Create Pool"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#050509] text-[#71717A]">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCancelPrevious}
          disabled={loading}
          className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Cancelling..." : "Cancel Previous Pool"}
        </button>
        <p className="text-xs text-[#71717A] text-center">
          Cancel your existing pool to create a new one
        </p>
      </form>
    </div>
  );
}

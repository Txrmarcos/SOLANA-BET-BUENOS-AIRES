"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "@/lib/anchor";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";

interface OpenBet {
  address: string;
  creator: string;
  minDeposit: number;
  totalPool: number;
  playerCount: number;
  lockTime: number;
}

export default function OpenBets() {
  const { connection } = useConnection();
  const [bets, setBets] = useState<OpenBet[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOpenBets = async () => {
    setLoading(true);
    try {
      // Get all program accounts (bets)
      const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          {
            // Filter for accounts with discriminator for BetAccount
            dataSize: 8 + 32 + 32 + 8 + 8 + 8 + 2 + 1 + 1 + 1 + 4 + (32 * 100) + 4 + 100 + 4 + (8 * 100) + 4 + 100,
          },
        ],
      });

      const openBets: OpenBet[] = [];

      for (const account of accounts) {
        try {
          // Parse account data (simplified - you'd use Anchor deserialization in production)
          const data = account.account.data;

          // Skip discriminator (8 bytes)
          let offset = 8;

          // Read creator (32 bytes)
          const creator = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;

          // Skip arbiter (32 bytes)
          offset += 32;

          // Read min_deposit (8 bytes)
          const minDeposit = Number(data.readBigUInt64LE(offset));
          offset += 8;

          // Read total_pool (8 bytes)
          const totalPool = Number(data.readBigUInt64LE(offset));
          offset += 8;

          // Read lock_time (8 bytes)
          const lockTime = Number(data.readBigInt64LE(offset));
          offset += 8;

          // Skip winner_block (2 bytes)
          offset += 2;

          // Read status (1 byte)
          const status = data.readUInt8(offset);
          offset += 1;

          // Read player_count (1 byte)
          const playerCount = data.readUInt8(offset);

          // Only show open bets (status = 0)
          if (status === 0) {
            openBets.push({
              address: account.pubkey.toBase58(),
              creator: creator.toBase58(),
              minDeposit: minDeposit / 1e9, // Convert to SOL
              totalPool: totalPool / 1e9,
              playerCount,
              lockTime,
            });
          }
        } catch (err) {
          console.error("Error parsing bet account:", err);
        }
      }

      // Sort by newest first
      openBets.sort((a, b) => b.lockTime - a.lockTime);

      setBets(openBets);
      toast.success(`Found ${openBets.length} open bets!`);
    } catch (error) {
      console.error("Error loading bets:", error);
      toast.error("Failed to load open bets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpenBets();
  }, []);

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
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Open Pools
          </h2>
          <p className="text-sm text-[#A1A1AA]">Browse and join active pools</p>
        </div>
        <button
          onClick={loadOpenBets}
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-[#A1A1AA] text-sm">Loading pools...</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-[#A1A1AA] text-sm">No open pools found</p>
        </div>
      ) : (
      <div className="space-y-3">
        {bets.map((bet) => (
          <div
            key={bet.address}
            className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.06] hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-[#71717A]">
                {bet.address.slice(0, 8)}...{bet.address.slice(-8)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyShareLink(bet.address)}
                  className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white text-xs rounded-lg transition-all"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => joinBet(bet.address)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-purple-500/20"
                >
                  Join
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide">Entry</p>
                <p className="text-white font-semibold">{bet.minDeposit.toFixed(2)} SOL</p>
              </div>
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide">Pool</p>
                <p className="text-white font-semibold">{bet.totalPool.toFixed(2)} SOL</p>
              </div>
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide">Players</p>
                <p className="text-white font-semibold">{bet.playerCount}<span className="text-[#71717A]">/100</span></p>
              </div>
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide">Lock</p>
                <p className="text-white font-semibold">
                  {new Date(bet.lockTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

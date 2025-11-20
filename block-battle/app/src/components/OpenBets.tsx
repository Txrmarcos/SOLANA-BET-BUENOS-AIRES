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
    <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🎰</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Open Bets</h2>
            <p className="text-sm text-gray-400">Join an existing battle</p>
          </div>
        </div>
        <button
          onClick={loadOpenBets}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          Loading open bets...
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No open bets found. Create one to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.address}
              className="bg-black/30 rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bet Address</p>
                  <p className="text-xs font-mono text-gray-300">
                    {bet.address.slice(0, 8)}...{bet.address.slice(-8)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyShareLink(bet.address)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    📋 Copy Link
                  </button>
                  <button
                    onClick={() => joinBet(bet.address)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Join →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Min Deposit</p>
                  <p className="text-white font-semibold">{bet.minDeposit.toFixed(2)} SOL</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Pool</p>
                  <p className="text-white font-semibold">{bet.totalPool.toFixed(2)} SOL</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Players</p>
                  <p className="text-white font-semibold">{bet.playerCount}/100</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Lock Time</p>
                  <p className="text-white font-semibold">
                    {new Date(bet.lockTime * 1000).toLocaleTimeString()}
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

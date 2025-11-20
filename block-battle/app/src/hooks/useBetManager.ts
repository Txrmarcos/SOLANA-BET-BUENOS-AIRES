/**
 * Bet Manager Hook
 *
 * Architecture:
 * - Source of Truth: Solana blockchain (PDA derived from creator's pubkey)
 * - Cache: localStorage (for faster UX, but always verified against blockchain)
 *
 * How it works:
 * 1. Each user can only have ONE active bet (enforced by PDA seeds)
 * 2. PDA = hash(b"bet" + creator_pubkey) - deterministic!
 * 3. On load: fetch from blockchain at user's PDA address
 * 4. If exists on-chain → show it; if not → no active bet
 * 5. localStorage is just a cache to avoid repeated RPC calls
 *
 * Benefits:
 * - Works across devices (blockchain is shared)
 * - Can't get out of sync (blockchain is always checked)
 * - No need to "remember" addresses - calculated from wallet
 */

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBlockBattle } from "@/lib/useBlockBattle";
import { getBetPDA } from "@/lib/anchor";

interface BetInfo {
  address: string;
  creator: string;
  timestamp: number;
}

export function useBetManager() {
  const { publicKey } = useWallet();
  const { getBetData } = useBlockBattle();
  const [activeBet, setActiveBet] = useState<BetInfo | null>(null);
  const [betData, setBetData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get user's bet PDA
  const getMyBetPDA = () => {
    if (!publicKey) return null;
    const [betPDA] = getBetPDA(publicKey);
    return betPDA;
  };

  // Load bet from blockchain (localStorage is just a cache)
  useEffect(() => {
    if (!publicKey) {
      setActiveBet(null);
      setBetData(null);
      return;
    }

    const loadBet = async () => {
      setLoading(true);
      try {
        // Always fetch from blockchain - it's the source of truth
        const myBetPDA = getMyBetPDA();
        if (!myBetPDA) {
          setLoading(false);
          return;
        }

        try {
          // Try to fetch bet data from blockchain
          const data = await getBetData(myBetPDA);

          if (data) {
            // Bet exists on-chain!
            const betInfo: BetInfo = {
              address: myBetPDA.toBase58(),
              creator: publicKey.toBase58(),
              timestamp: Date.now(),
            };
            setActiveBet(betInfo);
            setBetData(data);

            // Update localStorage cache for faster subsequent loads
            localStorage.setItem(`bet_${publicKey.toBase58()}`, JSON.stringify(betInfo));
          } else {
            // No bet found
            setActiveBet(null);
            setBetData(null);
            localStorage.removeItem(`bet_${publicKey.toBase58()}`);
          }
        } catch (error) {
          // Account doesn't exist = no active bet
          setActiveBet(null);
          setBetData(null);
          localStorage.removeItem(`bet_${publicKey.toBase58()}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBet();
  }, [publicKey]);

  // Trigger refresh after creating bet (cache will be updated)
  const saveBet = async (betPDA: PublicKey) => {
    if (!publicKey) return;

    // Just refresh from blockchain - it's the source of truth
    const betInfo: BetInfo = {
      address: betPDA.toBase58(),
      creator: publicKey.toBase58(),
      timestamp: Date.now(),
    };

    setActiveBet(betInfo);

    // Fetch actual data from blockchain
    try {
      const data = await getBetData(betPDA);
      if (data) {
        setBetData(data);
        // Cache it
        localStorage.setItem(`bet_${publicKey.toBase58()}`, JSON.stringify(betInfo));
      }
    } catch (error) {
      console.error("Error fetching bet data:", error);
    }
  };

  // Clear bet from localStorage
  const clearBet = () => {
    if (!publicKey) return;
    localStorage.removeItem(`bet_${publicKey.toBase58()}`);
    setActiveBet(null);
    setBetData(null);
  };

  // Refresh bet data
  const refreshBet = async () => {
    if (!activeBet) return;

    setLoading(true);
    try {
      const data = await getBetData(new PublicKey(activeBet.address));
      if (data) {
        setBetData(data);
      } else {
        clearBet();
      }
    } catch (error) {
      clearBet();
    } finally {
      setLoading(false);
    }
  };

  return {
    activeBet,
    betData,
    loading,
    saveBet,
    clearBet,
    refreshBet,
    getMyBetPDA,
  };
}

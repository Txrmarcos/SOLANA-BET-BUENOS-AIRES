"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useBlockBattle } from "@/lib/useBlockBattle";
import { PROGRAM_ID } from "@/lib/anchor";
import toast from "react-hot-toast";

const TOTAL_BLOCKS = 25;

interface PoolInfo {
  address: string;
  totalPool: number;
  playerCount: number;
  status: string;
  lockTime: number;
  winnerBlock?: number;
  myChosenBlock?: number;
}

export default function ManageBet() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { revealWinner, cancelBet, getBetData, claimWinnings } = useBlockBattle();

  const [loading, setLoading] = useState(false);
  const [searchingPools, setSearchingPools] = useState(false);
  const [myPools, setMyPools] = useState<PoolInfo[]>([]);
  const [joinedPools, setJoinedPools] = useState<PoolInfo[]>([]);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [poolDetails, setPoolDetails] = useState<any>(null);
  const [winningBlock, setWinningBlock] = useState<number | null>(null);

  // Find all pools created by the connected user
  const findMyPools = async () => {
    if (!publicKey) return;

    console.log("🔍 Searching for pools created by:", publicKey.toBase58());
    setSearchingPools(true);

    try {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              offset: 8, // After discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ],
      });

      console.log(`📦 Found ${accounts.length} pools created by you`);

      const pools: PoolInfo[] = [];
      const currentTime = Math.floor(Date.now() / 1000);

      for (const account of accounts) {
        try {
          const data = account.account.data;
          let offset = 8;

          // Skip creator
          offset += 32;
          // Skip arbiter
          offset += 32;

          // Skip min_deposit
          offset += 8;

          const totalPool = Number(data.readBigUInt64LE(offset));
          offset += 8;

          const lockTime = Number(data.readBigInt64LE(offset));
          offset += 8;

          // winner_block is Option<u8>
          const hasWinnerBlock = data.readUInt8(offset);
          offset += 1;
          let winnerBlock: number | undefined;
          if (hasWinnerBlock) {
            winnerBlock = data.readUInt8(offset);
            offset += 1;
          }

          const status = data.readUInt8(offset);
          offset += 1;

          const playerCount = data.readUInt8(offset);

          const statusStr = status === 0 ? 'open' : status === 1 ? 'revealed' : 'cancelled';

          pools.push({
            address: account.pubkey.toBase58(),
            totalPool: totalPool / 1e9,
            playerCount,
            status: statusStr,
            lockTime,
            winnerBlock,
          });
        } catch (err) {
          console.error("Error parsing pool:", err);
        }
      }

      // Sort by status (open first) then by player count
      pools.sort((a, b) => {
        if (a.status === 'open' && b.status !== 'open') return -1;
        if (a.status !== 'open' && b.status === 'open') return 1;
        return b.playerCount - a.playerCount;
      });

      setMyPools(pools);
      console.log("✅ Loaded pools:", pools);
    } catch (error) {
      console.error("Error finding pools:", error);
      toast.error("Failed to load your pools");
    } finally {
      setSearchingPools(false);
    }
  };

  // Find all pools where user participated as a player
  const findJoinedPools = async () => {
    if (!publicKey) return;

    console.log("🔍 Searching for pools where you participated...");
    setSearchingPools(true);

    try {
      // Get all bet accounts
      const accounts = await connection.getProgramAccounts(PROGRAM_ID);
      console.log(`📦 Found ${accounts.length} total pools`);

      const joined: PoolInfo[] = [];

      for (const account of accounts) {
        try {
          const betData = await getBetData(account.pubkey);

          // Check if user is in players array
          const playerIndex = betData.players.findIndex(
            (player: PublicKey) => player.toBase58() === publicKey.toBase58()
          );

          if (playerIndex !== -1) {
            // User is a player in this pool
            const myBlock = betData.chosenBlocks[playerIndex];
            const status = Object.keys(betData.status)[0];

            joined.push({
              address: account.pubkey.toBase58(),
              totalPool: betData.totalPool.toNumber() / 1e9,
              playerCount: betData.playerCount,
              status,
              lockTime: betData.lockTime.toNumber(),
              winnerBlock: betData.winnerBlock,
              myChosenBlock: myBlock,
            });

            console.log(`✅ Found pool ${account.pubkey.toBase58().slice(0, 8)}... - You chose block ${myBlock}`);
          }
        } catch (err) {
          console.error("Error parsing joined pool:", err);
        }
      }

      // Sort: revealed first (so user can see if they won), then by pool size
      joined.sort((a, b) => {
        if (a.status === 'revealed' && b.status !== 'revealed') return -1;
        if (a.status !== 'revealed' && b.status === 'revealed') return 1;
        return b.totalPool - a.totalPool;
      });

      setJoinedPools(joined);
      console.log(`✅ You participated in ${joined.length} pools`);
    } catch (error) {
      console.error("Error finding joined pools:", error);
      toast.error("Failed to load joined pools");
    } finally {
      setSearchingPools(false);
    }
  };

  // Load detailed data for selected pool
  const loadPoolDetails = async (address: string) => {
    try {
      setLoading(true);
      const betPDA = new PublicKey(address);
      const data = await getBetData(betPDA);
      setPoolDetails(data);
      setSelectedPool(address);
    } catch (error) {
      console.error("Error loading pool details:", error);
      toast.error("Failed to load pool details");
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async () => {
    if (!selectedPool || winningBlock === null) return;

    setLoading(true);
    try {
      const betPDA = new PublicKey(selectedPool);
      await revealWinner(betPDA, winningBlock);
      await loadPoolDetails(selectedPool);
      await findMyPools(); // Refresh list
      setWinningBlock(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedPool) return;

    setLoading(true);
    try {
      const betPDA = new PublicKey(selectedPool);
      await cancelBet(betPDA);
      setSelectedPool(null);
      setPoolDetails(null);
      await findMyPools(); // Refresh list
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([findMyPools(), findJoinedPools()]);
  };

  useEffect(() => {
    if (connected && publicKey) {
      refreshAll();
    } else {
      setMyPools([]);
      setJoinedPools([]);
      setSelectedPool(null);
      setPoolDetails(null);
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold mb-2 text-white">Connect Wallet</h3>
        <p className="text-[#A1A1AA] text-sm">Connect your wallet to manage your pools</p>
      </div>
    );
  }

  const status = poolDetails ? Object.keys(poolDetails.status)[0] : null;
  const isArbiter = poolDetails && publicKey && poolDetails.arbiter.toBase58() === publicKey.toBase58();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Manage Pools
            </h2>
            <p className="text-sm text-[#A1A1AA]">Select a pool to reveal winner or manage settings</p>
          </div>
          <button
            onClick={refreshAll}
            disabled={searchingPools}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-xl transition-all text-sm"
          >
            {searchingPools ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* My Pools Grid */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Your Pools</h3>

        {searchingPools ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-[#A1A1AA]">Loading your pools...</p>
          </div>
        ) : myPools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-[#A1A1AA] mb-2">You haven't created any pools yet</p>
            <p className="text-sm text-[#71717A]">Create your first pool in the "Create" tab</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPools.map((pool) => (
              <button
                key={pool.address}
                onClick={() => loadPoolDetails(pool.address)}
                className={`p-5 rounded-xl border transition-all text-left ${
                  selectedPool === pool.address
                    ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-500/50"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pool.status === 'open' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    pool.status === 'revealed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {pool.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#A1A1AA] mb-1">Total Pool</p>
                    <p className="text-white font-bold text-lg">
                      {pool.totalPool.toFixed(4)} SOL
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#A1A1AA]">Players</p>
                      <p className="text-white font-semibold">{pool.playerCount}</p>
                    </div>
                    {pool.winnerBlock && (
                      <div>
                        <p className="text-xs text-[#A1A1AA]">Winner</p>
                        <p className="text-white font-semibold">Block {pool.winnerBlock}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-[#71717A] font-mono truncate">
                    {pool.address.slice(0, 8)}...{pool.address.slice(-8)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Joined Pools Grid */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Pools You Joined</h3>

        {searchingPools ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-[#A1A1AA]">Loading joined pools...</p>
          </div>
        ) : joinedPools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-[#A1A1AA] mb-2">You haven't joined any pools yet</p>
            <p className="text-sm text-[#71717A]">Browse pools in the "Browse" tab to join</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinedPools.map((pool) => {
              const didWin = pool.status === 'revealed' && pool.winnerBlock === pool.myChosenBlock;

              return (
                <div
                  key={pool.address}
                  className={`p-5 rounded-xl border transition-all ${
                    didWin
                      ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50"
                      : "bg-white/[0.02] border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pool.status === 'open' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      pool.status === 'revealed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {pool.status.toUpperCase()}
                    </span>
                    {didWin && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        🏆 WON
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#A1A1AA] mb-1">Total Pool</p>
                      <p className="text-white font-bold text-lg">
                        {pool.totalPool.toFixed(4)} SOL
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#A1A1AA]">Your Block</p>
                        <p className="text-cyan-400 font-bold text-xl">{pool.myChosenBlock}</p>
                      </div>
                      {pool.winnerBlock && (
                        <div>
                          <p className="text-xs text-[#A1A1AA]">Winner</p>
                          <p className={`font-bold text-xl ${
                            didWin ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {pool.winnerBlock}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-[#A1A1AA]">Players</p>
                      <p className="text-white font-semibold">{pool.playerCount}</p>
                    </div>
                  </div>

                  {didWin && (
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const betPDA = new PublicKey(pool.address);
                          await claimWinnings(betPDA);
                          await refreshAll();
                          toast.success("Winnings claimed! 🎉");
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                    >
                      {loading ? "Claiming..." : "Claim Winnings 💰"}
                    </button>
                  )}

                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-[#71717A] font-mono truncate">
                      {pool.address.slice(0, 8)}...{pool.address.slice(-8)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Pool Details */}
      {selectedPool && poolDetails && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Pool Details</h3>
            <p className="text-xs text-[#71717A] font-mono">{selectedPool}</p>
          </div>

          <div className="bg-white/[0.02] rounded-xl p-6 border border-white/[0.06] mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Total Pool</p>
                <p className="text-white font-semibold text-lg">
                  {(poolDetails.totalPool.toNumber() / 1e9).toFixed(4)} SOL
                </p>
              </div>
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Players</p>
                <p className="text-white font-semibold text-lg">{poolDetails.playerCount}</p>
              </div>
              <div>
                <p className="text-[#A1A1AA] mb-1 uppercase tracking-wide text-xs">Min Deposit</p>
                <p className="text-white font-semibold text-lg">
                  {(poolDetails.minDeposit.toNumber() / 1e9).toFixed(4)} SOL
                </p>
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
            </div>
          </div>

          {/* Arbiter: Reveal Winner */}
          {isArbiter && status === 'open' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                <p className="text-green-400 text-sm font-medium">✓ You are the arbiter of this pool</p>
              </div>

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
                disabled={loading || winningBlock === null || poolDetails.playerCount < 2}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                {loading ? "Revealing..." : winningBlock ? `Reveal Block ${winningBlock} as Winner` : "Select a Block"}
              </button>
              {poolDetails.playerCount < 2 && (
                <p className="text-sm text-[#A1A1AA] text-center">Need at least 2 players to reveal winner</p>
              )}
            </div>
          )}

          {/* Status Messages */}
          {status === 'revealed' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-400 font-semibold text-lg mb-1">
                Winner Revealed: Block {poolDetails.winnerBlock}
              </p>
              <p className="text-sm text-[#A1A1AA]">
                Winners can now claim their prizes in the "Play" tab
              </p>
            </div>
          )}

          {/* Cancel Bet */}
          {status === 'open' && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-[#A1A1AA] hover:text-red-400 font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Cancelling..." : "Cancel Pool"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

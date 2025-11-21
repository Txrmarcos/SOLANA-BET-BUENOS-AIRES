/**
 * Global cache for bets data to persist across component mounts/unmounts
 * This prevents unnecessary refetching when switching between tabs
 */

interface OpenBet {
  address: string;
  creator: string;
  minDeposit: number;
  totalPool: number;
  playerCount: number;
  lockTime: number;
  isAutomatic: boolean;
}

interface PoolInfo {
  address: string;
  totalPool: number;
  playerCount: number;
  status: string;
  lockTime: number;
  winnerBlock?: number;
  myChosenBlock?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class BetsCache {
  private openBetsCache: CacheEntry<OpenBet[]> | null = null;
  private myPoolsCache: Map<string, CacheEntry<PoolInfo[]>> = new Map(); // keyed by wallet address
  private loadingPromises: Map<string, Promise<any>> = new Map();

  private readonly CACHE_DURATION_MS = 30000; // 30 seconds

  /**
   * Get cached open bets if still valid
   */
  getOpenBets(): OpenBet[] | null {
    if (!this.openBetsCache) return null;

    const age = Date.now() - this.openBetsCache.timestamp;
    if (age > this.CACHE_DURATION_MS) {
      console.log("📦 Cache expired (age:", age, "ms)");
      this.openBetsCache = null;
      return null;
    }

    console.log("📦 Returning cached bets (age:", age, "ms)");
    return this.openBetsCache.data;
  }

  /**
   * Update cache with new data
   */
  setOpenBets(data: OpenBet[]): void {
    this.openBetsCache = {
      data,
      timestamp: Date.now(),
    };
    console.log("✅ Cache updated with", data.length, "bets");
  }

  /**
   * Invalidate cache (force refresh on next load)
   */
  invalidateOpenBets(): void {
    console.log("🗑️ Open bets cache invalidated");
    this.openBetsCache = null;
  }

  /**
   * Get cached pools for a specific wallet
   */
  getMyPools(walletAddress: string): PoolInfo[] | null {
    const cache = this.myPoolsCache.get(walletAddress);
    if (!cache) return null;

    const age = Date.now() - cache.timestamp;
    if (age > this.CACHE_DURATION_MS) {
      console.log("📦 My pools cache expired (age:", age, "ms)");
      this.myPoolsCache.delete(walletAddress);
      return null;
    }

    console.log("📦 Returning cached my pools (age:", age, "ms)");
    return cache.data;
  }

  /**
   * Update cache with user's pools
   */
  setMyPools(walletAddress: string, data: PoolInfo[]): void {
    this.myPoolsCache.set(walletAddress, {
      data,
      timestamp: Date.now(),
    });
    console.log("✅ My pools cache updated with", data.length, "pools");
  }

  /**
   * Invalidate user's pools cache
   */
  invalidateMyPools(walletAddress: string): void {
    console.log("🗑️ My pools cache invalidated for", walletAddress);
    this.myPoolsCache.delete(walletAddress);
  }

  /**
   * Deduplicate concurrent requests by returning the same promise
   * if a request is already in flight
   */
  async dedupeRequest<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // If there's already a request in flight, return that promise
    const existingPromise = this.loadingPromises.get(key);
    if (existingPromise) {
      console.log("⏸️ Request already in flight, reusing promise for:", key);
      return existingPromise as Promise<T>;
    }

    // Create new request
    const promise = fetcher().finally(() => {
      // Clean up after request completes
      this.loadingPromises.delete(key);
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  /**
   * Check if a request is currently in flight
   */
  isLoading(key: string): boolean {
    return this.loadingPromises.has(key);
  }
}

// Export singleton instance
export const betsCache = new BetsCache();

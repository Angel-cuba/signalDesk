import { useCallback, useEffect, useState } from "react";

import { getAssetSignal, type AssetSignal } from "../services/signalService";

import type { SupportedAsset } from "../types/profile";

/**
 * Fetches and manages the trading signal for a selected asset.
 * Provides loading, error handling, and manual refresh support.
 */
export const useAssetSignal = (symbol: SupportedAsset) => {
  const [signal, setSignal] = useState<AssetSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Retrieves the latest signal and updates the hook state.
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAssetSignal(symbol);
      setSignal(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trading signal.",
      );
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { signal, loading, error, refresh };
};

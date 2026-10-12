import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { checkSignalNotification } from "../services/signalNotificationService";

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

  const { user } = useAuth();
  const userId = user?.id;

  /**
   * Retrieves the latest signal and updates the hook state.
   */
  /**
   * Retrieves the latest signal, updates the UI, and checks for new notifications.
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAssetSignal(symbol);

      // Update the UI independently of notification delivery.
      setSignal(result);

      if (userId) {
        try {
          await checkSignalNotification(result, userId);
        } catch (notificationError) {
          console.warn(
            "Failed to process signal notification:",
            notificationError,
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trading signal.",
      );
    } finally {
      setLoading(false);
    }
  }, [symbol, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { signal, loading, error, refresh };
};

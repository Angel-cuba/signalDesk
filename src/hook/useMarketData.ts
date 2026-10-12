import { useEffect, useState } from "react";

import { getBinanceData } from "../services/marketService";
import type { Asset, TMarketTimer } from "../types/market";

export function useMarketData(symbol: Asset) {
  const [marketData, setMarketData] = useState<TMarketTimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBinanceData(symbol);

        setMarketData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch market data",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const timer = setInterval(loadData, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [symbol]);

  return { marketData, loading, error };
}

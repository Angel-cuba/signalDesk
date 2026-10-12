import { getBinanceData } from "./marketService";

import { calculateSignal, SignalResult } from "../api/signalsApi";
import type { SupportedAsset } from "../types/profile";

export type AssetSignal = SignalResult & {
  symbol: SupportedAsset;
};

/**
 Fetches hourly market candles for an asset and generates
 a trading signal based on the SMA crossover strategy. 
 */
export const getAssetSignal = async (
  symbol: SupportedAsset,
): Promise<AssetSignal> => {
  const binanceData = await getBinanceData(symbol, "1h", 20);

  const signal = calculateSignal(binanceData);

  return {
    symbol,
    ...signal,
  };
};

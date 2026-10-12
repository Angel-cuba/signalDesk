import type { TMarketTimer } from "../types/market";

export type SignalType = "BUY" | "SELL" | "NEUTRAL";

export type SignalResult = {
  type: SignalType;
  reason: string;
  timestamp: number;
  sma5: number;
  sma10: number;
};

/**
 * Calculates a trading signal using SMA5 and SMA10 crossovers.
 * Only closed time values are considered to avoid incomplete market data.
 * Returns BUY, SELL, or NEUTRAL with an explanation and timestamp.
 */
export const calculateSignal = (marketTimer: TMarketTimer[]): SignalResult => {
  const now = Date.now();

  const closedMarketTimer = marketTimer
    .filter((time) => time.closeTime < now)
    .sort((a, b) => a.openTime - b.openTime);

  if (closedMarketTimer.length < 11) {
    throw new Error(
      "At least 11 time values are required to calculate a signal.",
    );
  }

  const prices = closedMarketTimer.map((t) => t.close);

  const previousPrices = prices.slice(0, -1);

  const previousSMA5 = calculateSMA(previousPrices, 5);
  const previousSMA10 = calculateSMA(previousPrices, 10);

  const currentSMA5 = calculateSMA(prices, 5);
  const currentSMA10 = calculateSMA(prices, 10);

  const latestTime = closedMarketTimer[closedMarketTimer.length - 1];

  if (previousSMA5 <= previousSMA10 && currentSMA5 > currentSMA10) {
    return {
      type: "BUY",
      reason: "SMA5 crossed above SMA10.",
      timestamp: latestTime.closeTime,
      sma5: currentSMA5,
      sma10: currentSMA10,
    };
  }

  if (previousSMA5 >= previousSMA10 && currentSMA5 < currentSMA10) {
    return {
      type: "SELL",
      reason: "SMA5 crossed below SMA10.",
      timestamp: latestTime.closeTime,
      sma5: currentSMA5,
      sma10: currentSMA10,
    };
  }

  return {
    type: "NEUTRAL",
    reason: "No new SMA5/SMA10 crossover detected.",
    timestamp: latestTime.closeTime,
    sma5: currentSMA5,
    sma10: currentSMA10,
  };
};
/**
 * Calculates the Simple Moving Average (SMA) using the
   closing prices of the most recent time values.
 */
const calculateSMA = (prices: number[], period: number): number => {
  if (prices.length < period) {
    throw new Error(`At least ${period} prices are required.`);
  }

  const lastPrices = prices.slice(-period);

  const sum = lastPrices.reduce((total, price) => total + price, 0);

  return sum / period;
};

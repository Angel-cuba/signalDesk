import { Asset, TMarketTimer } from "../types/market";

const BINANCE_BASE_URL = "https://api.binance.com";

export async function getBinanceData(
  symbol: Asset,
  interval = "1h",
  limit = 20,
): Promise<TMarketTimer[]> {
  const url =
    `${BINANCE_BASE_URL}/api/v3/klines` +
    `?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Binance request failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid Binance response");
  }

  return data.map((item) => {
    if (!Array.isArray(item)) {
      throw new Error("Invalid BinanceData data");
    }

    const openTime = Number(item[0]);
    const close = Number(item[4]);
    const closeTime = Number(item[6]);

    if (
      !Number.isFinite(openTime) ||
      !Number.isFinite(closeTime) ||
      !Number.isFinite(close)
    ) {
      throw new Error("Invalid BinanceData values");
    }

    return { openTime, closeTime, close };
  });
}

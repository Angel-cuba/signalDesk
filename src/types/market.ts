export type Asset = "BTCUSDT" | "ETHUSDT" | "SOLUSDT";

export type TMarketTimer = {
  openTime: number;
  closeTime: number;
  close: number;
};

export const MARKET_ASSETS: Asset[] = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

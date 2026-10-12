import * as SecureStore from "expo-secure-store";

import { sendSignalNotification } from "./notificationService";
import type { AssetSignal } from "./signalService";

const STORAGE_PREFIX = "signaldesk:last-observed-signal";

/**
 * Checks whether an asset has produced a new trading signal.
 * The first observation establishes a baseline without notifying.
 */
export const checkSignalNotification = async (
  signal: AssetSignal,
  userId: string,
): Promise<void> => {
  const storageKey = `${STORAGE_PREFIX}:${userId}:${signal.symbol}`;

  const lastObservedTimestamp = await SecureStore.getItemAsync(storageKey);
  const currentTimestamp = signal.timestamp.toString();

  // Establish a baseline to avoid notifying about historical signals.
  if (lastObservedTimestamp === null) {
    await SecureStore.setItemAsync(storageKey, currentTimestamp);
    return;
  }

  // Ignore previously observed candles, including older API responses.
  if (signal.timestamp <= Number(lastObservedTimestamp)) {
    return;
  }

  // Save the latest observation before attempting notification delivery.
  await SecureStore.setItemAsync(storageKey, currentTimestamp);

  if (signal.type === "NEUTRAL") {
    return;
  }

  await sendSignalNotification(signal.symbol, signal.type, signal.reason);
};

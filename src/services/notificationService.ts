import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { SignalType } from "../api/signalsApi";
import type { SupportedAsset } from "../types/profile";

/**
 * Defines how notifications are displayed while the app is in the foreground.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests permission to display local notifications.
 * Returns true when notifications are authorized.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("signals", {
      name: "Trading Signals",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const existingPermission = await Notifications.getPermissionsAsync();

  if (existingPermission.granted) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  return requestedPermission.granted;
};

/**
 * Displays a local notification when a BUY or SELL signal is detected.
 * NEUTRAL signals do not generate notifications.
 */
export const sendSignalNotification = async (
  symbol: SupportedAsset,
  type: SignalType,
  reason: string,
): Promise<void> => {
  if (type === "NEUTRAL") {
    return;
  }

  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${symbol.replace("USDT", "/USDT")} — ${type} Signal`,
      body: reason,
      data: {
        symbol,
        type,
      },
    },
    trigger: null,
  });
};

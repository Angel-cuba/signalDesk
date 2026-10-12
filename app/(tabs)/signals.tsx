import SignalCard from "@/components/SignalCard";
import { useProfile } from "@/src/hook/useProfile";
import { SupportedAsset } from "@/src/types/profile";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Checks whether a symbol belongs to the supported market assets.
 * Prevents unsupported values from being passed to SignalCard.
 */
const isSupportedAsset = (symbol: string): symbol is SupportedAsset => {
  return ["BTCUSDT", "ETHUSDT", "SOLUSDT"].includes(symbol);
};

/**
 * Displays trading signals for the assets in the user's watchlist.
 * Refreshes the profile whenever the screen gains focus.
 */
export default function Signals() {
  const { profile, loading, error, reloadProfile } = useProfile();

  /**
   * Reloads the user's watchlist when returning from the Profile tab.
   */
  useFocusEffect(
    useCallback(() => {
      void reloadProfile().catch((err) => {
        console.error("Failed to refresh profile:", err);
      });
    }, [reloadProfile]),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.disclaimer}>
        Signals are for informational purposes only. Not financial advice.
      </Text>

      {loading && <ActivityIndicator size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && profile?.watchlist.length === 0 && (
        <Text style={styles.empty}>
          Your watchlist is empty. Select assets in your Profile.
        </Text>
      )}

      <View style={styles.cards}>
        {profile?.watchlist.filter(isSupportedAsset).map((symbol) => (
          <SignalCard key={symbol} symbol={symbol} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },
  cards: {
    gap: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 8,
  },
});

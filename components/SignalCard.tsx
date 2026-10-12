import { useAssetSignal } from "@/src/hook/useSignal";
import type { SupportedAsset } from "@/src/types/profile";

import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SignalCardProps = {
  symbol: SupportedAsset;
};

/**
 * Displays the latest SMA crossover signal for a selected asset.
 * Each card manages its own market request and refresh state.
 */
export default function SignalCard({ symbol }: SignalCardProps) {
  const { signal, loading, error, refresh } = useAssetSignal(symbol);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{symbol.replace("USDT", "/USDT")}</Text>

      {loading && <ActivityIndicator size="small" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {signal && (
        <View style={styles.content}>
          <Text style={styles.signalType}>Signal: {signal.type}</Text>

          <Text>SMA5: {signal.sma5.toFixed(2)}</Text>
          <Text>SMA10: {signal.sma10.toFixed(2)}</Text>

          <Text style={styles.reason}>{signal.reason}</Text>

          <Text>Closed at: {new Date(signal.timestamp).toLocaleString()}</Text>
        </View>
      )}

      <Button
        title={loading ? "Refreshing..." : "Refresh signal"}
        onPress={() => void refresh()}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    alignItems: "center",
    gap: 8,
  },
  signalType: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reason: {
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

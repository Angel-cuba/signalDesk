import { useAssetSignal } from "@/src/hook/useSignal";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Displays the latest trading signal for BTCUSDT.
 * Shows the SMA values, signal explanation, and last candle timestamp.
 */
export default function Signals() {
  const { signal, loading, error, refresh } = useAssetSignal("BTCUSDT");

  return (
    <View style={styles.container}>
      <Text style={styles.disclaimer}>
        Signals are for informational purposes only. Not financial advice.
      </Text>
      <Text style={styles.title}>BTC/USDT</Text>

      {loading && <ActivityIndicator size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {signal && (
        <View style={styles.signalContainer}>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  signalContainer: {
    alignItems: "center",
    gap: 10,
  },
  signalType: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reason: {
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
  },
});

import { useMarketData } from "@/src/hook/useMarketData";
import { StyleSheet, Text, View } from "react-native";

export default function Signals() {
  const { marketData, loading, error } = useMarketData("BTCUSDT");

  if (loading) {
    return <Text>Loading market data...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const lastFetchedData = marketData[marketData.length - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BTC/USDT</Text>

      <Text>Last closed price: {lastFetchedData?.close ?? "N/A"}</Text>

      <Text>Closed times: {marketData.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

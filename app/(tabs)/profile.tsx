import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabaseClient } from "@/src/lib/supabase";

import { useAuth } from "@/src/context/AuthContext";
import { useProfile } from "@/src/hook/useProfile";
import {
  SUPPORTED_ASSETS,
  type RiskProfile,
  type SupportedAsset,
} from "@/src/types/profile";

const RISK_PROFILES: RiskProfile[] = ["conservative", "balanced", "aggressive"];

export default function ProfileScreen() {
  const { user } = useAuth();

  const {
    profile,
    loading: profileLoading,
    saving,
    error,
    saveProfile,
  } = useProfile();

  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const toggleAsset = (asset: SupportedAsset) => {
    if (!profile || saving) return;

    const currentWashList = profile.watchlist;

    const updateWatchList = profile.watchlist.includes(asset)
      ? currentWashList.filter((a) => a !== asset)
      : [...currentWashList, asset];

    try {
      saveProfile({
        watchlist: updateWatchList,
      });
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Unable to update watchlist.",
      );
    }
  };

  const handleSave = async () => {
    const name = displayName.trim();

    if (!name || saving) return;

    try {
      await saveProfile({
        display_name: name,
      });

      setDisplayName("");
      Alert.alert("Success", "Display name updated successfully.");
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error
          ? error.message
          : "Unable to update display name.",
      );
    }
  };

  const handleRiskChange = async (risk: RiskProfile) => {
    if (!profile || saving || risk === profile.risk_profile) return;

    try {
      await saveProfile({
        risk_profile: risk,
      });
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error
          ? error.message
          : "Unable to update risk profile.",
      );
    }
  };

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        Alert.alert("Logout failed please try again, error:", error.message);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Profile unavailable or loading...</Text>
        <Text> Please check your connection, wait a moment and try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Display Name</Text>

      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder={
          profile.display_name ? profile.display_name : "Enter your name"
        }
        autoCapitalize="words"
        maxLength={60}
      />
      <Pressable
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Display Name</Text>
        )}
      </Pressable>

      <Text style={styles.sectionTitle}>Risk Profile</Text>

      {RISK_PROFILES.map((risk) => (
        <Pressable
          key={risk}
          style={styles.option}
          onPress={() => handleRiskChange(risk)}
          accessibilityRole="radio"
          accessibilityState={{ checked: profile.risk_profile === risk }}
        >
          <Text style={styles.optionText}>
            {risk.charAt(0).toUpperCase() + risk.slice(1)}
          </Text>

          <Text style={styles.selectionIndicator}>
            {profile.risk_profile === risk ? "◉" : "○"}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>My Watchlist</Text>

      {SUPPORTED_ASSETS.map((asset) => (
        <Pressable
          key={asset}
          style={styles.option}
          onPress={() => void toggleAsset(asset)}
          disabled={saving}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: profile.watchlist.includes(asset),
            disabled: saving,
          }}
        >
          <Text style={styles.optionText}>{asset}</Text>

          <Text style={styles.selectionIndicator}>
            {profile.watchlist.includes(asset) ? "☑" : "☐"}
          </Text>
        </Pressable>
      ))}

      <View style={styles.accountSection}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{user?.email ?? "Unknown user"}</Text>
      </View>

      <Pressable
        style={[styles.logoutButton, loading && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  selectionIndicator: {
    fontSize: 22,
    color: "#2563eb",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  accountSection: {
    marginTop: 36,
    marginBottom: 24,
  },
  email: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

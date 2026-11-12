import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";

export default function HelpCentreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    Linking.openURL("tel:18002660000").catch(() =>
      Alert.alert("Call Support", "Call toll-free: 1800-266-0000")
    );
  };

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/919876543210?text=Hello%20Diesel%20Life%20Support").catch(() =>
      Alert.alert("WhatsApp Support", "WhatsApp help available at +91 98765 43210")
    );
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@diesellife.in?subject=Fleet%20Inquiry").catch(() =>
      Alert.alert("Email Support", "Email us at support@diesellife.in")
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Help Centre" subtitle="24x7 Fuel Logistics & Bowser Assistance" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Urgent Hotline Card */}
        <View style={styles.urgentCard}>
          <MaterialCommunityIcons name="gas-station-in-use" size={32} color="#FFFFFF" />
          <View style={styles.urgentInfo}>
            <Text style={styles.urgentTitle}>Live Delivery Support</Text>
            <Text style={styles.urgentSubtitle}>
              Facing an issue with your active Bowser delivery? Speak directly with Dispatch.
            </Text>
          </View>
        </View>

        {/* Quick Contact Buttons */}
        <View style={styles.channelsRow}>
          <TouchableOpacity style={styles.channelBtn} onPress={handleCall}>
            <View style={[styles.channelIconWrap, { backgroundColor: THEME.colors.primaryLight }]}>
              <MaterialCommunityIcons name="phone-in-talk" size={24} color={THEME.colors.primary} />
            </View>
            <Text style={styles.channelTitle}>Toll Free</Text>
            <Text style={styles.channelSub}>1800-266-0000</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.channelBtn} onPress={handleWhatsApp}>
            <View style={[styles.channelIconWrap, { backgroundColor: THEME.colors.secondaryLight }]}>
              <MaterialCommunityIcons name="whatsapp" size={24} color={THEME.colors.secondaryDark} />
            </View>
            <Text style={styles.channelTitle}>WhatsApp</Text>
            <Text style={styles.channelSub}>Instant Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.channelBtn} onPress={handleEmail}>
            <View style={[styles.channelIconWrap, { backgroundColor: THEME.colors.accentLight }]}>
              <MaterialCommunityIcons name="email-fast-outline" size={24} color={THEME.colors.accent} />
            </View>
            <Text style={styles.channelTitle}>Email</Text>
            <Text style={styles.channelSub}>Tickets</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.topicsCard}>
          <Text style={styles.topicsTitle}>Browse by Topic</Text>

          <TouchableOpacity
            style={styles.topicRow}
            onPress={() => router.push("/(others)/FAQ" as any)}
          >
            <MaterialCommunityIcons name="shield-check" size={20} color={THEME.colors.primary} />
            <Text style={styles.topicText}>PESO Safety & Density Testing Standard</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.topicRow}
            onPress={() => router.push("/(others)/FAQ" as any)}
          >
            <MaterialCommunityIcons name="counter" size={20} color={THEME.colors.primary} />
            <Text style={styles.topicText}>Smart Flow Meter Calibration & Receipts</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.topicRow}
            onPress={() => router.push("/(others)/FAQ" as any)}
          >
            <MaterialCommunityIcons name="wallet" size={20} color={THEME.colors.primary} />
            <Text style={styles.topicText}>Payment, Invoicing & GST Input Tax Credit</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.topicRow}
            onPress={() =>
              Alert.alert(
                "Submit Complaint",
                "To report dispensing disputes, email tickets@diesellife.in with your Order ID."
              )
            }
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={THEME.colors.danger} />
            <Text style={[styles.topicText, { color: THEME.colors.danger }]}>
              Lodge Meter or Delay Grievance
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  urgentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    padding: 16,
    gap: 14,
  },
  urgentInfo: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  urgentSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    lineHeight: 16,
  },
  channelsRow: {
    flexDirection: "row",
    gap: 12,
  },
  channelBtn: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  channelIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  channelTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  channelSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  topicsCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  topicsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  topicText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
  },
});

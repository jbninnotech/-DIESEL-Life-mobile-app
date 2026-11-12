import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

export default function EmergencyDieselScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [liters, setLiters] = useState("50");
  const [urgencyReason, setUrgencyReason] = useState("Hospital / Clinic Genset Outage");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    addressData,
    isLoading: isLocationLoading,
    detectLocation,
  } = useCurrentLocation(true);

  const reasons = [
    "Hospital / Clinic Genset Outage",
    "Data Center / Server Cooling Critical",
    "Highway Vehicle Breakdown / Empty Tank",
    "Manufacturing Line Downtime",
  ];

  const handleDispatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Priority SOS Alert Dispatched",
        `Emergency Bowser #BWS-912 assigned. Nearest driver notified. Expected ETA: 18-25 mins at ${
          addressData?.city || "your current spot"
        }.`,
        [{ text: "Track SOS", onPress: () => router.push("/(tabs)/(orders)" as any) }]
      );
    }, 1000);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="SOS Emergency Fueling"
        subtitle="Priority Instant Bowser Dispatch (PESO Certified)"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.emergencyBanner}>
          <View style={styles.sirenIcon}>
            <MaterialCommunityIcons name="alarm-light" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>Priority Rapid Response</Text>
            <Text style={styles.bannerDesc}>
              Emergency bowser fleet is on standby for critical hospital gensets, stranded vehicles, and industrial facilities.
            </Text>
          </View>
        </View>

        {/* Location Spot */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Emergency Breakdown Spot</Text>
          <View style={styles.locationBox}>
            <MaterialCommunityIcons name="map-marker-alert" size={24} color={THEME.colors.danger} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>
                {addressData ? "GPS Pinned Location" : "Detecting Current GPS..."}
              </Text>
              <Text style={styles.locationAddr} numberOfLines={2}>
                {addressData?.formattedAddress || "Aquiring high-accuracy satellite coordinates..."}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.redetectBtn}
            onPress={detectLocation}
            disabled={isLocationLoading}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color={THEME.colors.primary} />
            <Text style={styles.redetectText}>
              {isLocationLoading ? "Pinpointing Device..." : "Refresh Exact GPS Coordinates"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liters Required */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Liters Required (Emergency)</Text>
          <View style={styles.litersRow}>
            {["20", "50", "100", "200"].map((qty) => (
              <TouchableOpacity
                key={qty}
                style={[styles.literPill, liters === qty && styles.literPillActive]}
                onPress={() => setLiters(qty)}
              >
                <Text style={[styles.literText, liters === qty && styles.literTextActive]}>
                  {qty} L
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Urgency Reason */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Emergency Cause</Text>
          {reasons.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.reasonRow, urgencyReason === r && styles.reasonRowActive]}
              onPress={() => setUrgencyReason(r)}
            >
              <MaterialCommunityIcons
                name={urgencyReason === r ? "radiobox-marked" : "radiobox-blank"}
                size={20}
                color={urgencyReason === r ? THEME.colors.danger : THEME.colors.textMuted}
              />
              <Text
                style={[
                  styles.reasonText,
                  urgencyReason === r && { color: THEME.colors.textPrimary, fontWeight: "700" },
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dispatch Button */}
        <TouchableOpacity
          style={[styles.dispatchBtn, isSubmitting && styles.dispatchBtnDisabled]}
          onPress={handleDispatch}
          disabled={isSubmitting}
        >
          <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFFFFF" />
          <Text style={styles.dispatchBtnText}>
            {isSubmitting ? "Dispatching Rapid Unit..." : "Request Immediate Bowser (SOS)"}
          </Text>
        </TouchableOpacity>
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
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.danger,
    borderRadius: THEME.radius.lg,
    padding: 16,
    gap: 14,
  },
  sirenIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
    lineHeight: 16,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.background,
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  locationAddr: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  redetectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
  },
  redetectText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  litersRow: {
    flexDirection: "row",
    gap: 10,
  },
  literPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  literPillActive: {
    backgroundColor: THEME.colors.dangerLight,
    borderColor: THEME.colors.danger,
  },
  literText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  literTextActive: {
    color: THEME.colors.danger,
    fontWeight: "800",
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  reasonRowActive: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  dispatchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: THEME.colors.danger,
    paddingVertical: 16,
    borderRadius: THEME.radius.lg,
    marginTop: 4,
    elevation: 4,
  },
  dispatchBtnDisabled: {
    opacity: 0.6,
  },
  dispatchBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

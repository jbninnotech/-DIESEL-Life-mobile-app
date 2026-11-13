import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { DeliveryPartnerInfo } from "../../types/orderWorkflow.types";

interface Props {
  partner: DeliveryPartnerInfo;
  estimatedArrival: string;
  remainingMinutes: number;
}

export const FlowDeliveryPartnerCard: React.FC<Props> = ({
  partner,
  estimatedArrival,
  remainingMinutes,
}) => {
  const handleCall = () => {
    Linking.openURL(`tel:${partner.phone}`).catch(() => {
      Alert.alert("Unable to place call", `Please dial ${partner.phone} directly.`);
    });
  };

  const handleSupport = () => {
    Alert.alert(
      "Dispatcher Support",
      "Connecting to 24/7 Bowser Operations Desk at +91 80 4000 9999",
      [{ text: "Call Desk", onPress: () => Linking.openURL("tel:+918040009999") }, { text: "Cancel" }]
    );
  };

  return (
    <View style={styles.card}>
      {/* ETA Banner */}
      <View style={styles.etaBanner}>
        <View style={styles.etaLeft}>
          <MaterialCommunityIcons name="timer-sand" size={20} color="#0369A1" />
          <Text style={styles.etaTitle}>Estimated Arrival:</Text>
        </View>
        <Text style={styles.etaValue}>
          {remainingMinutes > 0 ? `${remainingMinutes} mins (${estimatedArrival})` : "Arrived"}
        </Text>
      </View>

      {/* Driver info */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-hard-hat" size={28} color={THEME.colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{partner.name}</Text>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={14} color="#16A34A" />
              <Text style={styles.verifiedText}>Certified</Text>
            </View>
          </View>
          <Text style={styles.vehicleText}>{partner.vehicleType}</Text>
          <Text style={styles.regNo}>Reg: {partner.vehicleRegistration}</Text>
        </View>

        <View style={styles.ratingBadge}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{partner.rating}</Text>
        </View>
      </View>

      {/* Contact actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
          <MaterialCommunityIcons name="phone" size={18} color="#FFFFFF" />
          <Text style={styles.callBtnText}>Call Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportBtn} onPress={handleSupport} activeOpacity={0.8}>
          <MaterialCommunityIcons name="headset" size={18} color={THEME.colors.primary} />
          <Text style={styles.supportBtnText}>Disptach Desk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  etaBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  etaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  etaTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
  },
  etaValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0369A1",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
  },
  vehicleText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  regNo: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "600",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400E",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  callBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  supportBtn: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  supportBtnText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});

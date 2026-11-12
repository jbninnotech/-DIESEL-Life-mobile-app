import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { GeocodedAddress, ServiceabilityResult } from "../../types/booking.types";

interface DeliveryAddressCardProps {
  addressData: GeocodedAddress;
  serviceability?: ServiceabilityResult | null;
  onEdit?: () => void;
  onRefresh?: () => void;
  isConfirmed: boolean;
  onConfirm: () => void;
}

export const DeliveryAddressCard: React.FC<DeliveryAddressCardProps> = ({
  addressData,
  serviceability,
  onEdit,
  onRefresh,
  isConfirmed,
  onConfirm,
}) => {
  const isServiceable = serviceability ? serviceability.isServiceable : true;

  return (
    <View
      style={[
        styles.card,
        isConfirmed && styles.cardConfirmed,
        !isServiceable && styles.cardUnserviceable,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.tagWrap}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={16}
            color={isConfirmed ? THEME.colors.secondary : THEME.colors.primary}
          />
          <Text
            style={[
              styles.tagText,
              isConfirmed && { color: THEME.colors.secondaryDark },
            ]}
          >
            {isConfirmed ? "Confirmed Delivery Location" : "Detected Address"}
          </Text>
        </View>

        <View style={styles.actions}>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.actionBtn}>
              <MaterialCommunityIcons name="refresh" size={18} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={THEME.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.addressText}>{addressData.formattedAddress}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>City</Text>
          <Text style={styles.detailVal}>{addressData.city || "—"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>PIN Code</Text>
          <Text style={styles.detailVal}>{addressData.postalCode || "—"}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>GPS</Text>
          <Text style={styles.detailVal}>
            {addressData.coordinates.latitude.toFixed(3)},{" "}
            {addressData.coordinates.longitude.toFixed(3)}
          </Text>
        </View>
      </View>

      {/* Serviceability Badge */}
      {serviceability && (
        <View
          style={[
            styles.serviceabilityBanner,
            isServiceable ? styles.serviceableBg : styles.unserviceableBg,
          ]}
        >
          <MaterialCommunityIcons
            name={isServiceable ? "shield-check" : "alert-circle"}
            size={18}
            color={isServiceable ? THEME.colors.secondary : THEME.colors.danger}
          />
          <View style={styles.serviceabilityTextWrap}>
            <Text
              style={[
                styles.serviceabilityTitle,
                { color: isServiceable ? THEME.colors.secondaryDark : THEME.colors.danger },
              ]}
            >
              {isServiceable ? "Doorstep Delivery Available" : "Location Unserviceable"}
            </Text>
            <Text style={styles.serviceabilityDesc}>
              {isServiceable
                ? `Covered by ${serviceability.zoneName || "Regional Bowser Fleet"} • Est. ${
                    serviceability.estimatedDeliveryMinutes || 45
                  } mins delivery`
                : serviceability.reason || "Currently out of diesel bowser delivery range"}
            </Text>
          </View>
        </View>
      )}

      {/* Confirmation Button */}
      {!isConfirmed && isServiceable && (
        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.8}
          style={styles.confirmBtn}
        >
          <MaterialCommunityIcons name="check-bold" size={16} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>Confirm This Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardConfirmed: {
    borderColor: THEME.colors.secondary,
    backgroundColor: "#FAFDFB",
  },
  cardUnserviceable: {
    borderColor: THEME.colors.danger,
    backgroundColor: "#FFFBFB",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.primaryDark,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: THEME.radius.xs,
    backgroundColor: THEME.colors.borderLight,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    padding: 8,
    borderRadius: THEME.radius.md,
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  detailVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  serviceabilityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: THEME.radius.md,
    marginBottom: 10,
  },
  serviceableBg: {
    backgroundColor: THEME.colors.secondaryLight,
  },
  unserviceableBg: {
    backgroundColor: THEME.colors.dangerLight,
  },
  serviceabilityTextWrap: {
    flex: 1,
  },
  serviceabilityTitle: {
    fontSize: 12,
    fontWeight: "800",
  },
  serviceabilityDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    marginTop: 4,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});

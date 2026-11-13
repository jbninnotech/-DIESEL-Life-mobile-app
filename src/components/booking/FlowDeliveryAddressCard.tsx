import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { DeliveryAddressData } from "../../types/orderWorkflow.types";

interface Props {
  address: DeliveryAddressData;
  onUpdateAddress: (address: DeliveryAddressData) => void;
  onConfirm: () => void;
}

export const FlowDeliveryAddressCard: React.FC<Props> = ({
  address,
  onUpdateAddress,
  onConfirm,
}) => {
  const {
    addressData,
    isLoading: isGpsLoading,
    detectLocation,
    error: gpsError,
  } = useCurrentLocation(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleUseCurrentLocation = async () => {
    try {
      await detectLocation();
      if (addressData) {
        onUpdateAddress({
          ...address,
          buildingNumber: addressData.name || address.buildingNumber,
          streetName: addressData.street || address.streetName,
          area: addressData.district || address.area,
          city: addressData.city || address.city,
          state: addressData.region || address.state,
          pinCode: addressData.postalCode || address.pinCode,
          coordinates: addressData.coordinates,
          isLocationConfirmed: true,
        });
        Alert.alert("GPS Location Detected", "Address fields updated with your current device coordinates.");
      }
    } catch (e: any) {
      Alert.alert("Location Notice", e.message || "Could not retrieve GPS coordinates. Please fill manually.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="map-marker-radius" size={24} color={THEME.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Delivery Address & Farm Site</Text>
          <Text style={styles.subtitle}>Bowser tanker requires safe road access</Text>
        </View>
      </View>

      {/* GPS Action Button */}
      <TouchableOpacity
        style={styles.gpsBtn}
        onPress={handleUseCurrentLocation}
        disabled={isGpsLoading}
        activeOpacity={0.8}
      >
        {isGpsLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#FFFFFF" />
            <Text style={styles.gpsBtnText}>Use My Current Device Location</Text>
          </>
        )}
      </TouchableOpacity>
      {gpsError && <Text style={styles.errorText}>{gpsError}</Text>}

      {/* Address Form Fields */}
      <View style={styles.form}>
        <View style={styles.fieldRow}>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Contact Full Name *</Text>
            <TextInput
              style={styles.input}
              value={address.fullName}
              onChangeText={(t) => onUpdateAddress({ ...address, fullName: t })}
              placeholder="e.g. Ramesh Patil"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Primary Phone *</Text>
            <TextInput
              style={styles.input}
              value={address.phone}
              onChangeText={(t) => onUpdateAddress({ ...address, phone: t.replace(/[^0-9]/g, "") })}
              placeholder="10-digit Mobile"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Alternative Phone</Text>
            <TextInput
              style={styles.input}
              value={address.alternativePhone}
              onChangeText={(t) => onUpdateAddress({ ...address, alternativePhone: t.replace(/[^0-9]/g, "") })}
              placeholder="Site Supervisor Phone"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Plot / Shed / Bldg No. *</Text>
            <TextInput
              style={styles.input}
              value={address.buildingNumber}
              onChangeText={(t) => onUpdateAddress({ ...address, buildingNumber: t })}
              placeholder="e.g. Shed 4, Farm Gate"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
        </View>

        <View>
          <Text style={styles.fieldLabel}>Street / Road Name *</Text>
          <TextInput
            style={styles.input}
            value={address.streetName}
            onChangeText={(t) => onUpdateAddress({ ...address, streetName: t })}
            placeholder="e.g. Devanahalli Main Agro Highway"
            placeholderTextColor={THEME.colors.textMuted}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>Area / Locality *</Text>
            <TextInput
              style={styles.input}
              value={address.area}
              onChangeText={(t) => onUpdateAddress({ ...address, area: t })}
              placeholder="e.g. Industrial Agro Hub"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>PIN Code *</Text>
            <TextInput
              style={styles.input}
              value={address.pinCode}
              onChangeText={(t) => onUpdateAddress({ ...address, pinCode: t.replace(/[^0-9]/g, "") })}
              placeholder="6-digit PIN"
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>City *</Text>
            <TextInput
              style={styles.input}
              value={address.city}
              onChangeText={(t) => onUpdateAddress({ ...address, city: t })}
              placeholder="Bengaluru"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.fieldLabel}>State *</Text>
            <TextInput
              style={styles.input}
              value={address.state}
              onChangeText={(t) => onUpdateAddress({ ...address, state: t })}
              placeholder="Karnataka"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
        </View>

        <View>
          <Text style={styles.fieldLabel}>Delivery Instructions (Optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={address.deliveryInstructions}
            onChangeText={(t) => onUpdateAddress({ ...address, deliveryInstructions: t })}
            placeholder="e.g. Heavy tanker access gate on left, call supervisor upon arrival"
            placeholderTextColor={THEME.colors.textMuted}
            multiline
            numberOfLines={2}
          />
        </View>
      </View>

      {/* Coordinates status badge */}
      <View style={styles.coordsBadge}>
        <MaterialCommunityIcons name="map-marker-check" size={16} color="#059669" />
        <Text style={styles.coordsText}>
          GPS Target: {address.coordinates.latitude.toFixed(4)}, {address.coordinates.longitude.toFixed(4)}
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
        <Text style={styles.confirmBtnText}>Confirm Delivery Address</Text>
      </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  gpsBtn: {
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 14,
  },
  gpsBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  errorText: {
    color: THEME.colors.danger,
    fontSize: 12,
    marginBottom: 10,
  },
  form: {
    gap: 10,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 54,
    textAlignVertical: "top",
  },
  coordsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  coordsText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});

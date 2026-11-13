import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { FuelSupplier } from "../../types/orderWorkflow.types";

interface Props {
  supplier: FuelSupplier | null;
  visible: boolean;
  onClose: () => void;
  onConfirmSupplier: (supplier: FuelSupplier) => void;
  quantityLitres: number;
}

export const SupplierDetailModal: React.FC<Props> = ({
  supplier,
  visible,
  onClose,
  onConfirmSupplier,
  quantityLitres,
}) => {
  if (!supplier) return null;

  const total = quantityLitres * supplier.pricePerLitre;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.topBar}>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{supplier.name}</Text>
              <Text style={styles.tagline}>{supplier.tagline}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.addressText}>{supplier.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.contactText}>Direct Dispatch: {supplier.contactNumber}</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Price / Litre</Text>
              <Text style={styles.gridVal}>₹{supplier.pricePerLitre.toFixed(2)}</Text>
              <Text style={styles.gridSub}>Demo Live Rate</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Rating</Text>
              <Text style={styles.gridVal}>★ {supplier.rating}</Text>
              <Text style={styles.gridSub}>{supplier.reviewCount} Reviews</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Distance</Text>
              <Text style={styles.gridVal}>{supplier.distanceKm} km</Text>
              <Text style={styles.gridSub}>From delivery site</Text>
            </View>
          </View>

          {/* Slots Available */}
          <View style={styles.slotsBox}>
            <Text style={styles.slotsTitle}>Daily Dispatch Slots</Text>
            <View style={styles.slotsRow}>
              {supplier.availableSlots.map((slot) => (
                <View key={slot} style={styles.slotTag}>
                  <Text style={styles.slotTagText}>{slot}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pricing Confirmation Box */}
          <View style={styles.calcBox}>
            <View>
              <Text style={styles.calcLabel}>Selected Quantity</Text>
              <Text style={styles.calcLitres}>{quantityLitres} Litres</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.calcLabel}>Est. Total (Demo)</Text>
              <Text style={styles.calcTotal}>₹{Math.round(total).toLocaleString("en-IN")}</Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => {
              onConfirmSupplier(supplier);
              onClose();
            }}
          >
            <Text style={styles.confirmBtnText}>Select This Supplier & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  tagline: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  contactText: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 14,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "600",
  },
  gridVal: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  gridSub: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  slotsBox: {
    marginBottom: 16,
  },
  slotsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  slotTag: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  slotTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.primary,
  },
  calcBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 16,
  },
  calcLabel: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },
  calcLitres: {
    fontSize: 16,
    fontWeight: "800",
    color: "#166534",
  },
  calcTotal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#166534",
  },
  confirmBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});

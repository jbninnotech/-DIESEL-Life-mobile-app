import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";
import { MOCK_SUPPLIERS } from "../../data/supplierData";
import { FuelSupplier } from "../../types/orderWorkflow.types";

interface Props {
  selectedSupplier: FuelSupplier | null;
  onSelectSupplier: (supplier: FuelSupplier) => void;
  onViewDetails: (supplier: FuelSupplier) => void;
  quantityLitres: number;
}

export const SupplierListCard: React.FC<Props> = ({
  selectedSupplier,
  onSelectSupplier,
  onViewDetails,
  quantityLitres,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Certified Supplier / Farm Depot</Text>
      <Text style={styles.sectionSubtitle}>
        Refinery-tested diesel suppliers with calibrated mobile bowsers
      </Text>

      <View style={styles.list}>
        {MOCK_SUPPLIERS.map((supplier) => {
          const isSelected = selectedSupplier?.id === supplier.id;
          const estimatedCost = quantityLitres * supplier.pricePerLitre;

          return (
            <TouchableOpacity
              key={supplier.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelectSupplier(supplier)}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                <View style={styles.logoBadge}>
                  <MaterialCommunityIcons name="oil-lamp" size={24} color={THEME.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.supplierName} numberOfLines={1}>
                      {supplier.name}
                    </Text>
                    {supplier.isAvailable && (
                      <View style={styles.availBadge}>
                        <Text style={styles.availText}>AVAILABLE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.tagline} numberOfLines={1}>
                    {supplier.tagline}
                  </Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.metricVal}>
                    {supplier.rating} ({supplier.reviewCount})
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="map-marker-distance" size={14} color={THEME.colors.textMuted} />
                  <Text style={styles.metricVal}>{supplier.distanceKm} km away</Text>
                </View>
                <View style={styles.metricItem}>
                  <MaterialCommunityIcons name="gas-station-outline" size={14} color="#059669" />
                  <Text style={[styles.metricVal, { color: "#059669", fontWeight: "700" }]}>
                    ₹{supplier.pricePerLitre.toFixed(2)}/L
                  </Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.costLabel}>Est. Total ({quantityLitres} L)</Text>
                  <Text style={styles.costValue}>₹{Math.round(estimatedCost).toLocaleString("en-IN")}</Text>
                </View>

                <View style={styles.actionBtns}>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      onViewDetails(supplier);
                    }}
                  >
                    <Text style={styles.detailsBtnText}>Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
                    onPress={() => onSelectSupplier(supplier)}
                  >
                    <Text style={[styles.selectBtnText, isSelected && styles.selectBtnTextActive]}>
                      {isSelected ? "Selected" : "Select"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
    marginTop: 2,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#F0F9FF",
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  availBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#166534",
  },
  tagline: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricVal: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  costLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: "600",
  },
  costValue: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  actionBtns: {
    flexDirection: "row",
    gap: 8,
  },
  detailsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  selectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  selectBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  selectBtnTextActive: {
    color: "#FFFFFF",
  },
});

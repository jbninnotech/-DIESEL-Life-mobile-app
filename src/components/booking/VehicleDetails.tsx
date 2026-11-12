import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { VehicleCategory } from "../../types/booking.types";
import { CustomInput } from "../common/CustomInput";

interface VehicleDetailsProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
  vehicleNumber: string;
  onChangeVehicleNumber: (text: string) => void;
  categoryError?: string;
  numberError?: string;
}

const CATEGORIES: {
  category: VehicleCategory;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  needsNumber: boolean;
}[] = [
  { category: "Generator", icon: "flash", needsNumber: false },
  { category: "Car", icon: "car-side", needsNumber: true },
  { category: "Truck", icon: "truck-fast", needsNumber: true },
  { category: "Bus", icon: "bus", needsNumber: true },
  { category: "Tractor", icon: "tractor", needsNumber: false },
  { category: "Construction Equipment", icon: "crane", needsNumber: false },
  { category: "Industrial Equipment", icon: "factory", needsNumber: false },
  { category: "Other", icon: "cube-outline", needsNumber: false },
];

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  selectedCategory,
  onSelectCategory,
  vehicleNumber,
  onChangeVehicleNumber,
  categoryError,
  numberError,
}) => {
  const currentCategory = CATEGORIES.find((c) => c.category === selectedCategory);
  const showNumberField = currentCategory?.needsNumber || selectedCategory === "Other";

  return (
    <View style={styles.container}>
      <Text style={styles.subhead}>Target Asset / Equipment Category</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((item) => {
          const active = item.category === selectedCategory;
          return (
            <TouchableOpacity
              key={item.category}
              onPress={() => onSelectCategory(item.category)}
              style={[styles.catCard, active && styles.catCardActive]}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={active ? "#FFFFFF" : THEME.colors.primary}
                />
              </View>
              <Text style={[styles.catName, active && styles.catNameActive]} numberOfLines={2}>
                {item.category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {categoryError && <Text style={styles.errorText}>{categoryError}</Text>}

      {/* Vehicle / Asset Registration Number Input */}
      {showNumberField && (
        <View style={styles.inputWrap}>
          <CustomInput
            label="Vehicle / Asset Registration Number"
            icon="numeric"
            placeholder="e.g. DL 01 AB 1234 or Asset Tag #08"
            value={vehicleNumber}
            onChangeText={onChangeVehicleNumber}
            error={numberError}
            autoCapitalize="characters"
            required={currentCategory?.needsNumber}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  subhead: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  catCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    padding: 10,
  },
  catCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  iconWrapActive: {
    backgroundColor: THEME.colors.primary,
  },
  catName: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  catNameActive: {
    color: THEME.colors.primaryDark,
  },
  inputWrap: {
    marginTop: 6,
  },
  errorText: {
    marginBottom: 8,
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
});

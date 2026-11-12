import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { addVehicleSchema, AddVehicleFormData } from "../../schemas/profileSchemas";

interface VehicleItem {
  id: string;
  name: string;
  registrationNumber: string;
  category: string;
  capacityLitres: number;
  lastRefueled?: string;
}

const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: "veh-1",
    name: "Ashok Leyland 2820 Heavy Tipper",
    registrationNumber: "KA 01 MJ 8472",
    category: "Heavy Commercial Truck",
    capacityLitres: 350,
    lastRefueled: "10 Nov 2026 • 240L",
  },
  {
    id: "veh-2",
    name: "Cummins 125 kVA Silent DG Set",
    registrationNumber: "DG-GEN-WH12",
    category: "Stationary Diesel Generator",
    capacityLitres: 500,
    lastRefueled: "04 Nov 2026 • 450L",
  },
  {
    id: "veh-3",
    name: "JCB 3DX Super Backhoe Loader",
    registrationNumber: "KA 51 EA 9012",
    category: "Construction Equipment",
    capacityLitres: 120,
    lastRefueled: "28 Oct 2026 • 110L",
  },
];

export default function MyVehiclesScreen() {
  const insets = useSafeAreaInsets();
  const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddVehicleFormData>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      category: "heavy_truck",
      capacityLitres: 200,
    },
  });

  const handleAddVehicle = (data: AddVehicleFormData) => {
    const newVeh: VehicleItem = {
      id: `veh-${Date.now()}`,
      name: data.name,
      registrationNumber: data.registrationNumber,
      category:
        data.category === "heavy_truck"
          ? "Heavy Commercial Truck"
          : data.category === "generator"
          ? "Stationary Diesel Generator"
          : data.category === "construction_equipment"
          ? "Construction Equipment"
          : "Fleet Asset",
      capacityLitres: data.capacityLitres,
      lastRefueled: "Just Added",
    };
    setVehicles([newVeh, ...vehicles]);
    reset();
    setModalVisible(false);
    Alert.alert("Asset Registered", `${data.name} is ready for doorstep refueling.`);
  };

  const handleDeleteVehicle = (id: string, name: string) => {
    Alert.alert("Remove Asset", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setVehicles(vehicles.filter((v) => v.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="My Vehicles & Gensets"
        subtitle={`${vehicles.length} Assets Registered`}
        rightAction={
          <TouchableOpacity
            style={styles.addHeaderBtn}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={22} color={THEME.colors.primary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="truck-outline" size={54} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>No Vehicles Registered</Text>
            <Text style={styles.emptySubtitle}>
              Add your fleet trucks or diesel generators for 1-click doorstep bowser fueling.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.vehicleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name={
                    item.category.includes("Generator")
                      ? "generator-mobile"
                      : item.category.includes("Construction")
                      ? "crane"
                      : "truck"
                  }
                  size={24}
                  color={THEME.colors.primary}
                />
              </View>

              <View style={styles.headerInfo}>
                <Text style={styles.vehName}>{item.name}</Text>
                <Text style={styles.vehReg}>{item.registrationNumber}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteVehicle(item.id, item.name)}
                style={styles.deleteBtn}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={THEME.colors.danger} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Category</Text>
                <Text style={styles.footerVal}>{item.category}</Text>
              </View>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Tank Capacity</Text>
                <Text style={styles.footerVal}>{item.capacityLitres} L</Text>
              </View>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Last Refuel</Text>
                <Text style={styles.footerVal}>{item.lastRefueled}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Add Asset Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register Fueling Asset</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Asset / Vehicle Name *</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g. BharatBenz 3528 / Kirloskar DG"
                    placeholderTextColor={THEME.colors.textMuted}
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Registration / Asset Number *</Text>
              <Controller
                control={control}
                name="registrationNumber"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.registrationNumber && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g. KA 01 MJ 1234"
                    placeholderTextColor={THEME.colors.textMuted}
                    autoCapitalize="characters"
                  />
                )}
              />
              {errors.registrationNumber && (
                <Text style={styles.errorText}>{errors.registrationNumber.message}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fuel Tank Capacity (Litres) *</Text>
              <Controller
                control={control}
                name="capacityLitres"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.capacityLitres && styles.inputError]}
                    value={value ? String(value) : ""}
                    onChangeText={(val) => onChange(parseInt(val, 10) || 0)}
                    placeholder="300"
                    placeholderTextColor={THEME.colors.textMuted}
                    keyboardType="number-pad"
                  />
                )}
              />
              {errors.capacityLitres && (
                <Text style={styles.errorText}>{errors.capacityLitres.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => handleSubmit(handleAddVehicle)()}
            >
              <Text style={styles.modalSubmitText}>Save Asset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  addHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  vehicleCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehName: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  vehReg: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.primary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  footerVal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  inputError: {
    borderColor: THEME.colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
  modalSubmitBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    marginTop: 8,
  },
  modalSubmitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

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
import { MOCK_ADDRESSES } from "../../data/mockData";
import { UserAddress } from "../../types";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { savedAddressSchema, SavedAddressFormData } from "../../schemas/profileSchemas";

export default function SavedAddressesScreen() {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<UserAddress[]>(MOCK_ADDRESSES);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserAddress["tag"]>("Work");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavedAddressFormData>({
    resolver: zodResolver(savedAddressSchema),
    defaultValues: {
      tag: "Work",
      street: "",
      area: "",
      city: "Bengaluru",
      pincode: "560048",
      isDefault: false,
    },
  });

  const handleAddAddress = (data: SavedAddressFormData) => {
    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      tag: selectedTag,
      street: data.street,
      area: data.area,
      city: data.city,
      pincode: data.pincode,
      isDefault: false,
    };
    setAddresses([newAddr, ...addresses]);
    reset();
    setModalVisible(false);
    Alert.alert("Address Saved", "Delivery spot added to your account.");
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to remove this delivery spot?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setAddresses(addresses.filter((a) => a.id !== id)),
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Saved Addresses"
        subtitle={`${addresses.length} Delivery Spots`}
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
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, item.isDefault && styles.cardDefault]}>
            <View style={styles.cardTop}>
              <View style={styles.tagWrap}>
                <MaterialCommunityIcons
                  name={
                    item.tag === "Home"
                      ? "home-outline"
                      : item.tag === "Fleet Depot"
                      ? "warehouse"
                      : "domain"
                  }
                  size={16}
                  color={THEME.colors.primary}
                />
                <Text style={styles.tagText}>{item.tag}</Text>
                {item.isDefault && (
                  <View style={styles.defaultPill}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteAddress(item.id)}
                style={styles.trashBtn}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={THEME.colors.danger} />
              </TouchableOpacity>
            </View>

            <Text style={styles.streetText}>{item.street}</Text>
            <Text style={styles.areaText}>
              {item.area}, {item.city} - {item.pincode}
            </Text>

            {!item.isDefault && (
              <TouchableOpacity
                style={styles.setDefaultBtn}
                onPress={() => handleSetDefault(item.id)}
              >
                <MaterialCommunityIcons name="check-circle-outline" size={16} color={THEME.colors.primary} />
                <Text style={styles.setDefaultText}>Set as Default Drop Spot</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Add Address Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Delivery Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Tag Selection */}
            <View style={styles.tagsRow}>
              {(["Work", "Fleet Depot", "Home", "Other"] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tagSelect, selectedTag === t && styles.tagSelectActive]}
                  onPress={() => setSelectedTag(t)}
                >
                  <Text style={[styles.tagSelectText, selectedTag === t && styles.tagSelectTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Building / Street / Gate *</Text>
              <Controller
                control={control}
                name="street"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.street && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Plot / Gate / Factory unit"
                    placeholderTextColor={THEME.colors.textMuted}
                  />
                )}
              />
              {errors.street && <Text style={styles.errorText}>{errors.street.message}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Area / Industrial Layout *</Text>
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.area && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g. Whitefield Industrial Area"
                    placeholderTextColor={THEME.colors.textMuted}
                  />
                )}
              />
              {errors.area && <Text style={styles.errorText}>{errors.area.message}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.flex]}>
                <Text style={styles.label}>City *</Text>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.city && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Bengaluru"
                      placeholderTextColor={THEME.colors.textMuted}
                    />
                  )}
                />
              </View>

              <View style={[styles.fieldGroup, styles.flex]}>
                <Text style={styles.label}>PIN Code *</Text>
                <Controller
                  control={control}
                  name="pincode"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.pincode && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="560048"
                      placeholderTextColor={THEME.colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  )}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => handleSubmit(handleAddAddress)()}
            >
              <Text style={styles.modalSubmitText}>Save Address</Text>
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
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
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
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    elevation: 2,
  },
  cardDefault: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#F8FAFC",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.colors.primaryDark,
    textTransform: "uppercase",
  },
  defaultPill: {
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.secondaryDark,
  },
  trashBtn: {
    padding: 4,
  },
  streetText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  areaText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  setDefaultBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
  },
  setDefaultText: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: "700",
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
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  tagSelect: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  tagSelectActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  tagSelectText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  tagSelectTextActive: {
    color: THEME.colors.primary,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  inputError: {
    borderColor: THEME.colors.danger,
  },
  errorText: {
    fontSize: 11,
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

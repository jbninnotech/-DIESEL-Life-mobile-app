import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import SearchBar from "./Searchbar";



export interface DropdownOption {
  label: string; // shown in the list and in the field
  value: string; // unique value
  subtitle?: string; // optional second line (e.g. pincode)
}

interface SearchDropdownProps {
  label: string;
  placeholder: string;
  value: string; // currently selected value
  options: DropdownOption[];
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  onSelect: (option: DropdownOption) => void;
}

// One searchable dropdown used for State, District and City
export default function SearchDropdown({
  label,
  placeholder,
  value,
  options,
  loading = false,
  disabled = false,
  error,
  required = true,
  onSelect,
}: SearchDropdownProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [options, search]);

  const close = () => {
    setVisible(false);
    setSearch("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? " *" : ""}
      </Text>

      <Pressable
        style={[styles.button, disabled && styles.disabled]}
        disabled={disabled}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[styles.value, !selected && styles.placeholder]}
          numberOfLines={1}
        >
          {loading ? "Loading..." : selected?.label || placeholder}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#16866A" />
        ) : (
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#64748B"
          />
        )}
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} />

          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Select {label}</Text>

              <Pressable onPress={close}>
                <MaterialCommunityIcons
                  name="close"
                  size={25}
                  color="#334155"
                />
              </Pressable>
            </View>

            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={`Search ${label.toLowerCase()}...`}
            />

            <Text style={styles.count}>{filtered.length} results</Text>

            <FlatList
              data={filtered}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <Pressable
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      onSelect(item);
                      close();
                    }}
                  >
                    <View style={styles.optionBody}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>

                      {!!item.subtitle && (
                        <Text style={styles.optionSub}>{item.subtitle}</Text>
                      )}
                    </View>

                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={21}
                        color="#16866A"
                      />
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="map-search-outline"
                    size={35}
                    color="#94A3B8"
                  />
                  <Text style={styles.emptyText}>
                    No {label.toLowerCase()} found
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  button: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  disabled: { backgroundColor: "#F1F5F9", opacity: 0.7 },

  value: { flex: 1, fontSize: 14, color: "#0F172A", marginRight: 10 },

  placeholder: { color: "#94A3B8" },

  errorText: { color: "#DC2626", fontSize: 12, marginTop: 6 },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  backdrop: { ...StyleSheet.absoluteFill },

  sheet: {
    height: "75%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: { fontSize: 18, fontWeight: "700", color: "#0F172A" },

  count: { fontSize: 12, color: "#64748B", marginBottom: 8 },

  option: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionSelected: { backgroundColor: "#ECFDF5" },

  optionBody: { flex: 1 },

  optionText: { fontSize: 14, color: "#334155" },

  optionTextSelected: { color: "#16866A", fontWeight: "600" },

  optionSub: { fontSize: 12, color: "#64748B", marginTop: 2 },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
    gap: 10,
  },

  emptyText: { fontSize: 14, color: "#64748B" },
});
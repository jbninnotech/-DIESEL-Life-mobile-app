
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const API = "https://api.postalpincode.in";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

export interface LocationValue {
  state: string;
  district: string;
  city: string;
  pincode: string;
}

interface Office {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
}

interface Props {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

interface SelectProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  disabled?: boolean;
  loading?: boolean;
  onSelect: (value: string) => void;
}

function SearchSelect({
  label,
  value,
  placeholder,
  options,
  disabled,
  loading,
  onSelect,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(
    () =>
      options.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [options, search]
  );

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label} *</Text>

      <Pressable
        disabled={disabled || loading}
        onPress={() => {
          setSearch("");
          setVisible(true);
        }}
        style={[styles.select, disabled && styles.disabled]}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={21}
          color="#22CCD8"
        />

        <Text
          style={[styles.selectText, !value && styles.placeholder]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>

        {loading ? (
          <ActivityIndicator color="#22CCD8" />
        ) : (
          <MaterialCommunityIcons
            name="chevron-down"
            size={23}
            color="#64748B"
          />
        )}
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {label}</Text>

            <Pressable onPress={() => setVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={25}
                color="#334155"
              />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color="#64748B"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={`Search ${label.toLowerCase()}...`}
              style={styles.searchInput}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>No results found</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}
              >
                <Text style={styles.optionText}>{item}</Text>

                {value === item && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={21}
                    color="#22CCD8"
                  />
                )}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

async function getPostOffices(url: string): Promise<Office[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Location API request failed");
  }

  const result = await response.json();

  if (result?.[0]?.Status !== "Success") {
    throw new Error("No location data found");
  }

  return result[0].PostOffice || [];
}

export default function LocationSelector({
  value,
  onChange,
}: Props) {
  const [districts, setDistricts] = useState<string[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [error, setError] = useState("");

  // Load all districts belonging to selected state.
  useEffect(() => {
    let active = true;

    async function loadDistricts() {
      setDistricts([]);
      setOffices([]);
      setError("");

      if (!value.state) return;

      setLoadingDistricts(true);

      try {
        const records = await getPostOffices(
          `${API}/postoffice/${encodeURIComponent(value.state)}`
        );

        const result = [
          ...new Set(
            records
              .map((item) => item.District)
              .filter(Boolean)
          ),
        ].sort();

        if (active) {
          setDistricts(result);
        }
      } catch (e) {
        if (active) {
          setError("Unable to load districts. Please try again.");
        }
      } finally {
        if (active) setLoadingDistricts(false);
      }
    }

    loadDistricts();

    return () => {
      active = false;
    };
  }, [value.state]);

  // Load post offices for selected district.
  useEffect(() => {
    let active = true;

    async function loadOffices() {
      setOffices([]);
      setError("");

      if (!value.state || !value.district) return;

      setLoadingOffices(true);

      try {
        const records = await getPostOffices(
          `${API}/postoffice/${encodeURIComponent(value.district)}`
        );

        const filtered = records.filter(
          (item) =>
            item.State.toLowerCase() === value.state.toLowerCase() &&
            item.District.toLowerCase() === value.district.toLowerCase()
        );

        if (active) {
          setOffices(filtered);
        }
      } catch {
        if (active) {
          setError("Unable to load areas. Please try again.");
        }
      } finally {
        if (active) setLoadingOffices(false);
      }
    }

    loadOffices();

    return () => {
      active = false;
    };
  }, [value.state, value.district]);

  const areas = useMemo(
    () =>
      [...new Set(offices.map((item) => item.Name))].sort(),
    [offices]
  );

  return (
    <View>
      <SearchSelect
        label="State"
        placeholder="Search and select state"
        options={STATES}
        value={value.state}
        onSelect={(state) =>
          onChange({
            state,
            district: "",
            city: "",
            pincode: "",
          })
        }
      />

      <SearchSelect
        label="District"
        placeholder="Select district"
        options={districts}
        value={value.district}
        disabled={!value.state}
        loading={loadingDistricts}
        onSelect={(district) =>
          onChange({
            ...value,
            district,
            city: "",
            pincode: "",
          })
        }
      />

      <SearchSelect
        label="City / Post Office"
        placeholder="Search city or area"
        options={areas}
        value={value.city}
        disabled={!value.district}
        loading={loadingOffices}
        onSelect={(city) => {
          const office = offices.find(
            (item) => item.Name === city
          );

          onChange({
            ...value,
            city,
            pincode: office?.Pincode || "",
          });
        }}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Pincode *</Text>

        <View style={styles.select}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={21}
            color="#22CCD8"
          />

          <Text
            style={[
              styles.selectText,
              !value.pincode && styles.placeholder,
            ]}
          >
            {value.pincode || "Automatically filled"}
          </Text>

          {value.pincode && (
            <MaterialCommunityIcons
              name="check-circle"
              color="#16A34A"
              size={21}
            />
          )}
        </View>
      </View>

      {!!error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  select: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  disabled: {
    backgroundColor: "#F8FAFC",
    opacity: 0.6,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  placeholder: {
    color: "#94A3B8",
  },
  modal: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
  },
  searchBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  option: {
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    color: "#334155",
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 35,
    color: "#94A3B8",
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 12,
  },
});

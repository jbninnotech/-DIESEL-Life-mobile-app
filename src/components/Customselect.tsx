import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface CustomSelectProps {
  label: string;
  required?: boolean;
  icon: IconName;
  options: string[];
  value: string | null;
  onSelect: (value: string) => void;
}

export default function CustomSelect({
  label,
  required = false,
  icon,
  options,
  value,
  onSelect,
}: CustomSelectProps): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const handleToggle = (): void => {
    Keyboard.dismiss();
    setOpen((previous) => !previous);
  };

  const handleSelect = (option: string): void => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleToggle}
        style={[styles.select, open && styles.selectOpen]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={open ? "#0875D1" : "#64748B"}
        />

        <Text
          style={[styles.selectText, value === null && styles.selectPlaceholder]}
        >
          {value ?? "Select one"}
        </Text>

        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={24}
          color="#0F172A"
        />
      </TouchableOpacity>

      {open ? (
        <View style={styles.options}>
          {options.map((option, index) => {
            const isSelected = value === option;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => handleSelect(option)}
                style={[
                  styles.option,
                  index < options.length - 1 && styles.optionDivider,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>

                {isSelected ? (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#16A34A"
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 18,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  required: {
    color: "#16A34A",
  },

  select: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 56,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  selectOpen: {
    borderColor: "#0875D1",
    borderWidth: 2,
    backgroundColor: "#F8FBFF",
  },

  selectText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  selectPlaceholder: {
    color: "#94A3B8",
  },

  options: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  optionSelected: {
    backgroundColor: "#E8F3FC",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  optionTextSelected: {
    color: "#0875D1",
    fontWeight: "700",
  },
});
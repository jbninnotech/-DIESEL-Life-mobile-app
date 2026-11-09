import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface CustomFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  hint: string;
  icon: IconName;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  prefix?: string;
  containerStyle?: object;
}

export default function CustomField({
  label,
  required = false,
  placeholder,
  hint,
  icon,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  maxLength,
  prefix,
  containerStyle,
}: CustomFieldProps): React.JSX.Element {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={focused ? "#0875D1" : "#64748B"}
        />

        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* {value.trim().length > 0 ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color="#16A34A"
          />
        ) : null} */}
      </View>

      <Text style={styles.hint}>{hint}</Text>
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
    color: "#e01f1f",
  },

  inputWrap: {
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

  inputWrapFocused: {
    borderColor: "#0875D1",
    borderWidth: 2,
    backgroundColor: "#F8FBFF",
  },

  prefix: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    paddingVertical: 0,
  },

  hint: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 6,
    marginLeft: 4,
  },
});

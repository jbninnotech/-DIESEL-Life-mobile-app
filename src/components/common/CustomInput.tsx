import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface CustomInputProps extends TextInputProps {
  label: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  helperText?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  error,
  containerStyle,
  helperText,
  required,
  multiline,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMulti,
          !!error && styles.inputContainerError,
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={error ? THEME.colors.danger : THEME.colors.primary}
            style={multiline ? styles.iconTop : styles.iconCenter}
          />
        )}
        <TextInput
          placeholderTextColor={THEME.colors.textMuted}
          style={[styles.input, multiline && styles.inputMulti]}
          multiline={multiline}
          {...props}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  requiredStar: {
    color: THEME.colors.danger,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputContainerMulti: {
    alignItems: "flex-start",
    paddingVertical: 10,
    minHeight: 88,
  },
  inputContainerError: {
    borderColor: THEME.colors.danger,
    backgroundColor: THEME.colors.dangerLight,
  },
  iconCenter: {
    marginRight: 10,
  },
  iconTop: {
    marginRight: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    paddingVertical: 8,
  },
  inputMulti: {
    textAlignVertical: "top",
    minHeight: 68,
    paddingTop: 0,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
});

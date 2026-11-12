import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isGradient = variant === "primary";

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? THEME.colors.primary : "#FFFFFF"}
        />
      );
    }

    return (
      <>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={size === "large" ? 22 : 18}
            color={variant === "outline" ? THEME.colors.primary : "#FFFFFF"}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.baseText,
            size === "small" && styles.textSmall,
            size === "large" && styles.textLarge,
            variant === "outline" && styles.textOutline,
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </>
    );
  };

  if (isGradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        disabled={disabled || loading}
        style={[styles.baseWrap, style]}
      >
        <LinearGradient
          colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientContainer,
            size === "small" && styles.sizeSmall,
            size === "large" && styles.sizeLarge,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        size === "small" && styles.sizeSmall,
        size === "large" && styles.sizeLarge,
        variant === "secondary" && styles.btnSecondary,
        variant === "outline" && styles.btnOutline,
        variant === "danger" && styles.btnDanger,
        disabled && styles.btnDisabled,
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseWrap: {
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
  },
  gradientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.lg,
  },
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
  },
  btnSecondary: {
    backgroundColor: THEME.colors.secondary,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  btnDanger: {
    backgroundColor: THEME.colors.danger,
  },
  btnDisabled: {
    backgroundColor: THEME.colors.border,
  },
  sizeSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  icon: {
    marginRight: 8,
  },
  baseText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: 12,
    fontWeight: "600",
  },
  textLarge: {
    fontSize: 17,
    fontWeight: "800",
  },
  textOutline: {
    color: THEME.colors.primary,
  },
  textDisabled: {
    color: THEME.colors.textMuted,
  },
});

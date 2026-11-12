import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, style }) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={20} color={THEME.colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.dangerLight,
    padding: 12,
    borderRadius: THEME.radius.md,
    marginVertical: 8,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.danger,
    marginLeft: 8,
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xs,
    marginLeft: 8,
  },
  retryText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.danger,
  },
});

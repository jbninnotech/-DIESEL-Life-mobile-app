import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = "file-document-outline",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons
          name={icon}
          size={42}
          color={THEME.colors.primary}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action ? <View style={styles.actionWrap}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  actionWrap: {
    marginTop: 20,
    width: "100%",
    maxWidth: 220,
  },
});

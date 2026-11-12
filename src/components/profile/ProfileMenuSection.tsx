import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface ProfileMenuSectionProps {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
}

export const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({
  title,
  icon,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={THEME.colors.primary}
            style={styles.headerIcon}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.card}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});

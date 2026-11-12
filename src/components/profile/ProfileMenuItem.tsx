import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface ProfileMenuItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  badge?: string | number;
  badgeColor?: string;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = THEME.colors.primary,
  onPress,
  destructive = false,
  showChevron = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrap,
          destructive ? styles.iconWrapDestructive : styles.iconWrapDefault,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={destructive ? THEME.colors.danger : THEME.colors.primary}
        />
      </View>

      <View style={styles.textWrap}>
        <Text
          style={[styles.title, destructive && styles.titleDestructive]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {badge !== undefined && (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {showChevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={THEME.colors.textMuted}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: THEME.colors.surface,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconWrapDefault: {
    backgroundColor: THEME.colors.primaryLight,
  },
  iconWrapDestructive: {
    backgroundColor: THEME.colors.dangerLight,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  titleDestructive: {
    color: THEME.colors.danger,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});

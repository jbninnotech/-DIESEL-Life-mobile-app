import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  rightElement,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.left}>
        {icon && (
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={icon} size={18} color={THEME.colors.primary} />
          </View>
        )}
        <View style={styles.titlesWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  titlesWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  right: {
    marginLeft: 12,
  },
});

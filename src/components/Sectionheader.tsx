import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface SectionHeaderProps {
  icon: IconName;
  title: string;
}

export default function SectionHeader({
  icon,
  title,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <MaterialCommunityIcons name={icon} size={18} color="#0875D1" />
      </View>

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },

  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E8F3FC",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
});
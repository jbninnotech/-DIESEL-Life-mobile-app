import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface BookingHeaderProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({
  onBack,
  title = "Book Diesel",
  subtitle = "Diesel Delivered Wherever You Need",
}) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && { transform: [{ scale: 0.92 }], opacity: 0.8 },
          ]}
          hitSlop={12}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
      )}

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ON-DEMAND</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.notificationBtn}>
        <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});

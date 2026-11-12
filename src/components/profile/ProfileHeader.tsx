import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "../../constants/theme";
import { UserProfile } from "../../types";

interface ProfileHeaderProps {
  user: UserProfile;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  return (
    <LinearGradient
      colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons name="account" size={38} color="#FFFFFF" />
            </View>
          )}
          <TouchableOpacity
            style={styles.avatarBadge}
            activeOpacity={0.8}
            onPress={onEditPress}
          >
            <MaterialCommunityIcons name="pencil" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={16} color="#34D399" />
            </View>
          </View>
          <Text style={styles.userPhone}>{user.phone}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email}
          </Text>

          <View style={styles.tierPill}>
            <MaterialCommunityIcons name="shield-crown" size={13} color="#F59E0B" />
            <Text style={styles.tierText}>{user.memberTier || "Verified Fleet Partner"}</Text>
          </View>
        </View>
      </View>

      {/* Quick stats row */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>₹{user.walletBalance?.toLocaleString("en-IN") || "0"}</Text>
          <Text style={styles.statLabel}>Wallet Balance</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{user.totalOrdersCount || 0}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{user.loyaltyPoints || 0}</Text>
          <Text style={styles.statLabel}>Fleet Points</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  infoCol: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    maxWidth: "85%",
  },
  verifiedBadge: {
    padding: 1,
  },
  userPhone: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 1,
  },
  tierPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  tierText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: THEME.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statVal: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: THEME.colors.textMuted,
    marginTop: 2,
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.border,
  },
});

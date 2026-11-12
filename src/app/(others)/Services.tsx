// Put this file at: app/(tabs)/(home)/services.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import {
  CATEGORY_ROUTES,
  PRODUCT_CATEGORIES,
  SERVICES_BANNER,
} from "../../data/Servicecategories";

const WHY_ITEMS = [
  { icon: "clock-check-outline", label: "On-Time\nDelivery" },
  { icon: "water-check-outline", label: "Quality\nFuel" },
  { icon: "tag-check-outline", label: "Transparent\nPricing" },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={THEME.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.headerBtn} accessibilityLabel="Search">
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={THEME.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: SERVICES_BANNER }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Our Services */}
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.list}>
          {PRODUCT_CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => router.push(CATEGORY_ROUTES[item.id] as any)}
            >
              <Image source={{ uri: item.image }} style={styles.rowImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.subtitle}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={THEME.colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Why Choose Us */}
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.whyRow}>
          {WHY_ITEMS.map((w) => (
            <View key={w.label} style={styles.whyItem}>
              <MaterialCommunityIcons
                name={w.icon as any}
                size={28}
                color={THEME.colors.primary}
              />
              <Text style={styles.whyLabel}>{w.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  banner: {
    height: 170,
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    marginTop: 4,
    marginBottom: 18,
  },
  bannerImage: { width: "100%", height: "100%" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  list: { gap: 10, marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  rowImage: { width: 64, height: 64, borderRadius: 12 },
  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  rowSub: { fontSize: 12, color: THEME.colors.textSecondary, marginTop: 2 },
  whyRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 16,
  },
  whyItem: { alignItems: "center", gap: 6 },
  whyLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
    textAlign: "center",
    lineHeight: 15,
  },
});
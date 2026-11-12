import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const COLORS = {
  active: "#0891B2",
  inactive: "#94A3B8",
  bg: "#FFFFFF",
  border: "#F1F5F9",
  gradient: ["#22CCD8", "#0EA5E9"] as const,
};

interface TabConfig {
  name: string;
  title: string;
  active: IconName;
  inactive: IconName;
}

const TABS: Record<string, TabConfig> = {
  home: {
    name: "(home)/index",
    title: "Home",
    active: "home",
    inactive: "home-outline",
  },
  orders: {
    name: "(orders)/index",
    title: "Orders",
    active: "clipboard-list",
    inactive: "clipboard-list-outline",
  },
  wallet: {
    name: "(wallet)/index",
    title: "Wallet",
    active: "wallet",
    inactive: "wallet-outline",
  },
  profile: {
    name: "(profile)/index",
    title: "Profile",
    active: "account-circle",
    inactive: "account-circle-outline",
  },
};

function TabIcon({ focused, tab }: { focused: boolean; tab: TabConfig }) {
  return (
    <View style={styles.tabIconContainer}>
      <MaterialCommunityIcons
        name={focused ? tab.active : tab.inactive}
        size={24}
        color={focused ? COLORS.active : COLORS.inactive}
      />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

function CenterBookButton({
  onPress,
  focused,
}: {
  onPress?: (e: any) => void;
  focused: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.centerButtonWrap,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.centerButtonRing}>
        <LinearGradient
          colors={COLORS.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerButtonCircle}
        >
          <MaterialCommunityIcons name="water" size={26} color="#FFFFFF" />
        </LinearGradient>
      </View>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? COLORS.active : COLORS.inactive },
        ]}
      >
        Book
      </Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 16 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: {
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          backgroundColor: COLORS.bg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 12,
          shadowColor: "#0F172A",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 10,
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} tab={TABS.home} />
          ),
        }}
      />

      {/* 2. Orders */}
      <Tabs.Screen
        name="(orders)/index"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} tab={TABS.orders} />
          ),
        }}
      />

      {/* 3. DEAD CENTER: Book */}
      <Tabs.Screen
        name="(book)/index"
        options={{
          title: "Book",
          tabBarButton: (props) => (
            <CenterBookButton
              onPress={props.onPress}
              focused={props.accessibilityState?.selected ?? false}
            />
          ),
        }}
      />

      {/* 4. Wallet */}
      <Tabs.Screen
        name="(wallet)/index"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} tab={TABS.wallet} />
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="(profile)/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} tab={TABS.profile} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.active,
    position: "absolute",
    bottom: -6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 4,
  },
  centerButtonWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 48,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  centerButtonRing: {
    position: "absolute",
    top: -22,
    padding: 4,
    borderRadius: 32,
    backgroundColor: COLORS.bg,
    elevation: 8,
    shadowColor: "#0891B2",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  centerButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
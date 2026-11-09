import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const COLORS = {
  active: "#22ccd8",
  inactive: "#94A3B8",
  bg: "#FFFFFF",
  border: "#E5E7EB",
  activeBg: "#DCFCE7",
};

interface TabConfig {
  name: string;
  title: string;
  active: IconName;
  inactive: IconName;
}

const TABS: TabConfig[] = [
  {
    name: "(home)/index",
    title: "Home",
    active: "home",
    inactive: "home-outline",
  },
  {
    name: "(orders)/index",
    title: "Orders",
    active: "clipboard-list",
    inactive: "clipboard-list-outline",
  },
  {
    name: "(wallet)/index",
    title: "Wallet",
    active: "wallet",
    inactive: "wallet-outline",
  },
  {
    name: "(profile)/index",
    title: "Profile",
    active: "account-circle",
    inactive: "account-circle-outline",
  },
];

function TabIcon({ focused, tab }: { focused: boolean; tab: TabConfig }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialCommunityIcons
        name={focused ? tab.active : tab.inactive}
        size={24}
        color={focused ? COLORS.active : COLORS.inactive}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, Platform.OS === "ios" ? 0 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          height: 62 + bottom,
          paddingTop: 8,
          paddingBottom: bottom,
          backgroundColor: COLORS.bg,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: COLORS.border,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 8,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} tab={tab} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: COLORS.activeBg,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});

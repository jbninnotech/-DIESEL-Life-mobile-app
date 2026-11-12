import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const COLORS = {
  active: "#22ccd8",
  inactive: "#94A3B8",
  bg: "#FFFFFF",
  border: "#E5E7EB",
  gradient: ["#22ccd8", "#16A34A"] as const,
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
    name: "(track)/index",
    title: "Track",
    active: "map-marker-path",
    inactive: "map-marker-outline",
  },
  {
    name: "(profile)/index",
    title: "Profile",
    active: "account-circle",
    inactive: "account-circle-outline",
  },
];

function TabIcon({ focused, tab }: { focused: boolean; tab: TabConfig }) {
  if (focused) {
    return (
      <LinearGradient
        colors={COLORS.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrap}
      >
        <MaterialCommunityIcons name={tab.active} size={24} color="#FFFFFF" />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.iconWrap}>
      <MaterialCommunityIcons
        name={tab.inactive}
        size={24}
        color={COLORS.inactive}
      />
    </View>
  );
}

function BookTabButton({
  onPress,
  focused,
}: {
  onPress?: (e: any) => void;
  focused: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.bookWrap}>
      <View style={styles.bookRing}>
        <LinearGradient
          colors={COLORS.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bookCircle}
        >
          <MaterialCommunityIcons name="water" size={28} color="#FFFFFF" />
        </LinearGradient>
      </View>
      <Text
        style={[
          styles.label,
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
  const bottom = Math.max(insets.bottom, Platform.OS === "ios" ? 0 : 8);

  const renderTab = (tab: TabConfig) => (
    <Tabs.Screen
      key={tab.name}
      name={tab.name}
      options={{
        title: tab.title,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} tab={tab} />,
      }}
    />
  );

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
          overflow: "visible",
        },
      }}
    >
      {TABS.slice(0, 2).map(renderTab)}

      <Tabs.Screen
        name="(book)/index"
        options={{
          title: "Book",
          tabBarButton: (props) => (
            <BookTabButton
              onPress={props.onPress}
              focused={props.accessibilityState?.selected ?? false}
            />
          ),
        }}
      />

      {TABS.slice(2).map(renderTab)}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  bookWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bookRing: {
    marginTop: -28,
    padding: 5,
    borderRadius: 40,
    backgroundColor: COLORS.bg,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  bookCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});

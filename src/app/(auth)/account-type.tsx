import React, { useState } from "react";

import PrimaryButton from "@/components/PrimaryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "../../components/Customheader";

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type AccountTypeId = "organization" | "individual";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface AccountOption {
  id: AccountTypeId;
  title: string;
  description: string;
  icon: IconName;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    id: "organization",
    title: "Organization / Business",
    description:
      "Manage fuel orders for your company, business, fleet or institution.",
    icon: "domain",
  },
  {
    id: "individual",
    title: "Individual",
    description: "Order diesel for your own vehicle or personal use.",
    icon: "account-outline",
  },
];

export default function AccountType(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<AccountTypeId | null>(null);

  const handleContinue = (): void => {
    if (!selected) return;

    if (selected === "organization") {
      router.push("/(auth)/organization-details");
      return;
    }

    router.push("/(auth)/individual");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <CustomHeader title="" pageName="Account Type" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Select Account Type</Text>

        <Text style={styles.subtitle}>
          Tell us how you'd like to use Dieselify so we can set up the right
          experience for you.
        </Text>

        <View style={styles.list}>
          {ACCOUNT_OPTIONS.map((option) => {
            const isSelected = selected === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => setSelected(option.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={30}
                    color={isSelected ? "#FFFFFF" : "#0875D1"}
                  />
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>
                    {option.description}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name={isSelected ? "check-circle" : "circle-outline"}
                  size={26}
                  color={isSelected ? "#16A34A" : "#CBD5E1"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}
      >
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
          loading={false}
        />

        <View style={styles.footerRow}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={14}
            color="#94A3B8"
          />
          <Text style={styles.footerText}>
            You can change your account type later from settings.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0875D1",
    letterSpacing: -0.5,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    marginBottom: 26,
  },

  list: {
    gap: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  cardSelected: {
    borderColor: "#0875D1",
    borderWidth: 2,
    backgroundColor: "#F8FBFF",
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#E8F3FC",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    backgroundColor: "#0875D1",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#64748B",
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },

  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});
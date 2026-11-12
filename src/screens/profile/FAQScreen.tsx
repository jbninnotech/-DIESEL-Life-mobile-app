import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { MOCK_FAQS } from "../../data/mockData";
import { ScreenHeader } from "../../components/common/ScreenHeader";

export default function FAQScreen() {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="FAQs" subtitle="Questions on Doorstep Fueling & Bowser Safety" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MOCK_FAQS.map((faq, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <View key={idx} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(idx)}
                activeOpacity={0.8}
              >
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <MaterialCommunityIcons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  color={THEME.colors.primary}
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqBody}>
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  faqCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
});

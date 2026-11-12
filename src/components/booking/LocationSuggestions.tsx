import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { LocationSearchResult } from "../../services/locationService";

interface LocationSuggestionsProps {
  suggestions: LocationSearchResult[];
  onSelect: (item: LocationSearchResult) => void;
  isLoading: boolean;
}

export const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  suggestions,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="map-search" size={20} color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Searching delivery addresses & PIN codes...</Text>
      </View>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.itemRow,
              index === suggestions.length - 1 && styles.lastItem,
            ]}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color={THEME.colors.primary}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.primaryText} numberOfLines={1}>
                {item.primaryText}
              </Text>
              <Text style={styles.secondaryText} numberOfLines={1}>
                {item.secondaryText || item.fullAddress}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={THEME.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 6,
    marginBottom: 12,
    maxHeight: 220,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: THEME.radius.md,
    marginVertical: 6,
  },
  loadingText: {
    fontSize: 12,
    color: THEME.colors.primaryDark,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textWrap: {
    flex: 1,
  },
  primaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  secondaryText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});

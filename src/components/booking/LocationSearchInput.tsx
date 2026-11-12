import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { LocationSearchResult, locationService } from "../../services/locationService";
import { LocationSuggestions } from "./LocationSuggestions";

interface LocationSearchInputProps {
  onLocationSelect: (result: LocationSearchResult) => void;
  placeholder?: string;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  placeholder = "Search area, street, landmark, or PIN code...",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const items = await locationService.geocodeQuery(text);
      setResults(items);
    } catch (e) {
      console.warn("Search query error", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item: LocationSearchResult) => {
    setQuery(item.primaryText);
    setResults([]);
    onLocationSelect(item);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={THEME.colors.primary}
          style={styles.searchIcon}
        />
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {isSearching ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} style={styles.rightAction} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={clearSearch} style={styles.rightAction}>
            <MaterialCommunityIcons name="close-circle" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <LocationSuggestions
        suggestions={results}
        onSelect={handleSelect}
        isLoading={isSearching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  rightAction: {
    padding: 4,
  },
});

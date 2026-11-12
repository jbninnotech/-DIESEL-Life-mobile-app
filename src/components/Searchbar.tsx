import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  loading = false,
  autoFocus = false,
}: SearchBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={22} color="#64748B" />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoFocus={autoFocus}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#16866A" />
      ) : (
        value.length > 0 && (
          <Pressable onPress={() => onChangeText("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    height: "100%",
  },
});
import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface PreferencesSectionProps {
  onNotificationSettings: () => void;
  onLanguageSettings: () => void;
  onThemeSettings: () => void;
  onLocationPreferences: () => void;
  languageText?: string;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  onNotificationSettings,
  onLanguageSettings,
  onThemeSettings,
  onLocationPreferences,
  languageText = "English (IN)",
}) => {
  return (
    <ProfileMenuSection title="D. Preferences" icon="tune">
      <ProfileMenuItem
        icon="bell-outline"
        title="Notification Settings"
        subtitle="Push alerts, SMS updates & dispatch pings"
        onPress={onNotificationSettings}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="translate"
        title="Language Settings"
        subtitle={languageText}
        onPress={onLanguageSettings}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="palette-outline"
        title="Theme Settings"
        subtitle="Diesel Life High-Contrast Fleet Mode"
        onPress={onThemeSettings}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="crosshairs-gps"
        title="Location Preferences"
        subtitle="GPS accuracy, background tracking & geofencing"
        onPress={onLocationPreferences}
      />
    </ProfileMenuSection>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: THEME.colors.borderLight,
    marginLeft: 68,
  },
});

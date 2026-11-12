import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface InformationSectionProps {
  onAbout: () => void;
  onPrivacyPolicy: () => void;
  onTerms: () => void;
  appVersion?: string;
}

export const InformationSection: React.FC<InformationSectionProps> = ({
  onAbout,
  onPrivacyPolicy,
  onTerms,
  appVersion = "v2.4.0 (Build 580)",
}) => {
  return (
    <ProfileMenuSection title="F. Information" icon="information-outline">
      <ProfileMenuItem
        icon="shield-check-outline"
        title="About DIESEL Life"
        subtitle="PESO Certified doorstep fueling network"
        onPress={onAbout}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="file-document-outline"
        title="Privacy Policy"
        subtitle="Data privacy & location usage compliance"
        onPress={onPrivacyPolicy}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="text-box-check-outline"
        title="Terms and Conditions"
        subtitle="Service terms, billing & safety protocols"
        onPress={onTerms}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="cellphone-information"
        title="App Version"
        subtitle={appVersion}
        showChevron={false}
        badge="Latest"
        badgeColor={THEME.colors.secondary}
        onPress={() => {}}
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

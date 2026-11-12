import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface SupportSectionProps {
  onHelpCentre: () => void;
  onFAQ: () => void;
  onContactUs: () => void;
  onCallSupport: () => void;
  onWhatsAppSupport: () => void;
  onSubmitComplaint: () => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  onHelpCentre,
  onFAQ,
  onContactUs,
  onCallSupport,
  onWhatsAppSupport,
  onSubmitComplaint,
}) => {
  return (
    <ProfileMenuSection title="E. Help and Support" icon="lifebuoy">
      <ProfileMenuItem
        icon="help-circle-outline"
        title="Help Centre"
        subtitle="Guides, refueling safety, and instructions"
        onPress={onHelpCentre}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="frequently-asked-questions"
        title="Frequently Asked Questions"
        subtitle="Quick answers to common queries"
        onPress={onFAQ}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="email-outline"
        title="Contact Us"
        subtitle="support@diesellife.in • 24x7 Operations"
        onPress={onContactUs}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="phone-outline"
        title="Call Support"
        subtitle="1800-DIESEL-LIFE (Toll Free)"
        onPress={onCallSupport}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="whatsapp"
        title="WhatsApp Support"
        subtitle="Instant chat with Bowser Dispatch Officer"
        onPress={onWhatsAppSupport}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="alert-octagon-outline"
        title="Submit Complaint"
        subtitle="Lodge ticket for meter or delay discrepancies"
        onPress={onSubmitComplaint}
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

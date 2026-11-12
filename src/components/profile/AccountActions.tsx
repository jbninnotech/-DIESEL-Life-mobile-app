import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";

interface AccountActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <ProfileMenuSection title="G. Account Actions" icon="shield-alert-outline">
      <ProfileMenuItem
        icon="logout-variant"
        title="Logout"
        subtitle="Sign out from this mobile device"
        destructive={true}
        onPress={onLogout}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="account-remove-outline"
        title="Delete Account"
        subtitle="Permanently remove your profile and billing records"
        destructive={true}
        onPress={onDeleteAccount}
      />
    </ProfileMenuSection>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#FEE2E2",
    marginLeft: 68,
  },
});

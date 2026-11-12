import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileMenuSection } from "./ProfileMenuSection";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { THEME } from "../../constants/theme";

interface AccountSectionProps {
  onPersonalInformation: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onMyVehicles: () => void;
  onSavedAddresses: () => void;
  vehiclesCount?: number;
  addressesCount?: number;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  onPersonalInformation,
  onEditProfile,
  onChangePassword,
  onMyVehicles,
  onSavedAddresses,
  vehiclesCount = 3,
  addressesCount = 3,
}) => {
  return (
    <ProfileMenuSection title="A. My Account" icon="account-cog">
      <ProfileMenuItem
        icon="account-outline"
        title="Personal Information"
        subtitle="Manage your identity & contact details"
        onPress={onPersonalInformation}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="account-edit-outline"
        title="Edit Profile"
        subtitle="Update name, mobile, and email address"
        onPress={onEditProfile}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="lock-reset"
        title="Change Password"
        subtitle="Secure account access credentials"
        onPress={onChangePassword}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="truck-outline"
        title="My Vehicles & Gensets"
        subtitle="Registered bowser fueling assets"
        badge={vehiclesCount}
        onPress={onMyVehicles}
      />
      <View style={styles.divider} />
      <ProfileMenuItem
        icon="map-marker-multiple-outline"
        title="Saved Addresses"
        subtitle="Depots, sites, and drop locations"
        badge={addressesCount}
        onPress={onSavedAddresses}
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

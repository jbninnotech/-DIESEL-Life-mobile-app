import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionModal from "../../../components/common/ActionModal";
import { THEME } from "../../../constants/theme";
import { MOCK_ADDRESSES, MOCK_USER } from "../../../data/mockData";
import { UserProfile } from "../../../types";

// Reusable Profile Components
import {
  ProfileHeader,
  AccountSection,
  ActivitySection,
  WalletSection,
  PreferencesSection,
  SupportSection,
  InformationSection,
  AccountActions,
} from "../../../components/profile";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  // Logout modal state
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Navigation handlers
  const handleEditProfile = () => router.push("/(others)/EditProfile" as any);
  const handleChangePassword = () => router.push("/(others)/ChangePassword" as any);
  const handleMyVehicles = () => router.push("/(others)/MyVehicles" as any);
  const handleSavedAddresses = () => router.push("/(others)/SavedAddresses" as any);

  const handleMyOrders = () => router.push("/(tabs)/(orders)" as any);
  const handleBookingHistory = () => router.push("/(tabs)/(orders)" as any);
  const handleReorderHistory = () => router.push("/(tabs)/(orders)" as any);
  const handleTrackActiveOrder = () => router.push("/(tabs)/(orders)" as any);

  const handleWalletDashboard = () => router.push("/(others)/Wallet" as any);
  const handleAddMoney = () => router.push("/(others)/Wallet" as any);
  const handleTransactionHistory = () => router.push("/(others)/TransactionHistory" as any);
  const handleRefundHistory = () =>
    router.push("/(others)/TransactionHistory?filter=Refunds" as any);
  const handlePaymentHistory = () =>
    router.push("/(others)/TransactionHistory?filter=Payments" as any);

  const handleNotificationSettings = () => router.push("/(others)/NotificationSettings" as any);
  const handleLanguageSettings = () =>
    Alert.alert(
      "Language Selection",
      "Diesel Life is currently operating in English (IN). Hindi, Kannada, Tamil, and Telugu language packs are rolling out shortly."
    );
  const handleThemeSettings = () =>
    Alert.alert(
      "Theme Preference",
      "Diesel Life High-Contrast Sunlight & Fleet mode is active for optimal outdoor visibility."
    );
  const handleLocationPreferences = () =>
    Alert.alert(
      "Location Preferences",
      "High-accuracy satellite GPS tracking is enabled for Bowser delivery coordination."
    );

  const handleHelpCentre = () => router.push("/(others)/HelpCentre" as any);
  const handleFAQ = () => router.push("/(others)/FAQ" as any);
  const handleContactUs = () => {
    Linking.openURL("mailto:support@diesellife.in").catch(() =>
      Alert.alert("Contact Us", "Reach support at support@diesellife.in")
    );
  };
  const handleCallSupport = () => {
    Linking.openURL("tel:18002660000").catch(() =>
      Alert.alert("Call Support", "Call 1800-266-0000 (Toll Free)")
    );
  };
  const handleWhatsAppSupport = () => {
    Linking.openURL("https://wa.me/919876543210").catch(() =>
      Alert.alert("WhatsApp Support", "WhatsApp support at +91 98765 43210")
    );
  };
  const handleSubmitComplaint = () => {
    Alert.alert(
      "Submit Grievance",
      "To report fuel meter or dispatch concerns, please send your Order ID to grievances@diesellife.in or contact your dedicated Fleet Operations Officer."
    );
  };

  const handleAbout = () => router.push("/(others)/About" as any);
  const handlePrivacyPolicy = () => router.push("/(others)/PrivacyPolicy" as any);
  const handleTerms = () => router.push("/(others)/Terms" as any);

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    router.replace("/(auth)/login" as any);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your Diesel Life account? All active credits, saved fleet assets, and GST invoices will be erased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => {
            router.replace("/(auth)/login" as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Component */}
        <ProfileHeader user={user} onEditPress={handleEditProfile} />

        <View style={styles.sectionsContainer}>
          {/* Section A: My Account */}
          <AccountSection
            onPersonalInformation={handleEditProfile}
            onEditProfile={handleEditProfile}
            onChangePassword={handleChangePassword}
            onMyVehicles={handleMyVehicles}
            onSavedAddresses={handleSavedAddresses}
            vehiclesCount={3}
            addressesCount={MOCK_ADDRESSES.length}
          />

          {/* Section B: My Activity */}
          <ActivitySection
            onMyOrders={handleMyOrders}
            onBookingHistory={handleBookingHistory}
            onReorderHistory={handleReorderHistory}
            onTrackActiveOrder={handleTrackActiveOrder}
            activeOrdersCount={user.activeOrdersCount}
          />

          {/* Section C: My Wallet */}
          <WalletSection
            walletBalance={user.walletBalance}
            onWalletDashboard={handleWalletDashboard}
            onAddMoney={handleAddMoney}
            onTransactionHistory={handleTransactionHistory}
            onRefundHistory={handleRefundHistory}
            onPaymentHistory={handlePaymentHistory}
          />

          {/* Section D: Preferences */}
          <PreferencesSection
            onNotificationSettings={handleNotificationSettings}
            onLanguageSettings={handleLanguageSettings}
            onThemeSettings={handleThemeSettings}
            onLocationPreferences={handleLocationPreferences}
            languageText="English (IN)"
          />

          {/* Section E: Help and Support */}
          <SupportSection
            onHelpCentre={handleHelpCentre}
            onFAQ={handleFAQ}
            onContactUs={handleContactUs}
            onCallSupport={handleCallSupport}
            onWhatsAppSupport={handleWhatsAppSupport}
            onSubmitComplaint={handleSubmitComplaint}
          />

          {/* Section F: Information */}
          <InformationSection
            onAbout={handleAbout}
            onPrivacyPolicy={handlePrivacyPolicy}
            onTerms={handleTerms}
            appVersion="v2.4.0 (Build 580)"
          />

          {/* Section G: Account Actions */}
          <AccountActions
            onLogout={() => setLogoutModalVisible(true)}
            onDeleteAccount={handleDeleteAccount}
          />
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ActionModal
        visible={logoutModalVisible}
        title="Confirm Logout"
        subtitle="Are you sure you want to sign out from Diesel Life on this device?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onClose={() => setLogoutModalVisible(false)}
        confirmDestructive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

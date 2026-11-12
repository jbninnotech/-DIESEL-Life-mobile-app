import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionModal from "../../../components/common/ActionModal";
import { THEME } from "../../../constants/theme";
import { MOCK_ADDRESSES, MOCK_FAQS, MOCK_USER } from "../../../data/mockData";
import { UserAddress, UserProfile } from "../../../types";

type ProfileTab = "Personal" | "Addresses" | "Settings" | "Support";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [addresses, setAddresses] = useState<UserAddress[]>(MOCK_ADDRESSES);
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal");

  // Edit Profile Modal
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editDob, setEditDob] = useState(user.dob);
  const [editGender, setEditGender] = useState(user.gender);

  // Address Modal
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [addrTag, setAddrTag] = useState<UserAddress["tag"]>("Work");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrArea, setAddrArea] = useState("");
  const [addrCity, setAddrCity] = useState("Bengaluru");
  const [addrPincode, setAddrPincode] = useState("");

  // Account Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [marketingOffers, setMarketingOffers] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (IN)");
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Logout modal
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Expanded FAQ state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Validation Error", "Name and email are required fields.");
      return;
    }
    setUser((prev) => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone,
      dob: editDob,
      gender: editGender,
    }));
    setEditProfileVisible(false);
    Alert.alert("Success", "Personal profile updated successfully.");
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddrTag("Work");
    setAddrStreet("");
    setAddrArea("");
    setAddrCity("Bengaluru");
    setAddrPincode("");
    setAddressModalVisible(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddress(addr);
    setAddrTag(addr.tag);
    setAddrStreet(addr.street);
    setAddrArea(addr.area);
    setAddrCity(addr.city);
    setAddrPincode(addr.pincode);
    setAddressModalVisible(true);
  };

  const handleSaveAddress = () => {
    if (!addrStreet.trim() || !addrPincode.trim()) {
      Alert.alert("Required Fields", "Street address and Pincode are required.");
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
                ...a,
                tag: addrTag,
                street: addrStreet,
                area: addrArea,
                city: addrCity,
                pincode: addrPincode,
              }
            : a
        )
      );
    } else {
      const newAddr: UserAddress = {
        id: `addr-${Date.now()}`,
        tag: addrTag,
        street: addrStreet,
        area: addrArea,
        city: addrCity,
        pincode: addrPincode,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }

    setAddressModalVisible(false);
    Alert.alert(
      "Address Saved",
      "Delivery depot address has been saved for bowser dispatch."
    );
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    Alert.alert(
      "Default Delivery Address Set",
      "This address will be pre-selected on your upcoming diesel orders."
    );
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this delivery address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Missing Fields", "Please enter current and new password.");
      return;
    }
    setChangePasswordVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    Alert.alert("Security Updated", "Your account password has been updated.");
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={styles.root}>
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[THEME.colors.gradientStart, THEME.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Account & Profile</Text>
          <TouchableOpacity
            style={styles.editHeaderBtn}
            onPress={() => setEditProfileVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.editHeaderText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile User Card */}
        <View style={styles.profileUserCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImg}
            />
            <View style={styles.badgeTier}>
              <MaterialCommunityIcons name="shield-star" size={14} color="#FFF" />
            </View>
          </View>

          <View style={styles.userMainInfo}>
            <Text style={styles.userNameText}>{user.name}</Text>
            <Text style={styles.userTierText}>{user.memberTier}</Text>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Profile Section Tabs */}
      <View style={styles.tabsRow}>
        {(["Personal", "Addresses", "Settings", "Support"] as ProfileTab[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* Tab Specific Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. PERSONAL INFORMATION */}
        {activeTab === "Personal" && (
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
                <Text style={styles.cardActionText}>Edit Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldList}>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <Text style={styles.fieldValue}>{user.name}</Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <Text style={styles.fieldValue}>{user.email}</Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <Text style={styles.fieldValue}>{user.phone}</Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <Text style={styles.fieldValue}>{user.dob}</Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <Text style={styles.fieldValue}>{user.gender}</Text>
              </View>
              <View style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>Loyalty Tier</Text>
                <Text style={styles.fieldValue}>{user.memberTier}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 2. ADDRESS MANAGEMENT */}
        {activeTab === "Addresses" && (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionTopBar}>
              <Text style={styles.sectionTitle}>Saved Delivery Locations</Text>
              <TouchableOpacity
                style={styles.addAddressBtn}
                onPress={handleOpenAddAddress}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
                <Text style={styles.addAddressText}>Add Location</Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => (
              <View key={addr.id} style={styles.addressCard}>
                <View style={styles.addressTop}>
                  <View style={styles.tagWrap}>
                    <MaterialCommunityIcons
                      name={
                        addr.tag === "Home"
                          ? "home-outline"
                          : addr.tag === "Fleet Depot"
                          ? "truck-outline"
                          : "office-building-outline"
                      }
                      size={16}
                      color={THEME.colors.primary}
                    />
                    <Text style={styles.tagText}>{addr.tag}</Text>
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.addrActions}>
                    <TouchableOpacity
                      onPress={() => handleOpenEditAddress(addr)}
                      style={styles.addrActionBtn}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={18}
                        color={THEME.colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(addr.id)}
                      style={styles.addrActionBtn}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={18}
                        color={THEME.colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.addrStreet}>{addr.street}</Text>
                <Text style={styles.addrCity}>
                  {addr.area}, {addr.city} - {addr.pincode}
                </Text>

                {!addr.isDefault && (
                  <TouchableOpacity
                    style={styles.setDefaultBtn}
                    onPress={() => handleSetDefaultAddress(addr.id)}
                  >
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={15}
                      color={THEME.colors.textSecondary}
                    />
                    <Text style={styles.setDefaultText}>
                      Set as Default Delivery Address
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 3. ACCOUNT SETTINGS */}
        {activeTab === "Settings" && (
          <View style={styles.sectionWrap}>
            {/* Security */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Account Security</Text>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => setChangePasswordVisible(true)}
              >
                <View style={styles.settingIcon}>
                  <MaterialCommunityIcons
                    name="lock-reset"
                    size={20}
                    color={THEME.colors.primary}
                  />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingSub}>
                    Update password for account sign-in
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Notification Preferences */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Notification Preferences</Text>

              <View style={styles.switchItem}>
                <View style={styles.switchTexts}>
                  <Text style={styles.switchLabel}>Push Notifications</Text>
                  <Text style={styles.switchSub}>
                    Real-time dispenser arrival & fuel meter updates
                  </Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ true: THEME.colors.primary, false: "#CBD5E1" }}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchTexts}>
                  <Text style={styles.switchLabel}>SMS Order Confirmations</Text>
                  <Text style={styles.switchSub}>
                    OTP and critical bowser dispatch codes via SMS
                  </Text>
                </View>
                <Switch
                  value={smsAlerts}
                  onValueChange={setSmsAlerts}
                  trackColor={{ true: THEME.colors.primary, false: "#CBD5E1" }}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchTexts}>
                  <Text style={styles.switchLabel}>
                    Commercial Offers & Deals
                  </Text>
                  <Text style={styles.switchSub}>
                    Monsoon passes and bulk discount alerts
                  </Text>
                </View>
                <Switch
                  value={marketingOffers}
                  onValueChange={setMarketingOffers}
                  trackColor={{ true: THEME.colors.primary, false: "#CBD5E1" }}
                />
              </View>
            </View>

            {/* Language & Privacy */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Language & Privacy</Text>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert(
                    "Language Selection",
                    "Diesel Life is currently available in English (India). Hindi & Kannada fleet editions coming soon.",
                    [{ text: "OK" }]
                  )
                }
              >
                <View style={styles.settingIcon}>
                  <MaterialCommunityIcons
                    name="translate"
                    size={20}
                    color={THEME.colors.primary}
                  />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingLabel}>App Language</Text>
                  <Text style={styles.settingSub}>{selectedLanguage}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert(
                    "Privacy Settings",
                    "PESO compliance records and fuel quality GPS stamps are retained for 365 days under safety regulations."
                  )
                }
              >
                <View style={styles.settingIcon}>
                  <MaterialCommunityIcons
                    name="shield-account-outline"
                    size={20}
                    color={THEME.colors.primary}
                  />
                </View>
                <View style={styles.settingTexts}>
                  <Text style={styles.settingLabel}>Privacy Policy & Data</Text>
                  <Text style={styles.settingSub}>
                    Manage telemetry and fleet sharing
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4. SUPPORT & HELP */}
        {activeTab === "Support" && (
          <View style={styles.sectionWrap}>
            {/* Quick Contact buttons */}
            <View style={styles.supportGrid}>
              <TouchableOpacity
                style={styles.supportBox}
                onPress={() =>
                  Alert.alert(
                    "Fleet Support Hotline",
                    "Call +91 80 4123 9900 for 24x7 fuel dispatch & emergency bowser dispatch."
                  )
                }
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="phone-in-talk"
                  size={26}
                  color={THEME.colors.primary}
                />
                <Text style={styles.supportBoxTitle}>Call Support</Text>
                <Text style={styles.supportBoxSub}>24x7 Fleet Desk</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportBox}
                onPress={() =>
                  Alert.alert(
                    "Email Support",
                    "Send inquiries to support@diesellife.in. Typical response time is under 15 mins."
                  )
                }
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="email-fast-outline"
                  size={26}
                  color="#16A34A"
                />
                <Text style={styles.supportBoxTitle}>Email Us</Text>
                <Text style={styles.supportBoxSub}>support@diesellife.in</Text>
              </TouchableOpacity>
            </View>

            {/* FAQs Accordion */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
              {MOCK_FAQS.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.faqItem}
                    onPress={() =>
                      setExpandedFaqIndex(isExpanded ? null : index)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQ}>{faq.q}</Text>
                      <MaterialCommunityIcons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={THEME.colors.textMuted}
                      />
                    </View>
                    {isExpanded && <Text style={styles.faqA}>{faq.a}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Legal Links */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Legal & Compliances</Text>

              <TouchableOpacity
                style={styles.legalItem}
                onPress={() =>
                  Linking.openURL("https://example.com/terms").catch(() => {})
                }
              >
                <Text style={styles.legalText}>Terms & Conditions</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={16}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.legalItem}
                onPress={() =>
                  Linking.openURL("https://example.com/privacy").catch(() => {})
                }
              >
                <Text style={styles.legalText}>Privacy Policy</Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={16}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.legalItem}
                onPress={() =>
                  Alert.alert(
                    "PESO License Details",
                    "License: PESO/BLR/DIESEL/2026/8812\nCalibrated meters certified by Legal Metrology Department, Govt. of India."
                  )
                }
              >
                <Text style={styles.legalText}>
                  PESO Calibration & Metrology Certifications
                </Text>
                <MaterialCommunityIcons
                  name="certificate-outline"
                  size={16}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Account Actions & Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={THEME.colors.danger}
            />
            <Text style={styles.logoutBtnText}>Log Out from Diesel Life</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Diesel Life App v1.0.0 (Build 42)</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Personal Profile</Text>
            <TouchableOpacity onPress={() => setEditProfileVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={THEME.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Full Name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <TextInput
                style={styles.formInput}
                value={editDob}
                onChangeText={setEditDob}
                placeholder="DD Mon YYYY"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender</Text>
              <TextInput
                style={styles.formInput}
                value={editGender}
                onChangeText={setEditGender}
                placeholder="Male / Female / Other"
              />
            </View>

            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={handleSaveProfile}
              activeOpacity={0.85}
            >
              <Text style={styles.saveProfileText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Address Add / Edit Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingAddress ? "Edit Location" : "Add Delivery Location"}
            </Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={THEME.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <Text style={styles.formLabel}>Location Tag</Text>
            <View style={styles.tagSelectRow}>
              {(["Work", "Fleet Depot", "Home", "Other"] as UserAddress["tag"][]).map(
                (tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagOption,
                      addrTag === tag && styles.tagOptionActive,
                    ]}
                    onPress={() => setAddrTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagOptionText,
                        addrTag === tag && styles.tagOptionTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Building / Depot / Street</Text>
              <TextInput
                style={styles.formInput}
                value={addrStreet}
                onChangeText={setAddrStreet}
                placeholder="e.g. Warehouse 12, Logistic Tech Park"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Area / Landmark</Text>
              <TextInput
                style={styles.formInput}
                value={addrArea}
                onChangeText={setAddrArea}
                placeholder="e.g. Mahadevapura, Near Gate 2"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>City</Text>
              <TextInput
                style={styles.formInput}
                value={addrCity}
                onChangeText={setAddrCity}
                placeholder="Bengaluru"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Pincode</Text>
              <TextInput
                style={styles.formInput}
                value={addrPincode}
                onChangeText={setAddrPincode}
                placeholder="560048"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={handleSaveAddress}
              activeOpacity={0.85}
            >
              <Text style={styles.saveProfileText}>
                {editingAddress ? "Update Location" : "Save Location"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <ActionModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        title="Change Password"
        subtitle="Ensure your new password contains at least 8 characters with numbers."
        confirmText="Update Password"
        onConfirm={handleChangePassword}
      >
        <View style={{ gap: 12 }}>
          <View>
            <Text style={styles.formLabel}>Current Password</Text>
            <TextInput
              style={styles.formInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>
          <View>
            <Text style={styles.formLabel}>New Password</Text>
            <TextInput
              style={styles.formInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>
        </View>
      </ActionModal>

      {/* Logout Confirmation Modal */}
      <ActionModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Log Out of Diesel Life?"
        subtitle="You will need to verify your registered mobile number via OTP to log back in."
        confirmText="Log Out"
        confirmDestructive
        onConfirm={handleConfirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  editHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileUserCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrap: {
    position: "relative",
  },
  avatarImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeTier: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  userMainInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  userTierText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DCFCE7",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  contactText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: THEME.colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionWrap: {
    gap: 14,
  },
  sectionTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addAddressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  cardActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  fieldList: {
    gap: 12,
  },
  fieldItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.borderLight,
  },
  fieldLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  addressCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  addressTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: THEME.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.secondaryDark,
  },
  addrActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addrActionBtn: {
    padding: 4,
  },
  addrStreet: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  addrCity: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  setDefaultBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
  },
  setDefaultText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.borderLight,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTexts: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  settingSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.borderLight,
  },
  switchTexts: {
    flex: 1,
    paddingRight: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  switchSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  supportGrid: {
    flexDirection: "row",
    gap: 12,
  },
  supportBox: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  supportBoxTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
    marginTop: 8,
  },
  supportBoxSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.borderLight,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQ: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
    paddingRight: 8,
  },
  faqA: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.borderLight,
  },
  legalText: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.textPrimary,
  },
  logoutSection: {
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: THEME.colors.dangerLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.danger,
  },
  versionText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  formInput: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  tagSelectRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  tagOption: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  tagOptionActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  tagOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.textSecondary,
  },
  tagOptionTextActive: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
  saveProfileBtn: {
    backgroundColor: THEME.colors.primary,
    height: 50,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveProfileText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import CustomField from "@/components/Customfield";
import CustomHeader from "@/components/Customheader";
import CustomSelect from "@/components/Customselect";
import PrimaryButton from "@/components/PrimaryButton";
import SectionHeader from "@/components/Sectionheader";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RoleField = "designation" | "businessType";

export interface AccountDetailsValues {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstNumber: string;
  designation: string;
  businessType: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  monthlyRequirement: string;
  referralCode: string;
  source: string;
}

interface AccountDetailsFormProps {
  pageName: string;
  showCompanyName?: boolean;
  companyLabel?: string;
  roleField?: RoleField;
  gstRequired?: boolean;
  showCompanySection?: boolean;
  onSubmit?: (values: AccountDetailsValues) => void | Promise<void>;
}

const SOURCES = [
  "Google Search",
  "Social Media",
  "Friend or Colleague",
  "Advertisement",
  "Other",
];

const BUSINESS_TYPES = [
  "Transport & Logistics",
  "Construction",
  "Manufacturing",
  "Agriculture",
  "Mining",
  "Fuel Dealer / Retail",
  "Other",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;
const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

// Alert.alert does not work on React Native Web, so fall back to window.alert
const showAlert = (title: string, message: string): void => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function AccountDetailsForm({
  pageName,
  showCompanyName = false,
  companyLabel = "Company Name",
  roleField = "designation",
  gstRequired = true,
  showCompanySection = true,
  onSubmit,
}: AccountDetailsFormProps): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [businessType, setBusinessType] = useState<string | null>(null);

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [monthlyRequirement] = useState("");
  const [referralCode] = useState("");

  const [source, setSource] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Returns the list of fields that are currently invalid
  const getInvalidFields = (): string[] => {
    const invalid: string[] = [];

    if (name.trim().length === 0) invalid.push("Name");
    if (!EMAIL_REGEX.test(email.trim())) invalid.push("Email");
    if (!PHONE_REGEX.test(phone)) invalid.push("Phone Number (10 digits)");

    if (showCompanySection) {
      if (showCompanyName && companyName.trim().length === 0) {
        invalid.push(companyLabel);
      }

      const gstOk = gstRequired
        ? GST_REGEX.test(gstNumber)
        : gstNumber === "" || GST_REGEX.test(gstNumber);
      if (!gstOk) invalid.push("GST Number (15-character GSTIN)");

      if (roleField === "designation") {
        if (designation.trim().length === 0) invalid.push("Designation");
      } else if (businessType === null) {
        invalid.push("Business Type");
      }
    }

    if (addressLine.trim().length === 0) invalid.push("Address");
    if (city.trim().length === 0) invalid.push("City");
    if (state.trim().length === 0) invalid.push("State");
    if (!PINCODE_REGEX.test(pincode)) invalid.push("Pincode (6 digits)");
    if (source === null) invalid.push("How did you hear about us?");

    return invalid;
  };

  const handleContinue = async (): Promise<void> => {
    if (submitting) return;

    console.log("[AccountDetailsForm] Continue pressed");
    Keyboard.dismiss();

    const invalidFields = getInvalidFields();

    if (invalidFields.length > 0) {
      console.log("[AccountDetailsForm] Invalid fields:", invalidFields);
      showAlert(
        "Incomplete Details",
        `Please fix the following:\n\n• ${invalidFields.join("\n• ")}`
      );
      return;
    }

    const formData: AccountDetailsValues = {
      name: name.trim(),
      email: email.trim(),
      phone,
      companyName: companyName.trim(),
      gstNumber,
      designation: designation.trim(),
      businessType: businessType ?? "",
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode,
      monthlyRequirement,
      referralCode: referralCode.trim(),
      source: source ?? "",
    };

    setSubmitting(true);

    try {
      // Wait for the parent's handler (e.g. an API call) before navigating
      await onSubmit?.(formData);
    } catch (error) {
      console.log("[AccountDetailsForm] onSubmit failed:", error);
      setSubmitting(false);
      showAlert("Something went wrong", "Could not save your details. Please try again.");
      return;
    }

    console.log("[AccountDetailsForm] Navigating to home");
    setSubmitting(false);

    // If this route doesn't work, try "/(tabs)" or "/" depending on your app/ folder
    router.replace("/(tabs)/(home)");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <CustomHeader title="" pageName={pageName} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* PERSONAL DETAILS */}

          <SectionHeader icon="account-circle-outline" title="Personal Details" />

          <CustomField
            label="Name"
            required
            placeholder="Enter your full name"
            hint="Eg John Deo"
            icon="account-outline"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <CustomField
            label="Email"
            required
            placeholder="Enter your email address"
            hint="Eg johndeo@gmail.com"
            icon="email-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomField
            label="Phone Number"
            required
            placeholder="Enter 10-digit number"
            hint="Eg 9876543210"
            icon="phone-outline"
            prefix="+91"
            value={phone}
            onChangeText={(value) => setPhone(value.replace(/\D/g, ""))}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* COMPANY DETAILS */}

          {showCompanySection && (
            <>
              <SectionHeader icon="domain" title="Company Details" />

              {showCompanyName && (
                <CustomField
                  label={companyLabel}
                  required
                  placeholder={`Enter your ${companyLabel.toLowerCase()}`}
                  hint="Eg John Deo Pvt Ltd"
                  icon="domain"
                  value={companyName}
                  onChangeText={setCompanyName}
                  autoCapitalize="words"
                />
              )}

              <CustomField
                label={gstRequired ? "GST Number" : "GST Number (Optional)"}
                required={gstRequired}
                placeholder="Enter 15-character GSTIN"
                hint="Eg 36ABCDE1234F1Z5"
                icon="file-document-outline"
                value={gstNumber}
                onChangeText={(value) =>
                  setGstNumber(value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
                }
                autoCapitalize="characters"
                maxLength={15}
              />

              {roleField === "designation" ? (
                <CustomField
                  label="Designation"
                  required
                  placeholder="Enter your role"
                  hint="Eg Fleet Manager"
                  icon="badge-account-horizontal-outline"
                  value={designation}
                  onChangeText={setDesignation}
                  autoCapitalize="words"
                />
              ) : (
                <CustomSelect
                  label="Business Type"
                  required
                  icon="briefcase-outline"
                  options={BUSINESS_TYPES}
                  value={businessType}
                  onSelect={setBusinessType}
                />
              )}
            </>
          )}

          {/* DELIVERY ADDRESS */}

          <SectionHeader icon="map-marker-outline" title="Delivery Address" />

          <CustomField
            label="Address"
            required
            placeholder="Building, street, area"
            hint="Eg Plot 12, Madhapur Main Road"
            icon="home-outline"
            value={addressLine}
            onChangeText={setAddressLine}
          />

          <View style={styles.row}>
            <CustomField
              label="City"
              required
              placeholder="City"
              hint="Eg Hyderabad"
              icon="city-variant-outline"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              containerStyle={styles.half}
            />

            <CustomField
              label="State"
              required
              placeholder="State"
              hint="Eg Telangana"
              icon="map-outline"
              value={state}
              onChangeText={setState}
              autoCapitalize="words"
              containerStyle={styles.half}
            />
          </View>

          <CustomField
            label="Pincode"
            required
            placeholder="Enter 6-digit pincode"
            hint="Eg 500081"
            icon="map-marker-radius-outline"
            value={pincode}
            onChangeText={(value) => setPincode(value.replace(/\D/g, ""))}
            keyboardType="number-pad"
            maxLength={6}
          />

  
        </ScrollView>

        {/* BOTTOM BUTTON */}

        <View
          style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}
        >
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            loading={submitting}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// STYLES

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  half: {
    flex: 1,
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
});
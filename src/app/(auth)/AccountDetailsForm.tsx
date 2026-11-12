import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import CustomField from "@/components/Customfield";
import CustomHeader from "@/components/Customheader";
import CustomSelect from "@/components/Customselect";
import PrimaryButton from "@/components/PrimaryButton";
import SearchDropdown, { DropdownOption } from "@/components/SearchDropdown";
import SectionHeader from "@/components/Sectionheader";

import indiaData from "@/assets/indiaData.json";

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
  district: string;
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

// state -> district -> list of cities (with pincode). Cities may be empty.
type CityRow = { city: string; pincode: string };
const DATA = indiaData as Record<string, Record<string, CityRow[]>>;

const STATE_OPTIONS: DropdownOption[] = Object.keys(DATA).map((s) => ({
  label: s,
  value: s,
}));

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
const PHONE_REGEX = /^\d{7,15}$/;
const PINCODE_REGEX = /^\d{6}$/;
const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

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

  // Personal details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Country picker
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("91");

  const fullPhoneNumber = `+${callingCode}${phone}`;

  // Company details
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [businessType, setBusinessType] = useState<string | null>(null);

  // Address details
  const [addressLine, setAddressLine] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [monthlyRequirement] = useState("");
  const [referralCode] = useState("");
  const [source] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Options are calculated straight from the JSON data
  const districtOptions: DropdownOption[] = useMemo(
    () =>
      state
        ? Object.keys(DATA[state] ?? {}).map((d) => ({ label: d, value: d }))
        : [],
    [state]
  );

  const cityOptions: DropdownOption[] = useMemo(
    () =>
      state && district
        ? (DATA[state]?.[district] ?? []).map((c) => ({
            label: c.city,
            value: c.city,
            subtitle: c.pincode,
          }))
        : [],
    [state, district]
  );

  // If a district has no cities in the data, the user types city manually
  const cityIsManual = !!district && cityOptions.length === 0;

  // Country selection
  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "91");
    setPhone("");
  };

  // Phone validation
  const validatePhone = (): boolean => {
    if (!PHONE_REGEX.test(phone)) {
      return false;
    }

    if (countryCode === "IN") {
      return /^[6-9]\d{9}$/.test(phone);
    }

    return true;
  };

  // Form validation
  const getInvalidFields = (): string[] => {
    const invalid: string[] = [];

    if (!name.trim()) {
      invalid.push("Name");
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      invalid.push("Email");
    }

    if (!validatePhone()) {
      invalid.push("Valid Phone Number");
    }

    if (showCompanySection) {
      if (showCompanyName && !companyName.trim()) {
        invalid.push(companyLabel);
      }

      const gstOk = gstRequired
        ? GST_REGEX.test(gstNumber)
        : gstNumber === "" || GST_REGEX.test(gstNumber);

      if (!gstOk) {
        invalid.push("GST Number (15-character GSTIN)");
      }

      if (roleField === "designation") {
        if (!designation.trim()) {
          invalid.push("Designation");
        }
      } else if (businessType === null) {
        invalid.push("Business Type");
      }
    }

    if (!addressLine.trim()) {
      invalid.push("Address");
    }

    if (!state.trim()) {
      invalid.push("State");
    }

    if (!district.trim()) {
      invalid.push("District");
    }

    if (!city.trim()) {
      invalid.push("City");
    }

    if (!PINCODE_REGEX.test(pincode)) {
      invalid.push("Pincode (6 digits)");
    }

    return invalid;
  };

  // Continue
  const handleContinue = async (): Promise<void> => {
    if (submitting) return;

    Keyboard.dismiss();

    const invalidFields = getInvalidFields();

    if (invalidFields.length > 0) {
      showAlert(
        "Incomplete Details",
        `Please fix the following:\n\n• ${invalidFields.join("\n• ")}`
      );
      return;
    }

    const formData: AccountDetailsValues = {
      name: name.trim(),
      email: email.trim(),

      // International phone number
      phone: fullPhoneNumber,

      companyName: companyName.trim(),
      gstNumber,
      designation: designation.trim(),
      businessType: businessType ?? "",

      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      district: district.trim(),
      pincode,

      monthlyRequirement,
      referralCode: referralCode.trim(),
      source: source ?? "",
    };

    setSubmitting(true);

    try {
      console.log("[AccountDetailsForm] Submitting:", formData);

      await onSubmit?.(formData);

      router.replace("/(tabs)/(home)");
    } catch (error) {
      console.log("[AccountDetailsForm] Submit error:", error);

      showAlert(
        "Something went wrong",
        "Could not save your details. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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

          <SectionHeader
            icon="account-circle-outline"
            title="Personal Details"
          />

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

          {/* PHONE NUMBER */}

          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>Phone Number *</Text>

            <View style={styles.phoneInput}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withCallingCodeButton
                onSelect={handleCountrySelect}
              />

              <View style={styles.phoneDivider} />

              <TextInput
                style={styles.phoneTextInput}
                placeholder="Enter phone number"
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value.replace(/\D/g, "").slice(0, 15));
                }}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <Text style={styles.phoneHint}>
              {phone
                ? `Selected number: ${fullPhoneNumber}`
                : `Country code: +${callingCode}`}
            </Text>
          </View>

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

          <SearchDropdown
            label="State"
            placeholder="Select State"
            value={state}
            options={STATE_OPTIONS}
            onSelect={(o) => {
              setState(o.value);
              setDistrict("");
              setCity("");
              setPincode("");
            }}
          />

          <SearchDropdown
            label="District"
            placeholder={!state ? "Select State First" : "Select District"}
            value={district}
            options={districtOptions}
            disabled={!state}
            onSelect={(o) => {
              setDistrict(o.value);
              setCity("");
              setPincode("");
            }}
          />

          {/* CITY: searchable list when data exists, manual entry otherwise */}

          {cityIsManual ? (
            <CustomField
              label="City / Area"
              required
              placeholder="Enter city or area"
              hint="Eg Hyderabad"
              icon="city-variant-outline"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          ) : (
            <SearchDropdown
              label="City / Area"
              placeholder={
                !district ? "Select District First" : "Select City / Area"
              }
              value={city}
              options={cityOptions}
              disabled={!district}
              onSelect={(o) => {
                setCity(o.value);
                setPincode(o.subtitle ?? ""); // autofill pincode
              }}
            />
          )}

          {/* PINCODE */}

          <CustomField
            label="Pincode"
            required
            placeholder="Enter 6-digit pincode"
            hint="Eg 500081"
            icon="map-marker-radius-outline"
            value={pincode}
            onChangeText={(value) =>
              setPincode(value.replace(/\D/g, "").slice(0, 6))
            }
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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },

  phoneContainer: {
    marginBottom: 18,
  },

  phoneLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  phoneInput: {
    height: 55,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },

  phoneDivider: {
    height: 25,
    width: 1,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 12,
  },

  phoneTextInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#0F172A",
  },

  phoneHint: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
});
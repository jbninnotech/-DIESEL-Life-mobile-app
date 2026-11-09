import PrimaryButton from "@/components/PrimaryButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PhoneLoginState {
  phone: string;
  focused: boolean;
}

const HERO_IMAGE =
  "https://res.cloudinary.com/yozeshlg/image/upload/v1794206419/WhatsApp_Image_2026-11-09_at_12.09.51_PM.jpg";

const TERMS_URL = "https://example.com/terms";
const PRIVACY_URL = "https://example.com/privacy";

const HERO_HEIGHT = Dimensions.get("window").height * 0.4;

export default function PhoneLogin(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState<PhoneLoginState["phone"]>("");
  const [focused, setFocused] = useState<PhoneLoginState["focused"]>(false);

  const canSubmit = /^[6-9]\d{9}$/.test(phone);

  const handlePhoneChange = (value: string): void => {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSendOtp = (): void => {
    if (!canSubmit) return;

    router.push({
      pathname: "/otpVerified",
      params: { phone },
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Image
        source={{ uri: HERO_IMAGE }}
        style={styles.hero}
        contentFit="cover"
        transition={200}
      />

      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Let's Fuel Your <Text style={styles.titleAccent}>Journey!</Text>
          </Text>

          <Text style={styles.subtitle}>
            Order quality diesel and get it delivered to your doorstep. Fast,
            safe and reliable fuel delivery with Dieselify.
          </Text>

          <Text style={styles.label}>Mobile Number</Text>

          <View
            style={[
              styles.field,
              focused && styles.fieldFocused,
              phone.length > 0 && !canSubmit && styles.fieldError,
            ]}
          >
            <View style={styles.country}>
              <Text style={styles.code}>+91</Text>
              <View style={styles.divider} />
            </View>

            <TextInput
              style={styles.input}
              value={phone}
              placeholder="98767 89088"
              placeholderTextColor="#A0A4AB"
              onChangeText={handlePhoneChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="phone-pad"
              maxLength={10}
              selectionColor="#0875D1"
            />
          </View>

          <Text
            style={[
              styles.hint,
              phone.length > 0 && !canSubmit && styles.hintError,
            ]}
          >
            {phone.length > 0 && !canSubmit
              ? "Enter a valid 10-digit number starting with 6-9"
              : "We'll send a 4-digit OTP to verify your number"}
          </Text>
        </View>

        <View
          style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}
        >
          <PrimaryButton
            title="Send OTP"
            onPress={handleSendOtp}
            disabled={!canSubmit}
            loading={false}
          />

          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text
              style={styles.bold}
              onPress={() => Linking.openURL(TERMS_URL)}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={styles.bold}
              onPress={() => Linking.openURL(PRIVACY_URL)}
            >
              Privacy Policy.
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
  },

  hero: {
    width: "100%",
    height: HERO_HEIGHT,
  },

  sheet: {
    flex: 1,
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 36,
    justifyContent: "space-between",
  },

  content: {
    flexGrow: 1,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F3FC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0875D1",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0875D1",
    letterSpacing: -0.6,
    marginBottom: 2,
  },

  titleAccent: {
    color: "#16A34A",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    color: "#475569",
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#c9c9ce",
    borderRadius: 8,
    height: 54,
    paddingHorizontal: 12,
  },

  fieldFocused: {
    borderColor: "#0875D1",
  },

  fieldError: {
    borderColor: "#E5484D",
  },

  country: {
    flexDirection: "row",
    alignItems: "center",
  },

  code: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
    marginRight: 10,
  },

  divider: {
    width: 1,
    height: 25,
    backgroundColor: "#c9c9ce",
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    marginLeft: 2,
    paddingVertical: 8,
  },

  hint: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
    marginLeft: 4,
    lineHeight: 18,
  },

  hintError: {
    color: "#E5484D",
  },

  bottomSection: {
    paddingTop: 12,
  },

  terms: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: "#475569",
  },

  bold: {
    fontWeight: "700",
    color: "#0875D1",
  },
});

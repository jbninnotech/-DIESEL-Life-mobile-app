import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const HERO_IMAGE =
  "https://res.cloudinary.com/yozeshlg/image/upload/f_auto,q_auto,w_1200/v1794206419/WhatsApp_Image_2026-11-09_at_12.09.51_PM.jpg";

const TERMS_URL = "https://example.com/terms";
const PRIVACY_URL = "https://example.com/privacy";

const COLORS = {
  navy: "#0A2A6C",
  blue: "#0B63D1",
  green: "#4CC74A",
  greenText: "#16A34A",
  border: "#CBD5E1",
  error: "#E5484D",
  muted: "#64748B",
  white: "#FFFFFF",
};

const OTP_DIGITS = 6;

const capCircle = (width: number, capHeight: number) => {
  const r = ((width * width) / 4 + capHeight * capHeight) / (2 * capHeight);
  return { r, size: r * 2 };
};

export default function PhoneLogin(): React.JSX.Element {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  const canSubmit = /^[6-9]\d{9}$/.test(phone);
  const showError = phone.length > 0 && !canSubmit;

  const heroHeight = Math.min(height * 0.42, 400);
  const heroCap = capCircle(width, 44);
  const bottomGreen = capCircle(width, 70);
  const bottomBlue = capCircle(width, 44);

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
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />

      <View pointerEvents="none" style={[styles.bottomWave, { width }]}>
        <View
          style={{
            position: "absolute",
            width: bottomGreen.size,
            height: bottomGreen.size,
            borderRadius: bottomGreen.r,
            backgroundColor: COLORS.green,
            left: width / 2 - bottomGreen.r - 50,
            top: 0,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: bottomBlue.size,
            height: bottomBlue.size,
            borderRadius: bottomBlue.r,
            backgroundColor: COLORS.blue,
            left: width / 2 - bottomBlue.r + 40,
            top: 30,
          }}
        />
      </View>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={[styles.hero, { height: heroHeight }]}>
          <Image
            source={{ uri: HERO_IMAGE }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />

          <View
            style={{
              position: "absolute",
              width: heroCap.size,
              height: heroCap.size,
              borderRadius: heroCap.r,
              backgroundColor: COLORS.green,
              left: width / 2 - heroCap.r + 60,
              top: heroHeight - 44 - 12,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: heroCap.size,
              height: heroCap.size,
              borderRadius: heroCap.r,
              backgroundColor: COLORS.blue,
              left: width / 2 - heroCap.r + 25,
              top: heroHeight - 44 - 7,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: heroCap.size,
              height: heroCap.size,
              borderRadius: heroCap.r,
              backgroundColor: COLORS.white,
              left: width / 2 - heroCap.r,
              top: heroHeight - 44,
            }}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Let's Fuel Your <Text style={styles.titleAccent}>Journey!</Text>
          </Text>

          <Text style={styles.subtitle}>
            Order quality diesel and get it delivered to your doorstep. Fast,
            safe and reliable fuel delivery with Diesel Life.
          </Text>

          <Text style={styles.label}>Mobile Number</Text>

          <View
            style={[
              styles.field,
              focused && styles.fieldFocused,
              showError && styles.fieldError,
            ]}
          >
            <View style={styles.country}>
              <Text style={styles.code}>+91</Text>
              <View style={styles.divider} />
            </View>

            <TextInput
              style={styles.input}
              value={phone}
              placeholder="98765 43210"
              placeholderTextColor="#A0A4AB"
              onChangeText={handlePhoneChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="phone-pad"
              maxLength={10}
              selectionColor={COLORS.blue}
            />
          </View>

          <Text style={[styles.hint, showError && styles.hintError]}>
            {showError
              ? "Enter a valid 10-digit number starting with 6-9"
              : `We'll send a ${OTP_DIGITS}-digit OTP to verify your number`}
          </Text>

          <Pressable
            style={[styles.sendBtn, !canSubmit && styles.sendBtnOff]}
            onPress={handleSendOtp}
            disabled={!canSubmit}
          >
            <Text style={styles.sendText}>Send OTP</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={COLORS.white}
            />
          </Pressable>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 130,
  },

  hero: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#BFE3FA",
  },

  content: {
    paddingHorizontal: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.navy,
    letterSpacing: -0.6,
    marginTop: 4,
    marginBottom: 6,
  },

  titleAccent: {
    color: COLORS.greenText,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 8,
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    height: 58,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
  },

  fieldFocused: {
    borderColor: COLORS.blue,
    borderWidth: 2,
  },

  fieldError: {
    borderColor: COLORS.error,
  },

  country: {
    flexDirection: "row",
    alignItems: "center",
  },

  code: {
    fontSize: 17,
    color: COLORS.navy,
    fontWeight: "700",
    marginRight: 10,
  },

  divider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.border,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.navy,
    marginLeft: 2,
    paddingVertical: 8,
  },

  hint: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
    marginLeft: 4,
    lineHeight: 18,
    marginBottom: 20,
  },

  hintError: {
    color: COLORS.error,
  },

  sendBtn: {
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 4,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  sendBtnOff: {
    opacity: 0.5,
  },

  sendText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },

  terms: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: COLORS.muted,
  },

  bold: {
    fontWeight: "700",
    color: COLORS.blue,
  },

  bottomWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 90,
    overflow: "hidden",
  },
});
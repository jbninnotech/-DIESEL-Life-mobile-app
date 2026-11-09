import React, { useEffect, useRef, useState } from "react";

import CustomHeader from "@/components/Customheader";
import PrimaryButton from "@/components/PrimaryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OtpScreenState {
  digits: string[];
  focusedIndex: number;
  seconds: number;
}

const OTP_LENGTH = 4;
const RESEND_SECONDS = 59;

type TextInputRef = React.ElementRef<typeof TextInput>;

export default function OtpVerified(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { phone } = useLocalSearchParams<{ phone: string }>();

  const phoneNumber = Array.isArray(phone) ? phone[0] : phone ?? "";

  const [digits, setDigits] = useState<OtpScreenState["digits"]>(
    Array(OTP_LENGTH).fill("")
  );

  const [focusedIndex, setFocusedIndex] =
    useState<OtpScreenState["focusedIndex"]>(0);

  const [seconds, setSeconds] =
    useState<OtpScreenState["seconds"]>(RESEND_SECONDS);

  const inputs = useRef<Array<TextInputRef | null>>([]);

  const isOtpValid = digits.every((digit) => digit !== "");

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const focusBox = (index: number): void => {
    setFocusedIndex(index);
    inputs.current[index]?.focus();
  };

  const handleOtpChange = (value: string, index: number): void => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length > 1) {
      const current = digits[index];

      if (current !== "" && numericValue.length === 2) {
        const typedDigit = numericValue.replace(current, "").slice(-1);
        const next = [...digits];
        next[index] = typedDigit;
        setDigits(next);

        if (index < OTP_LENGTH - 1) {
          focusBox(index + 1);
        }

        return;
      }

      const pastedDigits = numericValue.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");

      pastedDigits.forEach((digit, i) => {
        next[i] = digit;
      });

      setDigits(next);
      focusBox(Math.min(pastedDigits.length, OTP_LENGTH - 1));

      return;
    }

    const next = [...digits];
    next[index] = numericValue;
    setDigits(next);

    if (numericValue && index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number): void => {
    if (key === "Backspace" && digits[index] === "" && index > 0) {
      const next = [...digits];
      next[index - 1] = "";

      setDigits(next);
      focusBox(index - 1);
    }
  };

  const handleVerify = (): void => {
    if (!isOtpValid) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/(auth)/account-type",
    });
  };

  const handleResend = (): void => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setSeconds(RESEND_SECONDS);
    focusBox(0);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <CustomHeader title="" pageName="Verify OTP" />

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Number</Text>

        <Text style={styles.subtitle}>
          We've sent a 4-digit verification code to
          {phoneNumber ? ` +91 ${phoneNumber}` : " your mobile number"}. Please
          enter it below to continue.
        </Text>

        <Text style={styles.label}>Enter Verification Code</Text>

        <View style={styles.boxes}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[
                styles.otpBox,
                focusedIndex === index && styles.otpBoxFocused,
                digit !== "" && styles.otpBoxFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              onFocus={() => setFocusedIndex(index)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          {seconds > 0 ? (
            <View style={styles.timerPill}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={16}
                color="#0875D1"
              />
              <Text style={styles.resendText}>
                Resend code in{" "}
                <Text style={styles.timer}>
                  00:{seconds.toString().padStart(2, "0")}
                </Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              activeOpacity={0.7}
              style={styles.resendButton}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={18}
                color="#16A34A"
              />
              <Text style={styles.resendActive}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}
      >
        <PrimaryButton
          title="Verify & Continue"
          onPress={handleVerify}
          disabled={!isOtpValid}
          loading={false}
        />

        <View style={styles.footerRow}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={14}
            color="#94A3B8"
          />
          <Text style={styles.footerText}>
            Your mobile number is securely verified with Dieselify.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0875D1",
    letterSpacing: -0.5,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },

  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  otpBox: {
    flex: 1,
    height: 66,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    fontSize: 25,
    fontWeight: "700",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },

  otpBoxFocused: {
    borderColor: "#0875D1",
    borderWidth: 2,
    backgroundColor: "#F8FBFF",
  },

  otpBoxFilled: {
    borderColor: "#16A34A",
    backgroundColor: "#F8FBFF",
  },

  resendContainer: {
    marginTop: 26,
    alignItems: "center",
  },

  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8F3FC",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  resendText: {
    fontSize: 13,
    color: "#64748B",
  },

  timer: {
    color: "#0875D1",
    fontWeight: "700",
  },

  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },

  resendActive: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
  },

  bottomSection: {
    marginTop: "auto",
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },

  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});
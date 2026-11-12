import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";


const COLORS = {
  navy: "#0A2A6C",
  blue: "#0B63D1",
  blueLight: "#EAF2FD",
  green: "#4CC74A",
  border: "#CBD5E1",
  muted: "#64748B",
  white: "#FFFFFF",
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type TextInputRef = React.ElementRef<typeof TextInput>;

const capCircle = (width: number, capHeight: number) => {
  const radius = (width * width) / 4 + capHeight * capHeight;
  const r = radius / (2 * capHeight);
  return { r, size: r * 2 };
};

export default function OtpVerified(): React.JSX.Element {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const { phone } = useLocalSearchParams<{ phone: string }>();
  const phoneNumber = Array.isArray(phone) ? phone[0] : phone ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const inputs = useRef<Array<TextInputRef | null>>([]);

  const isOtpValid = digits.every((digit) => digit !== "");

  const heroHeight = Math.min(height * 0.43, 400);
  const heroCap = capCircle(width, 44);
  const bottomGreen = capCircle(width, 70);
  const bottomBlue = capCircle(width, 44);
const HERO_IMAGE = {
  uri: "https://res.cloudinary.com/yozeshlg/image/upload/v1794483211/Diesel_Life_Fuel_Truck_on_Highway.png",
};
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

  const handleChangeNumber = (): void => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <View
        pointerEvents="none"
        style={[styles.bottomWave, { width }]}
      >
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
            source={HERO_IMAGE}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
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
          <Text style={styles.title}>OTP Verification</Text>

          <Text style={styles.subtitle}>
            Enter the {OTP_LENGTH} digit OTP sent to
          </Text>

          <Pressable
            style={styles.phoneRow}
            onPress={handleChangeNumber}
            hitSlop={8}
          >
            <Text style={styles.phone}>
              {phoneNumber ? `+91 ${phoneNumber}` : "your mobile number"}
            </Text>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={COLORS.blue}
            />
          </Pressable>

          <View style={styles.boxes}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit !== "" && styles.otpBoxFilled,
                  focusedIndex === index && styles.otpBoxFocused,
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
              <Text style={styles.resendText}>
                Resend OTP in{" "}
                <Text style={styles.timer}>
                  00:{seconds.toString().padStart(2, "0")}
                </Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend} hitSlop={8}>
                <Text style={styles.resendActive}>Resend OTP</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            style={[styles.verifyBtn, !isOtpValid && styles.verifyBtnOff]}
            onPress={handleVerify}
            disabled={!isOtpValid}
          >
            <Text style={styles.verifyText}>Verify</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={COLORS.white}
            />
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable onPress={handleChangeNumber} hitSlop={8}>
            <Text style={styles.changeText}>Change Mobile Number</Text>
          </Pressable>
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
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.navy,
    letterSpacing: -0.5,
    marginTop: 4,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.navy,
    marginTop: 8,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    marginBottom: 22,
  },

  phone: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.navy,
  },

  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    gap: 10,
  },

  otpBox: {
    flex: 1,
    height: 60,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.navy,
    backgroundColor: COLORS.white,
    paddingHorizontal: 0,
  },

  otpBoxFilled: {
    borderColor: "#93B8EC",
    backgroundColor: "#F8FBFF",
  },

  otpBoxFocused: {
    borderColor: COLORS.blue,
    borderWidth: 2,
  },

  resendContainer: {
    marginTop: 18,
    marginBottom: 18,
    alignItems: "center",
  },

  resendText: {
    fontSize: 15,
    color: COLORS.navy,
  },

  timer: {
    color: COLORS.blue,
    fontWeight: "700",
  },

  resendActive: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.blue,
  },

  verifyBtn: {
    alignSelf: "stretch",
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

  verifyBtnOff: {
    opacity: 0.5,
  },

  verifyText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 14,
    marginTop: 22,
    marginBottom: 18,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  orText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.navy,
  },

  changeText: {
    fontSize: 17,
    fontWeight: "600",
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
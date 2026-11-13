import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

interface Props {
  otpCode: string; // The generated demo OTP
  isVerified: boolean;
  onVerify: (otp: string) => Promise<boolean>;
}

export const FlowDeliveryOtpCard: React.FC<Props> = ({ otpCode, isVerified, onVerify }) => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async () => {
    if (enteredOtp.length < 4) {
      setErrorMsg("Please enter the 4-digit OTP.");
      return;
    }
    setErrorMsg("");
    setIsVerifying(true);
    const success = await onVerify(enteredOtp);
    setIsVerifying(false);
    if (!success) {
      setErrorMsg("Incorrect OTP. Please enter the code shown below.");
    }
  };

  const fillDemoOtp = () => {
    setEnteredOtp(otpCode);
  };

  return (
    <View style={[styles.card, isVerified && styles.cardVerified]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, isVerified && styles.iconCircleVerified]}>
          <MaterialCommunityIcons
            name={isVerified ? "check-circle" : "shield-key"}
            size={22}
            color={isVerified ? "#16A34A" : THEME.colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {isVerified ? "OTP Verified & Fuel Dispensed" : "Secure Delivery OTP"}
          </Text>
          <Text style={styles.subtitle}>
            {isVerified
              ? "Safe fueling complete. Digital meter sign-off recorded."
              : "Share this OTP with driver only when bowser is on-site."}
          </Text>
        </View>
      </View>

      {!isVerified ? (
        <>
          {/* OTP Code Display Box */}
          <View style={styles.otpBox}>
            <Text style={styles.otpLabel}>Your 4-Digit Delivery OTP (Demo)</Text>
            <Text style={styles.otpCode}>{otpCode}</Text>
            <TouchableOpacity onPress={fillDemoOtp} style={styles.autoFillBtn}>
              <Text style={styles.autoFillText}>Tap to autofill demo OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Verification Input Strip */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.otpInput}
              value={enteredOtp}
              onChangeText={(t) => {
                setEnteredOtp(t.replace(/[^0-9]/g, ""));
                setErrorMsg("");
              }}
              placeholder="Enter 4-digit OTP"
              keyboardType="number-pad"
              maxLength={4}
              placeholderTextColor={THEME.colors.textMuted}
            />

            <TouchableOpacity
              style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.verifyBtnText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        </>
      ) : (
        <View style={styles.successBadge}>
          <MaterialCommunityIcons name="gas-station-in-use" size={20} color="#166534" />
          <Text style={styles.successText}>
            Dispense Approved. High-density fuel delivery successfully verified.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  cardVerified: {
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleVerified: {
    backgroundColor: "#DCFCE7",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  otpBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
  },
  otpCode: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 6,
    color: THEME.colors.primary,
    marginVertical: 4,
  },
  autoFillBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  autoFillText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  otpInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    fontWeight: "700",
  },
  verifyBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnDisabled: {
    opacity: 0.6,
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  errorText: {
    color: THEME.colors.danger,
    fontSize: 11,
    marginTop: 6,
    fontWeight: "600",
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DCFCE7",
    padding: 10,
    borderRadius: 10,
  },
  successText: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "700",
    flex: 1,
  },
});

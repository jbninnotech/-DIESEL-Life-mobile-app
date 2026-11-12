import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { changePasswordSchema, ChangePasswordFormData } from "../../schemas/profileSchemas";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (_data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
      Alert.alert(
        "Password Updated",
        "Your password has been changed successfully. Use your new credentials for future logins.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 700);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Change Password" subtitle="Keep your fleet account safe" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Security Notice */}
          <View style={styles.noticeBox}>
            <MaterialCommunityIcons name="shield-lock-outline" size={24} color={THEME.colors.primary} />
            <Text style={styles.noticeText}>
              Password must be at least 8 characters long and include an uppercase letter, lowercase letter, and a number.
            </Text>
          </View>

          {/* Current Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Password *</Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.currentPassword && styles.inputError]}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color={THEME.colors.textMuted} />
                  <TextInput
                    style={styles.innerInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter current password"
                    placeholderTextColor={THEME.colors.textMuted}
                    secureTextEntry={!showCurrent}
                  />
                  <TouchableOpacity onPress={() => setShowCurrent((prev) => !prev)}>
                    <MaterialCommunityIcons
                      name={showCurrent ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={THEME.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
            )}
          </View>

          {/* New Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>New Password *</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.newPassword && styles.inputError]}>
                  <MaterialCommunityIcons name="lock-plus-outline" size={20} color={THEME.colors.textMuted} />
                  <TextInput
                    style={styles.innerInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter new strong password"
                    placeholderTextColor={THEME.colors.textMuted}
                    secureTextEntry={!showNew}
                  />
                  <TouchableOpacity onPress={() => setShowNew((prev) => !prev)}>
                    <MaterialCommunityIcons
                      name={showNew ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={THEME.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword.message}</Text>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm New Password *</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.confirmPassword && styles.inputError]}>
                  <MaterialCommunityIcons name="lock-check-outline" size={20} color={THEME.colors.textMuted} />
                  <TextInput
                    style={styles.innerInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Re-enter new password"
                    placeholderTextColor={THEME.colors.textMuted}
                    secureTextEntry={!showConfirm}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm((prev) => !prev)}>
                    <MaterialCommunityIcons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={THEME.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && styles.btnDisabled]}
            disabled={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="shield-check" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.primaryLight,
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: "rgba(8, 117, 209, 0.2)",
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.primaryDark,
    lineHeight: 18,
    fontWeight: "600",
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.textPrimary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  inputError: {
    borderColor: THEME.colors.danger,
  },
  innerInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  errorText: {
    fontSize: 12,
    color: THEME.colors.danger,
    fontWeight: "600",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    marginTop: 12,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

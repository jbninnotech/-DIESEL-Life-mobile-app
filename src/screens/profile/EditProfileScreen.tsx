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
  Image,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../../constants/theme";
import { MOCK_USER } from "../../data/mockData";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { editProfileSchema, EditProfileFormData } from "../../schemas/profileSchemas";

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      phone: "9876543210",
      dob: MOCK_USER.dob,
      gender: MOCK_USER.gender,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Profile Updated",
        `Changes saved successfully for ${data.name}.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 600);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Edit Profile" subtitle="Update personal & fleet contact details" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar edit */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => Alert.alert("Upload Photo", "Choose photo from gallery or take a new one.")}
              >
                <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap to change avatar</Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.name && styles.inputError]}>
                  <MaterialCommunityIcons name="account-outline" size={20} color={THEME.colors.textMuted} />
                  <ControllerInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter full name"
                  />
                </View>
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.email && styles.inputError]}>
                  <MaterialCommunityIcons name="email-outline" size={20} color={THEME.colors.textMuted} />
                  <ControllerInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="name@company.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>10-Digit Mobile Number *</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, errors.phone && styles.inputError]}>
                  <Text style={styles.prefixText}>+91</Text>
                  <ControllerInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="9876543210"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Controller
              control={control}
              name="dob"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrap}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color={THEME.colors.textMuted} />
                  <ControllerInput
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="DD MMM YYYY (e.g. 14 Aug 1991)"
                  />
                </View>
              )}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && styles.btnDisabled]}
            disabled={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>
              {isSubmitting ? "Saving Changes..." : "Save Profile Changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Simple internal helper for text inputs inside Controller
function ControllerInput(props: any) {
  return (
    <TextInput
      style={styles.innerInput}
      placeholderTextColor={THEME.colors.textMuted}
      {...props}
    />
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
  avatarSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: THEME.colors.primary,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarHint: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 6,
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
  prefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.textSecondary,
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
    shadowColor: THEME.colors.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
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

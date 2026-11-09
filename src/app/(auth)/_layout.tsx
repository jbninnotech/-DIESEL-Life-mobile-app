import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SpalashAnimation" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="otpVerified" />
      <Stack.Screen name="resetPassword" />
      <Stack.Screen name="updatePassword" />
      <Stack.Screen name="AccountDetailsFrom" />
      <Stack.Screen name="OrganizationDetails" />
      <Stack.Screen name="BusinessDetails" />
    </Stack>
  );
}
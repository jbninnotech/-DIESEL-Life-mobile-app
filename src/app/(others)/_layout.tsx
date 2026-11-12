import { Stack } from "expo-router";

export default function OthersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Emergencydiesel" />
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="ChangePassword" />
      <Stack.Screen name="MyVehicles" />
      <Stack.Screen name="SavedAddresses" />
      <Stack.Screen name="Wallet" />
      <Stack.Screen name="TransactionHistory" />
      <Stack.Screen name="NotificationSettings" />
      <Stack.Screen name="HelpCentre" />
      <Stack.Screen name="FAQ" />
      <Stack.Screen name="About" />
      <Stack.Screen name="PrivacyPolicy" />
      <Stack.Screen name="Terms" />
    </Stack>
  );
}

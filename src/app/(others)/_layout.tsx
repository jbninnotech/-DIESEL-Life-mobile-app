import { Stack } from "expo-router";

export default function OthersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen  name="Emergencydiesel" />
      
    </Stack>
  );
}

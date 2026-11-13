import { Stack } from "expo-router";
import React from "react";
import { BookingWorkflowProvider } from "../context/BookingWorkflowContext";

export default function RootLayout() {
  return (
    <BookingWorkflowProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(others)" />
      </Stack>
    </BookingWorkflowProvider>
  );
}

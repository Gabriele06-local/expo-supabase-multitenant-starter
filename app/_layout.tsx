import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../lib/AuthContext";
import { OrgProvider } from "../lib/OrgContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrgProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </OrgProvider>
    </AuthProvider>
  );
}
